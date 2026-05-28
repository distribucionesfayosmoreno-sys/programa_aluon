package com.aluon.core.integrations.jira.controller;

import com.aluon.core.integrations.jira.dto.CreateJiraIssueRequest;
import com.aluon.core.integrations.jira.dto.CreateJiraIssueResponse;
import com.aluon.core.integrations.jira.service.JiraIssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/integrations/jira")
@RequiredArgsConstructor
public class JiraIssueController {

    private final JiraIssueService service;

    @PostMapping(value = "/issues", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateJiraIssueResponse> createIssue(@Valid @RequestBody CreateJiraIssueRequest request) {
        return ResponseEntity.ok(service.createIssue(request));
    }

    @PostMapping(value = "/issues", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateJiraIssueResponse> createIssueWithAttachments(
            @RequestParam("summary") String summary,
            @RequestParam(value = "description", required = false) String description,
            @RequestPart(value = "attachments", required = false) List<MultipartFile> attachments
    ) {
        return ResponseEntity.ok(service.createIssueWithAttachments(summary, description, attachments));
    }
}
