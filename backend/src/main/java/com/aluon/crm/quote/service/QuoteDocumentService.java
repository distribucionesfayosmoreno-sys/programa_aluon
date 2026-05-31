package com.aluon.crm.quote.service;

import com.aluon.crm.documents.model.DocumentPrefix;
import com.aluon.crm.documents.model.DocumentSeries;
import com.aluon.crm.documents.model.DocumentSeriesParser;
import com.aluon.crm.documents.service.DocumentNumberService;
import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteDocument;
import com.aluon.crm.quote.repository.QuoteDocumentRepository;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HexFormat;
import java.util.List;
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
    private final DocumentNumberService documentNumberService;

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

    @Transactional
    public QuoteDocument generateAndStore(UUID quoteId, String tipo) {
        UUID id = Objects.requireNonNull(quoteId, "quoteId");
        String type = normalizeTipo(tipo);

        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));

        String documentNumber = resolveNumeroDocumento(quote, type);
        byte[] pdf = quotePdfService.renderQuotePdf(quote, type, documentNumber);
        String sha256 = sha256Hex(pdf);

        QuoteDocument document = QuoteDocument.builder()
                .quoteRequest(quote)
                .tipo(type)
                .numeroDocumento(documentNumber)
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
    public QuoteDocument getLatest(UUID quoteId, String tipo) {
        UUID id = Objects.requireNonNull(quoteId, "quoteId");
        String type = normalizeTipo(tipo);
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));
        return quoteDocumentRepository.findTopByQuoteRequestAndTipoOrderByCreatedAtDesc(quote, type)
                .orElseThrow(() -> new IllegalArgumentException("No hay PDF guardado para este documento"));
    }

    @Transactional(readOnly = true)
    public List<QuoteDocument> listAll(UUID quoteId) {
        UUID id = Objects.requireNonNull(quoteId, "quoteId");
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));
        return quoteDocumentRepository.findByQuoteRequestOrderByCreatedAtDesc(quote).stream()
                .sorted(Comparator.comparing(QuoteDocument::getCreatedAt).reversed())
                .toList();
    }

    @Transactional(readOnly = true)
    public byte[] generateOnTheFly(UUID quoteId, String type, String number) {
        UUID id = Objects.requireNonNull(quoteId, "quoteId");
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));
        return quotePdfService.renderQuotePdf(quote, type, number);
    }

    private String normalizeTipo(String tipo) {
        String value = tipo == null ? "" : tipo.trim().toUpperCase();
        if (value.isBlank()) return DOCUMENT_TYPE_PRESUPUESTO;
        return value;
    }

    private String resolveNumeroDocumento(QuoteRequest quote, String tipo) {
        if (DOCUMENT_TYPE_PRESUPUESTO.equals(tipo)) {
            return quote.getQuoteNumber();
        }
        DocumentPrefix prefix = mapTipoToPrefix(tipo);
        DocumentSeries series = resolveSeries(quote);
        return documentNumberService.formatLinked(prefix, series);
    }

    private DocumentPrefix mapTipoToPrefix(String tipo) {
        return switch (tipo) {
            case "PRESUPUESTO" -> DocumentPrefix.PTO;
            case "PEDIDO" -> DocumentPrefix.PED;
            case "ALBARAN" -> DocumentPrefix.ALB;
            case "FACTURA" -> DocumentPrefix.FRA;
            case "ABONO" -> DocumentPrefix.ABO;
            default -> throw new IllegalArgumentException("Tipo de documento no soportado: " + tipo);
        };
    }

    private DocumentSeries resolveSeries(QuoteRequest quote) {
        if (quote.getSeriesDate() != null && quote.getSeriesSequence() != null && quote.getSeriesSequence() > 0) {
            return new DocumentSeries(quote.getSeriesDate(), quote.getSeriesSequence());
        }
        return DocumentSeriesParser.tryParse(quote.getQuoteNumber())
                .orElseThrow(() -> new IllegalStateException("El presupuesto no tiene serie válida para enlazar documentos"));
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
