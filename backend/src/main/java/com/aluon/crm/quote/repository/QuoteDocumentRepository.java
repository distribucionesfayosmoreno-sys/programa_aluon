package com.aluon.crm.quote.repository;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuoteDocumentRepository extends JpaRepository<QuoteDocument, UUID> {
    Optional<QuoteDocument> findTopByQuoteRequestOrderByCreatedAtDesc(QuoteRequest quoteRequest);

    Optional<QuoteDocument> findTopByQuoteRequestAndTipoOrderByCreatedAtDesc(QuoteRequest quoteRequest, String tipo);

    List<QuoteDocument> findByQuoteRequestOrderByCreatedAtDesc(QuoteRequest quoteRequest);

    List<QuoteDocument> findByQuoteRequestIdInOrderByCreatedAtDesc(List<UUID> quoteRequestIds);
}
