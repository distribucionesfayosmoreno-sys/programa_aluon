package com.aluon.crm.quote.repository;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuoteDocumentRepository extends JpaRepository<QuoteDocument, UUID> {
    Optional<QuoteDocument> findTopByQuoteRequestOrderByCreatedAtDesc(QuoteRequest quoteRequest);

    Optional<QuoteDocument> findTopByQuoteRequestAndTipoOrderByCreatedAtDesc(QuoteRequest quoteRequest, String tipo);

    List<QuoteDocument> findByQuoteRequestOrderByCreatedAtDesc(QuoteRequest quoteRequest);

    List<QuoteDocument> findByQuoteRequestIdInOrderByCreatedAtDesc(List<UUID> quoteRequestIds);

    boolean existsByNumeroDocumento(String numeroDocumento);

    long countByTipoIgnoreCaseAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(
            String tipo,
            LocalDateTime start,
            LocalDateTime endExclusive
    );

    @Query(value = """
            select coalesce(max(cast(substring(d.numero_documento from 9) as int)), 0)
            from aluon_saas_quote_documents d
            where upper(d.tipo) = upper(:tipo)
              and d.numero_documento like :prefixLike
            """, nativeQuery = true)
    int findMaxSequenceForDocumentPrefix(
            @Param("tipo") String tipo,
            @Param("prefixLike") String prefixLike
    );
}
