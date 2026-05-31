package com.aluon.crm.quote.controller;

import com.aluon.crm.quote.dto.QuoteDocumentCreateRequest;
import com.aluon.crm.quote.dto.QuoteDocumentRowResponse;
import com.aluon.crm.quote.model.QuoteDocument;
import com.aluon.crm.quote.service.QuoteDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteDocumentsController {

    private final QuoteDocumentService quoteDocumentService;

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<QuoteDocumentRowResponse>> list(@PathVariable UUID id) {
        List<QuoteDocumentRowResponse> rows = quoteDocumentService.listAll(id).stream()
                .map(this::toRow)
                .toList();
        return ResponseEntity.ok(rows);
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<QuoteDocumentRowResponse> create(@PathVariable UUID id, @RequestBody @Valid QuoteDocumentCreateRequest request) {
        QuoteDocument doc = quoteDocumentService.generateAndStore(id, request.tipo());
        return ResponseEntity.ok(toRow(doc));
    }

    @GetMapping("/{id}/documents/{tipo}/pdf")
    public ResponseEntity<byte[]> downloadLatestByType(@PathVariable UUID id, @PathVariable String tipo) {
        QuoteDocument doc = quoteDocumentService.getLatest(id, tipo);
        String filename = buildPdfFilename(doc);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(doc.getData());
    }

    private QuoteDocumentRowResponse toRow(QuoteDocument doc) {
        return new QuoteDocumentRowResponse(doc.getId(), doc.getTipo(), doc.getNumeroDocumento(), doc.getCreatedAt());
    }

    private String buildPdfFilename(QuoteDocument document) {
        String tipo = document.getTipo() == null ? "" : document.getTipo().trim();
        String numero = document.getNumeroDocumento() == null ? "" : document.getNumeroDocumento().trim();
        String base = (tipo.isBlank() || numero.isBlank()) ? "documento" : (tipo + "-" + numero);
        return base + ".pdf";
    }
}

