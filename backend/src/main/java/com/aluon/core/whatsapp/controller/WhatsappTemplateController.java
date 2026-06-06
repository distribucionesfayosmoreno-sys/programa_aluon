package com.aluon.core.whatsapp.controller;

import com.aluon.core.whatsapp.dto.WhatsappTemplateDto;
import com.aluon.core.whatsapp.dto.WhatsappTemplateRequest;
import com.aluon.core.whatsapp.service.WhatsappTemplateService;
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
@RequestMapping("/api/settings/whatsapp-messages")
@RequiredArgsConstructor
public class WhatsappTemplateController {

    private final WhatsappTemplateService service;

    @GetMapping
    public List<WhatsappTemplateDto> getAll() {
        return service.findAll();
    }

    @GetMapping("/{key}")
    public ResponseEntity<WhatsappTemplateDto> getByKey(@PathVariable String key) {
        return ResponseEntity.ok(service.findByKey(key));
    }

    @PostMapping
    public WhatsappTemplateDto create(@RequestBody WhatsappTemplateRequest request) {
        return service.save(request);
    }

    @PutMapping("/{id}")
    public WhatsappTemplateDto update(@PathVariable UUID id, @RequestBody WhatsappTemplateRequest request) {
        return service.upsert(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
