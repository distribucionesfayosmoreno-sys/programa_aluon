package com.aluon.core.mail.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.aluon.core.mail.model.EmailTemplate;
import com.aluon.core.mail.dto.EmailTemplateDto;
import com.aluon.core.mail.repository.EmailTemplateRepository;
import com.aluon.core.mail.dto.EmailTemplateRequest;


@Service
@RequiredArgsConstructor
@Transactional
public class EmailTemplateService {

    public static final String KEY_REGISTRATION_CONFIRMATION = "REGISTRATION_CONFIRMATION";
    public static final String KEY_REGISTRATION_APPROVED = "REGISTRATION_APPROVED";
    public static final String KEY_PASSWORD_RESET = "PASSWORD_RESET";

    private final EmailTemplateRepository repository;

    public List<EmailTemplateDto> findAll() {
        ensureDefaults();
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public EmailTemplateDto upsert(UUID id, EmailTemplateRequest request) {
        EmailTemplate template;
        if (id != null) {
            template = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));
        } else {
            template = new EmailTemplate();
        }
        apply(template, request);
        return toDto(repository.save(template));
    }

    public EmailTemplateDto save(EmailTemplateRequest request) {
        EmailTemplate template = repository.findByTemplateKey(normalizeKey(request.getTemplateKey()))
                .orElseGet(EmailTemplate::new);
        apply(template, request);
        return toDto(repository.save(template));
    }

    public EmailTemplateDto findByKey(String templateKey) {
        return repository.findByTemplateKey(normalizeKey(templateKey))
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));
    }

    public EmailTemplate getOrCreateTemplate(String templateKey) {
        ensureDefaults();
        String normalizedKey = Objects.requireNonNull(normalizeKey(templateKey), "templateKey");
        return repository.findByTemplateKey(normalizedKey)
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }


    private void apply(EmailTemplate template, EmailTemplateRequest request) {
        String key = normalizeKey(request.getTemplateKey());
        if (key == null) {
            throw new IllegalArgumentException("La clave de plantilla es obligatoria");
        }
        if (request.getSubject() == null || request.getSubject().isBlank()) {
            throw new IllegalArgumentException("El asunto es obligatorio");
        }
        if (request.getBodyHtml() == null || request.getBodyHtml().isBlank()) {
            throw new IllegalArgumentException("El cuerpo HTML es obligatorio");
        }
        template.setTemplateKey(key);
        template.setSubject(request.getSubject().trim());
        template.setBodyHtml(request.getBodyHtml().trim());
    }

    private String normalizeKey(String key) {
        if (key == null) return null;
        String trimmed = key.trim();
        return trimmed.isBlank() ? null : trimmed.toUpperCase();
    }

    private EmailTemplateDto toDto(EmailTemplate template) {
        return EmailTemplateDto.builder()
                .id(template.getId())
                .templateKey(template.getTemplateKey())
                .subject(template.getSubject())
                .bodyHtml(template.getBodyHtml())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }

    private void ensureDefaults() {
        Map<String, EmailTemplateRequest> defaults = new LinkedHashMap<>();
        defaults.put(KEY_REGISTRATION_CONFIRMATION, defaultConfirmationTemplate());
        defaults.put(KEY_REGISTRATION_APPROVED, defaultApprovalTemplate());
        defaults.put(KEY_PASSWORD_RESET, defaultPasswordResetTemplate());

        defaults.forEach((key, request) -> {
            repository.findByTemplateKey(key).orElseGet(() -> {
                EmailTemplate template = new EmailTemplate();
                apply(template, request);
                return repository.save(template);
            });
        });
    }

    private EmailTemplateRequest defaultConfirmationTemplate() {
        EmailTemplateRequest request = new EmailTemplateRequest();
        request.setTemplateKey(KEY_REGISTRATION_CONFIRMATION);
        request.setSubject("Hemos recibido tu solicitud en Aluon");
        request.setBodyHtml("""
            <div style=\"font-family:Arial, 'Segoe UI', sans-serif;font-size:14px;color:#0d1117;\">
              <p>Hola {{nombreComercial}},</p>
              <p>Hemos recibido tu solicitud de inscripción. Nuestro equipo la revisará en breve.</p>
              <p>Te avisaremos por email con la aprobación o el rechazo. También podrás ver el estado desde la app web.</p>
              <p>Datos recibidos:</p>
              <ul>
                <li>Email: {{email}}</li>
                <li>Teléfono: {{telefono}}</li>
              </ul>
              <p>Gracias por confiar en Aluon.</p>
              <div style=\"margin-top:16px;\">{{signatureHtml}}</div>
            </div>
            """);
        return request;
    }

    private EmailTemplateRequest defaultApprovalTemplate() {
        EmailTemplateRequest request = new EmailTemplateRequest();
        request.setTemplateKey(KEY_REGISTRATION_APPROVED);
        request.setSubject("Tu cuenta Aluon ha sido validada");
        request.setBodyHtml("""
            <div style=\"font-family:Arial, 'Segoe UI', sans-serif;font-size:14px;color:#0d1117;\">
              <p>Hola {{nombreComercial}},</p>
              <p>Tu solicitud ha sido aprobada. Ya puedes iniciar sesión en la app móvil.</p>
              <p>Si necesitas ayuda, responde a este correo.</p>
              <div style=\"margin-top:16px;\">{{signatureHtml}}</div>
            </div>
            """);
        return request;
    }

    private EmailTemplateRequest defaultPasswordResetTemplate() {
        EmailTemplateRequest request = new EmailTemplateRequest();
        request.setTemplateKey(KEY_PASSWORD_RESET);
        request.setSubject("Código de recuperación de contraseña");
        request.setBodyHtml("""
            <div style=\"font-family:Arial, 'Segoe UI', sans-serif;font-size:14px;color:#0d1117;\">
              <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
              <p>Tu código de recuperación es:</p>
              <p style=\"font-size:18px;font-weight:700;letter-spacing:0.08em;\">{{token}}</p>
              <p>Este código caduca en {{expiresMinutes}} minutos.</p>
              <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
              <div style=\"margin-top:16px;\">{{signatureHtml}}</div>
            </div>
            """);
        return request;
    }
}
