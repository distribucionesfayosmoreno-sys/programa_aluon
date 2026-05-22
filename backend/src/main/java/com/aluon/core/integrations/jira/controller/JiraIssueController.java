package com.aluon.core.integrations.jira.controller;

import com.aluon.core.integrations.jira.dto.CreateJiraIssueRequest;
import com.aluon.core.integrations.jira.dto.CreateJiraIssueResponse;
import com.aluon.core.integrations.jira.service.JiraIssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/integrations/jira")
@RequiredArgsConstructor
public class JiraIssueController {

    private final JiraIssueService service;

    @PostMapping("/issues")
    public ResponseEntity<CreateJiraIssueResponse> createIssue(@Valid @RequestBody CreateJiraIssueRequest request) {
        return ResponseEntity.ok(service.createIssue(request));
    }
}

