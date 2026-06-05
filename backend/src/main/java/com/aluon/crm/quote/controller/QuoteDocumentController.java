package com.aluon.crm.quote.controller;

import com.aluon.core.mail.service.MailService;
import com.aluon.crm.quote.dto.QuoteEmailSendRequest;
import com.aluon.crm.quote.dto.QuoteWhatsappLinkResponse;
import com.aluon.crm.quote.model.QuoteDocument;
import com.aluon.crm.quote.service.QuoteDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteDocumentController {
    private final QuoteDocumentService quoteDocumentService;
    private final MailService mailService;

    @PostMapping("/{id}/pdf")
    public ResponseEntity<Void> generateAndStorePdf(@PathVariable UUID id) {
        quoteDocumentService.generateAndStore(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadLatestPdf(
            @PathVariable UUID id,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String number) {
        
        if (type != null && !type.isBlank()) {
            byte[] pdf = quoteDocumentService.generateOnTheFly(id, type, number);
            String safeType = type.trim();
            String safeNum = (number == null || number.isBlank()) ? "documento" : number.trim();
            String filename = safeType + "-" + safeNum + ".pdf";
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(pdf);
        }

        QuoteDocument document = quoteDocumentService.getLatest(id);
        String filename = buildPdfFilename(document);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(document.getData());
    }

    @PostMapping("/{id}/send/email")
    public ResponseEntity<Void> sendByEmail(@PathVariable UUID id, @RequestBody QuoteEmailSendRequest request) {
        QuoteDocument document = quoteDocumentService.getLatest(id);
        String filename = buildPdfFilename(document);
        String to = Objects.requireNonNull(request.to(), "to");
        String subject = request.subject() == null || request.subject().isBlank()
                ? "Presupuesto " + filename
                : request.subject();
        String message = request.message() == null ? "" : request.message();
        String html = "<p>" + escapeHtml(message) + "</p>";
        mailService.sendHtmlWithAttachment(to, subject, html, filename, document.getData());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/send/whatsapp-link")
    public ResponseEntity<QuoteWhatsappLinkResponse> getWhatsappLink(@PathVariable UUID id) {
        QuoteDocument document = quoteDocumentService.getLatest(id);
        String text = "Te envío el presupuesto: " + buildPdfFilename(document);
        String encoded = URLEncoder.encode(text, StandardCharsets.UTF_8);
        return ResponseEntity.ok(new QuoteWhatsappLinkResponse("https://wa.me/?text=" + encoded));
    }

    private String escapeHtml(String raw) {
        String value = raw == null ? "" : raw;
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }

    private String buildPdfFilename(QuoteDocument document) {
        String tipo = document.getTipo() == null ? "" : document.getTipo().trim();
        String numero = document.getNumeroDocumento() == null ? "" : document.getNumeroDocumento().trim();
        String base = (tipo.isBlank() || numero.isBlank()) ? "documento" : (tipo + "-" + numero);
        return base + ".pdf";
    }
}
