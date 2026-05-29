package com.aluon.crm.quote.repository;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface QuoteDocumentRepository extends JpaRepository<QuoteDocument, UUID> {
    Optional<QuoteDocument> findTopByQuoteRequestOrderByCreatedAtDesc(QuoteRequest quoteRequest);
}

