package com.aluon.crm.documents.service;

import com.aluon.crm.documents.dto.DocumentManagementRowResponse;
import com.aluon.crm.quote.model.QuoteDocument;
import com.aluon.crm.quote.repository.QuoteDocumentRepository;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentManagementService {

    private static final String STATUS_EMITIDO = "EMITIDO";
    private static final LocalDateTime DATE_MIN = LocalDate.of(1970, Month.JANUARY, 1).atStartOfDay();
    private static final LocalDateTime DATE_MAX_EXCLUSIVE = LocalDate.of(3000, Month.JANUARY, 1).atStartOfDay();

    private final QuoteRequestRepository quoteRequestRepository;
    private final QuoteDocumentRepository quoteDocumentRepository;

    @Transactional(readOnly = true)
    public List<DocumentManagementRowResponse> listRows(
            String query,
            String type,
            String status,
            LocalDate dateFrom,
            LocalDate dateTo
    ) {
        String normalizedType = normalizeFilter(type);
        String normalizedStatus = normalizeFilter(status);

        LocalDateTime start = dateFrom != null ? dateFrom.atStartOfDay() : DATE_MIN;
        LocalDateTime endExclusive = dateTo != null ? dateTo.plusDays(1).atStartOfDay() : DATE_MAX_EXCLUSIVE;

        List<QuoteRequestRepository.DocumentManagementQuoteRow> quotes = quoteRequestRepository.findForDocumentManagement(start, endExclusive);

        if (quotes.isEmpty()) return List.of();

        List<UUID> quoteIds = quotes.stream().map(QuoteRequestRepository.DocumentManagementQuoteRow::getId).toList();
        List<QuoteDocument> docs = quoteDocumentRepository.findByQuoteRequestIdInOrderByCreatedAtDesc(quoteIds);

        Map<UUID, Map<String, QuoteDocument>> latestDocByQuoteAndType = new HashMap<>();
        for (QuoteDocument doc : docs) {
            UUID quoteId = doc.getQuoteRequest().getId();
            String docType = normalizeDocType(doc.getTipo());
            if (docType.isBlank()) continue;
            latestDocByQuoteAndType
                    .computeIfAbsent(quoteId, ignored -> new HashMap<>())
                    .putIfAbsent(docType, doc);
        }

        List<DocumentManagementRowResponse> rows = new ArrayList<>(quotes.size() * 2);

        for (QuoteRequestRepository.DocumentManagementQuoteRow q : quotes) {
            String customerName = safe(q.getCustomerName());
            String quoteNumber = safe(q.getQuoteNumber());
            String budgetRowId = q.getId() + ":PRESUPUESTO";

            rows.add(new DocumentManagementRowResponse(
                    budgetRowId,
                    q.getId().toString(),
                    q.getId(),
                    customerName,
                    "PRESUPUESTO",
                    quoteNumber,
                    q.getStatus() != null ? q.getStatus().name() : "",
                    q.getCreatedAt()
            ));

            Map<String, QuoteDocument> docsByType = latestDocByQuoteAndType.getOrDefault(q.getId(), Map.of());
            for (String docType : List.of("PEDIDO", "ALBARAN", "FACTURA", "ABONO")) {
                QuoteDocument latest = docsByType.get(docType);
                if (latest == null) continue;
                String number = safe(latest.getNumeroDocumento());
                String rowId = q.getId() + ":" + docType;
                rows.add(new DocumentManagementRowResponse(
                        rowId,
                        q.getId().toString(),
                        q.getId(),
                        customerName,
                        docType,
                        number,
                        STATUS_EMITIDO,
                        latest.getCreatedAt()
                ));
            }
        }

        return rows.stream()
                .filter(r -> matchesType(normalizedType, r.type()))
                .filter(r -> matchesStatus(normalizedStatus, r.type(), r.statusLabel()))
                .sorted(Comparator.comparing(DocumentManagementRowResponse::createdAt).reversed())
                .collect(Collectors.toList());
    }

    private static boolean matchesType(String type, String rowType) {
        if (type == null || type.isBlank() || type.equals("ALL")) return true;
        return type.equalsIgnoreCase(rowType);
    }

    private static boolean matchesStatus(String status, String rowType, String rowStatus) {
        if (status == null || status.isBlank() || status.equals("ALL")) return true;
        if (rowType.equalsIgnoreCase("PRESUPUESTO")) {
            return status.equalsIgnoreCase(rowStatus);
        }
        return status.equalsIgnoreCase(rowStatus);
    }

    private static String normalizeFilter(String raw) {
        if (raw == null) return null;
        String s = raw.trim().toUpperCase();
        return s.isBlank() ? null : s;
    }

    private static String normalizeDocType(String raw) {
        if (raw == null) return "";
        return raw.trim().toUpperCase();
    }

    private static String safe(String value) {
        return value == null ? "" : value;
    }
}
