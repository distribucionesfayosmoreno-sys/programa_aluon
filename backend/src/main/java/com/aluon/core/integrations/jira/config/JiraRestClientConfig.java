package com.aluon.core.integrations.jira.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Configuration
@EnableConfigurationProperties(JiraProperties.class)
public class JiraRestClientConfig {

    @Bean
    RestClient jiraRestClient(JiraProperties props, RestClient.Builder builder) {
        if (!props.enabled() || !StringUtils.hasText(props.baseUrl())) {
            return builder.build();
        }

        var built = builder
                .baseUrl(props.baseUrl())
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        if (StringUtils.hasText(props.username()) && StringUtils.hasText(props.apiToken())) {
            built = built.defaultHeader(HttpHeaders.AUTHORIZATION, basicAuth(props.username(), props.apiToken()));
        }

        return built.build();
    }

    private static String basicAuth(String username, String apiToken) {
        String raw = username + ":" + apiToken;
        String encoded = Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
        return "Basic " + encoded;
    }
}

