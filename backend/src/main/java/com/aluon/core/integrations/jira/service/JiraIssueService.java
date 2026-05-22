package com.aluon.core.integrations.jira.service;

import com.aluon.core.integrations.jira.config.JiraProperties;
import com.aluon.core.integrations.jira.dto.CreateJiraIssueRequest;
import com.aluon.core.integrations.jira.dto.CreateJiraIssueResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class JiraIssueService {

    private final JiraProperties props;
    private final RestClient jiraRestClient;

    public CreateJiraIssueResponse createIssue(CreateJiraIssueRequest request) {
        assertEnabledAndConfigured();

        JiraCreateIssueBody body = JiraCreateIssueBody.from(props.projectKey(), props.issueTypeName(), request.summary(), request.description());

        JiraCreateIssueResponsePayload payload = jiraRestClient
                .post()
                .uri("/rest/api/3/issue")
                .body(body)
                .retrieve()
                .body(JiraCreateIssueResponsePayload.class);

        if (payload == null || !StringUtils.hasText(payload.key())) {
            throw new IllegalArgumentException("No se ha podido crear el ticket en Jira");
        }

        String browseUrl = props.baseUrl().replaceAll("/+$", "") + "/browse/" + payload.key();
        return new CreateJiraIssueResponse(payload.key(), payload.self(), browseUrl);
    }

    private void assertEnabledAndConfigured() {
        if (!props.enabled()) throw new IllegalArgumentException("Integración con Jira deshabilitada");
        if (!StringUtils.hasText(props.baseUrl())) throw new IllegalArgumentException("Jira no configurado: falta baseUrl");
        if (!StringUtils.hasText(props.username())) throw new IllegalArgumentException("Jira no configurado: falta username");
        if (!StringUtils.hasText(props.apiToken())) throw new IllegalArgumentException("Jira no configurado: falta apiToken");
        if (!StringUtils.hasText(props.projectKey())) throw new IllegalArgumentException("Jira no configurado: falta projectKey");
        if (!StringUtils.hasText(props.issueTypeName())) throw new IllegalArgumentException("Jira no configurado: falta issueTypeName");
    }

    private record JiraCreateIssueResponsePayload(String id, String key, String self) {
    }

    private record JiraCreateIssueBody(JiraFields fields) {
        static JiraCreateIssueBody from(String projectKey, String issueTypeName, String summary, String description) {
            var desc = JiraAdfDoc.fromPlainText(description);
            return new JiraCreateIssueBody(new JiraFields(
                    new JiraProject(projectKey),
                    summary,
                    desc,
                    new JiraIssueType(issueTypeName)
            ));
        }
    }

    private record JiraFields(JiraProject project, String summary, JiraAdfDoc description, JiraIssueType issuetype) {
    }

    private record JiraProject(String key) {
    }

    private record JiraIssueType(String name) {
    }

    private record JiraAdfDoc(String type, int version, JiraAdfNode[] content) {
        static JiraAdfDoc fromPlainText(String text) {
            if (!StringUtils.hasText(text)) {
                return new JiraAdfDoc("doc", 1, new JiraAdfNode[]{new JiraAdfNode("paragraph", new JiraAdfTextNode[]{new JiraAdfTextNode("text", "")})});
            }
            return new JiraAdfDoc("doc", 1, new JiraAdfNode[]{new JiraAdfNode("paragraph", new JiraAdfTextNode[]{new JiraAdfTextNode("text", text)})});
        }
    }

    private record JiraAdfNode(String type, JiraAdfTextNode[] content) {
    }

    private record JiraAdfTextNode(String type, String text) {
    }
}

