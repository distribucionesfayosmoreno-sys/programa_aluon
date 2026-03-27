package com.aluon.core.signature.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import com.aluon.core.signature.dto.CreateEmailSignatureRequest;
import com.aluon.core.signature.dto.EmailSignatureDto;
import com.aluon.core.signature.service.EmailSignatureService;
import com.aluon.core.signature.dto.UpdateEmailSignatureRequest;


@RestController
@RequestMapping("/api/settings/email-signatures")
@RequiredArgsConstructor
public class EmailSignatureController {

    private final EmailSignatureService service;

    @GetMapping
    public List<EmailSignatureDto> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailSignatureDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public EmailSignatureDto create(@RequestBody CreateEmailSignatureRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public EmailSignatureDto update(@PathVariable UUID id, @RequestBody UpdateEmailSignatureRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
