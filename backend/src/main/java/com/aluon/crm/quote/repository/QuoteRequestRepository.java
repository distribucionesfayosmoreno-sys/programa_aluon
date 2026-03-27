package com.aluon.crm.quote.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import com.aluon.crm.quote.dto.QuoteRequest;


public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, UUID> {
    Optional<QuoteRequest> findByQuoteNumber(String quoteNumber);
}
