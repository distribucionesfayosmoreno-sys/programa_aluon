package com.aluon.core.integrations.jira.dto;

public record CreateJiraIssueResponse(
        String key,
        String self,
        String browseUrl
) {
}

