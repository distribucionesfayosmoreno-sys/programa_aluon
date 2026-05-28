package com.aluon.core.integrations.jira.service;

import com.aluon.core.integrations.jira.config.JiraProperties;
import com.aluon.core.integrations.jira.dto.CreateJiraIssueRequest;
import com.aluon.core.integrations.jira.dto.CreateJiraIssueResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JiraIssueService {

    private final JiraProperties props;
    private final RestClient jiraRestClient;

    public CreateJiraIssueResponse createIssue(CreateJiraIssueRequest request) {
        return createIssueWithAttachments(request.summary(), request.description(), List.of());
    }

    public CreateJiraIssueResponse createIssueWithAttachments(String summary, String description, List<MultipartFile> attachments) {
        assertEnabledAndConfigured();
        String sanitizedSummary = sanitizeSummary(summary);
        String sanitizedDescription = description == null ? "" : description;

        JiraCreateIssueBody body = JiraCreateIssueBody.from(props.projectKey(), props.issueTypeName(), sanitizedSummary, sanitizedDescription);

        JiraCreateIssueResponsePayload payload;
        try {
            payload = jiraRestClient
                    .post()
                    .uri("/rest/api/3/issue")
                    .body(body)
                    .retrieve()
                    .body(JiraCreateIssueResponsePayload.class);
        } catch (RestClientResponseException ex) {
            throw mapJiraError("crear el ticket", ex);
        }

        if (payload == null || !StringUtils.hasText(payload.key())) {
            throw new IllegalArgumentException("No se ha podido crear el ticket en Jira");
        }

        uploadAttachmentsIfAny(payload.key(), attachments);

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

    private static String sanitizeSummary(String summary) {
        if (summary == null || summary.isBlank()) {
            throw new IllegalArgumentException("El resumen es obligatorio");
        }
        String trimmed = summary.trim();
        if (trimmed.length() > 250) {
            return trimmed.substring(0, 250);
        }
        return trimmed;
    }

    private void uploadAttachmentsIfAny(String issueKey, List<MultipartFile> attachments) {
        if (attachments == null || attachments.isEmpty()) return;

        List<MultipartFile> safeAttachments = new ArrayList<>();
        for (MultipartFile file : attachments) {
            if (file == null || file.isEmpty()) continue;
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Solo se permiten imágenes como adjuntos");
            }
            safeAttachments.add(file);
        }
        if (safeAttachments.isEmpty()) return;

        String path = UriComponentsBuilder
                .fromPath("/rest/api/3/issue/{key}/attachments")
                .buildAndExpand(issueKey)
                .toUriString();

        for (MultipartFile file : safeAttachments) {
            byte[] bytes;
            try {
                bytes = file.getBytes();
            } catch (IOException ex) {
                throw new IllegalArgumentException("No se pudo leer un adjunto");
            }

            var resource = new ByteArrayResource(bytes) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "attachment";
                }
            };

            var form = new org.springframework.util.LinkedMultiValueMap<String, Object>();
            form.add("file", resource);

            try {
                jiraRestClient
                        .post()
                        .uri(path)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("X-Atlassian-Token", "no-check")
                        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                        .body(form)
                        .retrieve()
                        .toBodilessEntity();
            } catch (RestClientResponseException ex) {
                throw mapJiraError("subir adjuntos", ex);
            }
        }
    }

    private IllegalArgumentException mapJiraError(String action, RestClientResponseException ex) {
        String status = String.valueOf(ex.getStatusCode().value());
        String body = "";
        try {
            body = ex.getResponseBodyAsString();
        } catch (Exception ignored) {
        }
        String trimmed = body == null ? "" : body.trim();
        String suffix = trimmed.isBlank() ? "" : " - " + trimmed;
        return new IllegalArgumentException("Jira: error al " + action + " (" + status + ")" + suffix);
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
