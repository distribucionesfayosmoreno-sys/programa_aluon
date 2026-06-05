package com.aluon.crm.social.controller;

import com.aluon.crm.social.dto.SocialMediaPublicationRequest;
import com.aluon.crm.social.dto.SocialMediaPublicationResponse;
import com.aluon.crm.social.service.SocialMediaPublicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/social-media/publications")
@RequiredArgsConstructor
public class SocialMediaPublicationAdminController {

    private final SocialMediaPublicationService service;

    @GetMapping
    public ResponseEntity<List<SocialMediaPublicationResponse>> list() {
        return ResponseEntity.ok(service.listPublications());
    }

    @GetMapping("/{publicationId}")
    public ResponseEntity<SocialMediaPublicationResponse> getById(@PathVariable UUID publicationId) {
        return ResponseEntity.ok(service.getPublication(publicationId));
    }

    @PostMapping
    public ResponseEntity<SocialMediaPublicationResponse> create(@Valid @RequestBody SocialMediaPublicationRequest request) {
        return ResponseEntity.ok(service.createPublication(request));
    }

    @PutMapping("/{publicationId}")
    public ResponseEntity<SocialMediaPublicationResponse> update(
            @PathVariable UUID publicationId,
            @Valid @RequestBody SocialMediaPublicationRequest request
    ) {
        return ResponseEntity.ok(service.updatePublication(publicationId, request));
    }

    @PostMapping("/{publicationId}/launch")
    public ResponseEntity<SocialMediaPublicationResponse> launch(@PathVariable UUID publicationId) {
        return ResponseEntity.ok(service.launchPublication(publicationId));
    }

    @DeleteMapping("/{publicationId}")
    public ResponseEntity<Void> delete(@PathVariable UUID publicationId) {
        service.deletePublication(publicationId);
        return ResponseEntity.noContent().build();
    }
}
