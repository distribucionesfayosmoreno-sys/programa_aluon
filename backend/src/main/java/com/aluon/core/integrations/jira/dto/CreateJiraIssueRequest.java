package com.aluon.core.integrations.jira.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateJiraIssueRequest(
        @NotBlank @Size(max = 250) String summary,
        @Size(max = 20_000) String description
) {
}

