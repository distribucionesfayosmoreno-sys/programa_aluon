package com.aluon.core.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/settings/email-templates")
@RequiredArgsConstructor
public class EmailTemplateController {

    private final EmailTemplateService service;
    private final MailService mailService;

    @GetMapping
    public List<EmailTemplateDto> getAll() {
        return service.findAll();
    }

    @GetMapping("/{key}")
    public ResponseEntity<EmailTemplateDto> getByKey(@PathVariable String key) {
        return ResponseEntity.ok(service.findByKey(key));
    }

    @PostMapping
    public EmailTemplateDto create(@RequestBody EmailTemplateRequest request) {
        return service.save(request);
    }

    @PutMapping("/{id}")
    public EmailTemplateDto update(@PathVariable UUID id, @RequestBody EmailTemplateRequest request) {
        return service.upsert(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/test")
    public ResponseEntity<Void> sendTest(@RequestBody EmailTemplateTestRequest request) {
        if (request.getTo() == null || request.getTo().isBlank()) {
            throw new IllegalArgumentException("El email de destino es obligatorio");
        }
        if (request.getTemplateKey() == null || request.getTemplateKey().isBlank()) {
            throw new IllegalArgumentException("La clave de plantilla es obligatoria");
        }
        java.util.Map<String, String> variables = new java.util.HashMap<>();
        variables.put("nombreComercial", request.getNombreComercial());
        variables.put("email", request.getEmail());
        variables.put("telefono", request.getTelefono());
        mailService.sendTemplate(request.getTemplateKey(), request.getTo(), variables);
        return ResponseEntity.noContent().build();
    }
}
