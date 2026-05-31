package com.aluon.crm.quote.service;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteDocument;
import com.aluon.crm.quote.repository.QuoteDocumentRepository;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuoteDocumentService {

    private static final String PDF_CONTENT_TYPE = "application/pdf";
    private static final String DOCUMENT_TYPE_PRESUPUESTO = "PRESUPUESTO";

    private final QuoteRequestRepository quoteRequestRepository;
    private final QuoteDocumentRepository quoteDocumentRepository;
    private final QuotePdfService quotePdfService;

    @Transactional
    public QuoteDocument generateAndStore(UUID quoteId) {
        UUID id = Objects.requireNonNull(quoteId, "quoteId");
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));

        byte[] pdf = quotePdfService.renderQuotePdf(quote);
        String sha256 = sha256Hex(pdf);

        QuoteDocument document = QuoteDocument.builder()
                .quoteRequest(quote)
                .tipo(DOCUMENT_TYPE_PRESUPUESTO)
                .numeroDocumento(quote.getQuoteNumber())
                .contentType(PDF_CONTENT_TYPE)
                .sha256(sha256)
                .data(pdf)
                .createdAt(LocalDateTime.now())
                .build();

        return quoteDocumentRepository.save(document);
    }

    @Transactional(readOnly = true)
    public QuoteDocument getLatest(UUID quoteId) {
        UUID id = Objects.requireNonNull(quoteId, "quoteId");
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));
        return quoteDocumentRepository.findTopByQuoteRequestOrderByCreatedAtDesc(quote)
                .orElseThrow(() -> new IllegalArgumentException("No hay PDF guardado para este presupuesto"));
    }

    @Transactional(readOnly = true)
    public byte[] generateOnTheFly(UUID quoteId, String type, String number) {
        UUID id = Objects.requireNonNull(quoteId, "quoteId");
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));
        return quotePdfService.renderQuotePdf(quote, type, number);
    }

    private String sha256Hex(byte[] bytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(bytes);
            return HexFormat.of().formatHex(hash);
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo calcular el hash del PDF", ex);
        }
    }
}
