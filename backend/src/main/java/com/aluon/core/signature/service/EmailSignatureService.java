package com.aluon.core.signature.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.data.domain.Sort;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import com.aluon.core.signature.dto.CreateEmailSignatureRequest;
import com.aluon.core.signature.model.EmailSignature;
import com.aluon.core.signature.dto.EmailSignatureDto;
import com.aluon.core.signature.repository.EmailSignatureRepository;
import com.aluon.core.signature.dto.UpdateEmailSignatureRequest;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailSignatureService {

    private static final String DEFAULT_ACCENT = "#e5534b";
    private static final String DEFAULT_FONT = "Arial, 'Segoe UI', sans-serif";

    private final EmailSignatureRepository repository;
    private final AtomicReference<String> defaultLogoCache = new AtomicReference<>();

    public List<EmailSignatureDto> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "updatedAt"))
                .stream()
                .map(this::toDto)
                .toList();
    }

    public EmailSignatureDto findById(UUID id) {
        return toDto(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Firma de email no encontrada")));
    }

    public String findLatestHtml() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "updatedAt"))
                .stream()
                .findFirst()
                .map(EmailSignature::getHtml)
                .orElse("");
    }

    public EmailSignatureDto create(CreateEmailSignatureRequest request) {
        EmailSignature signature = new EmailSignature();
        applyRequest(signature, request);
        signature.setHtml(buildHtml(signature));
        return toDto(repository.save(signature));
    }

    public EmailSignatureDto update(UUID id, UpdateEmailSignatureRequest request) {
        EmailSignature signature = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Firma de email no encontrada"));
        applyRequest(signature, request);
        signature.setHtml(buildHtml(signature));
        return toDto(repository.save(signature));
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    private void applyRequest(EmailSignature signature, CreateEmailSignatureRequest request) {
        signature.setFullName(trimOrNull(request.getFullName()));
        signature.setRole(trimOrNull(request.getRole()));
        signature.setPhone(trimOrNull(request.getPhone()));
        signature.setEmail(trimOrNull(request.getEmail()));
        signature.setWebsite(trimOrNull(request.getWebsite()));
        signature.setAddress(trimOrNull(request.getAddress()));
        signature.setLogoUrl(trimOrNull(request.getLogoUrl()));
        signature.setAccentColor(normalizeAccent(request.getAccentColor()));

        if (signature.getFullName() == null || signature.getFullName().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (signature.getEmail() == null || signature.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
    }

    private void applyRequest(EmailSignature signature, UpdateEmailSignatureRequest request) {
        signature.setFullName(trimOrNull(request.getFullName()));
        signature.setRole(trimOrNull(request.getRole()));
        signature.setPhone(trimOrNull(request.getPhone()));
        signature.setEmail(trimOrNull(request.getEmail()));
        signature.setWebsite(trimOrNull(request.getWebsite()));
        signature.setAddress(trimOrNull(request.getAddress()));
        signature.setLogoUrl(trimOrNull(request.getLogoUrl()));
        signature.setAccentColor(normalizeAccent(request.getAccentColor()));

        if (signature.getFullName() == null || signature.getFullName().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (signature.getEmail() == null || signature.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
    }

    private String normalizeAccent(String accent) {
        String trimmed = trimOrNull(accent);
        if (trimmed == null || trimmed.isBlank()) {
            return DEFAULT_ACCENT;
        }
        return trimmed;
    }

    private String trimOrNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }

    private EmailSignatureDto toDto(EmailSignature signature) {
        return EmailSignatureDto.builder()
                .id(signature.getId())
                .fullName(signature.getFullName())
                .role(signature.getRole())
                .phone(signature.getPhone())
                .email(signature.getEmail())
                .website(signature.getWebsite())
                .address(signature.getAddress())
                .logoUrl(signature.getLogoUrl())
                .accentColor(signature.getAccentColor())
                .html(signature.getHtml())
                .createdAt(signature.getCreatedAt())
                .updatedAt(signature.getUpdatedAt())
                .build();
    }

    private String buildHtml(EmailSignature signature) {
        String accent = signature.getAccentColor() == null ? DEFAULT_ACCENT : signature.getAccentColor();
        String logo = resolveLogoUrl(signature.getLogoUrl());
        StringBuilder html = new StringBuilder();

        html.append("<table cellpadding=\"0\" cellspacing=\"0\" style=\"font-family:")
                .append(DEFAULT_FONT)
                .append(";font-size:12px;color:#0d1117;\">\n")
                .append("  <tr>\n")
                .append("    <td style=\"padding-right:16px;vertical-align:top;\">\n")
                .append("      <img src=\"").append(escapeHtml(logo))
                .append("\" alt=\"ALUON\" width=\"120\" style=\"display:block;max-width:120px;\"/>\n")
                .append("    </td>\n")
                .append("    <td style=\"border-left:2px solid ").append(escapeHtml(accent))
                .append(";padding-left:16px;vertical-align:top;\">\n")
                .append("      <div style=\"font-size:14px;font-weight:700;color:#0d1117;\">")
                .append(escapeHtml(signature.getFullName()))
                .append("</div>\n");

        if (hasText(signature.getRole())) {
            html.append("      <div style=\"font-size:12px;color:#57606a;margin-top:2px;\">")
                    .append(escapeHtml(signature.getRole()))
                    .append("</div>\n");
        }

        html.append("      <div style=\"margin-top:10px;line-height:1.5;color:#57606a;\">\n");

        appendLine(html, "Email", signature.getEmail(), "mailto:");
        appendLine(html, "Tel", signature.getPhone(), "tel:");
        appendLine(html, "Web", signature.getWebsite(), "");
        appendLine(html, "Dirección", signature.getAddress(), "");

        html.append("      </div>\n")
                .append("    </td>\n")
                .append("  </tr>\n")
                .append("</table>");

        return html.toString();
    }

    private void appendLine(StringBuilder html, String label, String value, String linkPrefix) {
        if (!hasText(value)) {
            return;
        }
        html.append("        <div><strong style=\"color:#0d1117;\">")
                .append(escapeHtml(label))
                .append(":</strong> ");

        if (hasText(linkPrefix)) {
            html.append("<a href=\"")
                    .append(escapeHtml(linkPrefix))
                    .append(escapeHtml(value))
                    .append("\" style=\"color:#0d1117;text-decoration:none;\">")
                    .append(escapeHtml(value))
                    .append("</a>");
        } else if (value.startsWith("http")) {
            html.append("<a href=\"")
                    .append(escapeHtml(value))
                    .append("\" style=\"color:#0d1117;text-decoration:none;\">")
                    .append(escapeHtml(value))
                    .append("</a>");
        } else {
            html.append(escapeHtml(value));
        }

        html.append("</div>\n");
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String resolveLogoUrl(String provided) {
        if (hasText(provided)) {
            String trimmed = provided.trim();
            if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:image/")) {
                return trimmed;
            }
        }
        String cached = defaultLogoCache.get();
        if (cached != null) {
            return cached;
        }
        try {
            ClassPathResource resource = new ClassPathResource("static/aluon-logo.png");
            byte[] bytes = StreamUtils.copyToByteArray(resource.getInputStream());
            String base64 = Base64.getEncoder().encodeToString(bytes);
            String dataUri = "data:image/png;base64," + base64;
            defaultLogoCache.compareAndSet(null, dataUri);
            return defaultLogoCache.get();
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo cargar el logo de Aluon", e);
        }
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
