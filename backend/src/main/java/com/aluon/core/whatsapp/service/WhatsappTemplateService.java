package com.aluon.core.whatsapp.service;

import com.aluon.core.whatsapp.dto.WhatsappTemplateDto;
import com.aluon.core.whatsapp.dto.WhatsappTemplateRequest;
import com.aluon.core.whatsapp.model.WhatsappTemplate;
import com.aluon.core.whatsapp.repository.WhatsappTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class WhatsappTemplateService {

    public static final String KEY_QUOTE_SHARE = "QUOTE_WHATSAPP_SHARE";

    private final WhatsappTemplateRepository repository;

    public List<WhatsappTemplateDto> findAll() {
        ensureDefaults();
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public WhatsappTemplateDto findByKey(String templateKey) {
        String normalizedKey = Objects.requireNonNull(normalizeKey(templateKey), "templateKey");
        return repository.findByTemplateKey(normalizedKey)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));
    }

    public WhatsappTemplateDto save(WhatsappTemplateRequest request) {
        String normalizedKey = Objects.requireNonNull(normalizeKey(request.templateKey()), "templateKey");
        WhatsappTemplate template = repository.findByTemplateKey(normalizedKey)
                .orElseGet(WhatsappTemplate::new);
        apply(template, request);
        return toDto(Objects.requireNonNull(repository.save(template), "template"));
    }

    public WhatsappTemplateDto upsert(UUID id, WhatsappTemplateRequest request) {
        WhatsappTemplate template = id != null
                ? repository.findById(id).orElseThrow(() -> new RuntimeException("Plantilla no encontrada"))
                : new WhatsappTemplate();
        apply(template, request);
        return toDto(Objects.requireNonNull(repository.save(template), "template"));
    }

    public void deleteById(UUID id) {
        repository.deleteById(Objects.requireNonNull(id, "id"));
    }

    public WhatsappTemplate getOrCreateTemplate(String templateKey) {
        String normalizedKey = Objects.requireNonNull(normalizeKey(templateKey), "templateKey");
        return repository.findByTemplateKey(normalizedKey)
                .orElseGet(() -> createDefaultTemplate(normalizedKey));
    }

    private void apply(WhatsappTemplate template, WhatsappTemplateRequest request) {
        String key = normalizeKey(request.templateKey());
        String messageText = request.messageText() == null ? null : request.messageText().trim();
        if (key == null) {
            throw new IllegalArgumentException("La clave de plantilla es obligatoria");
        }
        if (messageText == null || messageText.isBlank()) {
            throw new IllegalArgumentException("El texto del mensaje es obligatorio");
        }
        template.setTemplateKey(key);
        template.setMessageText(messageText);
    }

    private String normalizeKey(String key) {
        if (key == null) return null;
        String trimmed = key.trim();
        return trimmed.isBlank() ? null : trimmed.toUpperCase();
    }

    private WhatsappTemplateDto toDto(WhatsappTemplate template) {
        return new WhatsappTemplateDto(
                template.getId(),
                template.getTemplateKey(),
                template.getMessageText(),
                template.getCreatedAt(),
                template.getUpdatedAt()
        );
    }

    private void ensureDefaults() {
        Map<String, WhatsappTemplateRequest> defaults = new LinkedHashMap<>();
        defaults.put(KEY_QUOTE_SHARE, defaultQuoteShareTemplate());

        defaults.forEach((key, request) -> repository.findByTemplateKey(key).orElseGet(() -> createDefaultTemplate(key, request)));
    }

    private WhatsappTemplate createDefaultTemplate(String normalizedKey) {
        if (!KEY_QUOTE_SHARE.equals(normalizedKey)) {
            throw new RuntimeException("Plantilla no encontrada");
        }
        return createDefaultTemplate(normalizedKey, defaultQuoteShareTemplate());
    }

    private WhatsappTemplate createDefaultTemplate(String normalizedKey, WhatsappTemplateRequest request) {
        WhatsappTemplate template = new WhatsappTemplate();
        apply(template, request);
        template.setTemplateKey(normalizedKey);
        return repository.save(template);
    }

    private WhatsappTemplateRequest defaultQuoteShareTemplate() {
        return new WhatsappTemplateRequest(
                KEY_QUOTE_SHARE,
                """
                        Hola {{customerName}}, te envío tu presupuesto {{quoteNumber}} de ALUON.
                        Puedes abrir la copia del documento aquí: {{documentUrl}}

                        Total: {{total}} €
                        """
        );
    }
}
