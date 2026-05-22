package com.aluon.core.integrations.jira.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "integrations.jira")
public record JiraProperties(
        boolean enabled,
        String baseUrl,
        String username,
        String apiToken,
        String projectKey,
        String issueTypeName
) {
}

