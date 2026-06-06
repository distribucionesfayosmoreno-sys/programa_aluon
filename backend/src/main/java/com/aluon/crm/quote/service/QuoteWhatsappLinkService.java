package com.aluon.crm.quote.service;

import com.aluon.core.whatsapp.service.WhatsappTemplateService;
import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.dto.QuoteWhatsappLinkResponse;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuoteWhatsappLinkService {

    private final QuoteRequestRepository quoteRequestRepository;
    private final WhatsappTemplateService whatsappTemplateService;

    @Transactional(readOnly = true)
    public QuoteWhatsappLinkResponse buildLink(UUID quoteId) {
        UUID id = Objects.requireNonNull(quoteId, "quoteId");
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));

        String documentUrl = buildDocumentUrl(quote);
        String message = renderMessage(quote, documentUrl);
        String encodedText = URLEncoder.encode(message, StandardCharsets.UTF_8);
        String phone = normalizePhone(quote.getContactWhatsapp());
        String url = phone.isBlank()
                ? "https://wa.me/?text=" + encodedText
                : "https://wa.me/" + phone + "?text=" + encodedText;

        return new QuoteWhatsappLinkResponse(url, message, documentUrl);
    }

    private String renderMessage(QuoteRequest quote, String documentUrl) {
        String template = whatsappTemplateService
                .getOrCreateTemplate(WhatsappTemplateService.KEY_QUOTE_SHARE)
                .getMessageText();

        String customerName = "";
        if (quote.getCustomer() != null) {
            customerName = safe(quote.getCustomer().getNombreComercial(), quote.getCustomer().getRazonSocial());
        }

        return template
                .replace("{{customerName}}", customerName)
                .replace("{{quoteNumber}}", safe(quote.getQuoteNumber(), "PRESUPUESTO"))
                .replace("{{total}}", quote.getTotal() == null ? "0.00" : quote.getTotal().toPlainString())
                .replace("{{documentUrl}}", documentUrl)
                .replace("{{phone}}", safe(quote.getContactWhatsapp(), ""));
    }

    private String buildDocumentUrl(QuoteRequest quote) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/quotes/{id}/pdf")
                .queryParam("type", "PRESUPUESTO")
                .queryParam("number", quote.getQuoteNumber())
                .buildAndExpand(quote.getId())
                .toUriString();
    }

    private String normalizePhone(String raw) {
        if (raw == null) return "";
        return raw.replaceAll("\\D+", "");
    }

    private String safe(String primary, String fallback) {
        String value = primary == null ? "" : primary.trim();
        return value.isBlank() ? fallback : value;
    }
}
