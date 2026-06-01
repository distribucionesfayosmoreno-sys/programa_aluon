package com.aluon.crm.quote.repository;

import com.aluon.crm.quote.model.QuoteStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.aluon.crm.quote.dto.QuoteRequest;


public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, UUID> {
    Optional<QuoteRequest> findByQuoteNumber(String quoteNumber);

    @Query("""
            select coalesce(sum(q.total), 0)
            from QuoteRequest q
            where q.status = :status
              and q.createdAt >= :start
              and q.createdAt < :end
            """)
    BigDecimal sumTotalByStatusAndCreatedAtBetween(
            @Param("status") QuoteStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            select coalesce(sum(q.total), 0)
            from QuoteDocument d
            join d.quoteRequest q
            where upper(d.tipo) = upper(:tipo)
              and d.createdAt >= :start
              and d.createdAt < :end
            """)
    BigDecimal sumTotalByDocumentTipoAndCreatedAtBetween(
            @Param("tipo") String tipo,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            select count(q)
            from QuoteRequest q
            where q.status = :status
              and q.createdAt >= :start
              and q.createdAt < :end
            """)
    long countByStatusAndCreatedAtBetween(
            @Param("status") QuoteStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            select q.id as id, q.quoteNumber as quoteNumber, q.createdAt as createdAt, q.total as total, c.nombreComercial as customerName
            from QuoteRequest q
            join q.customer c
            where q.status = :status
              and q.createdAt >= :start
              and q.createdAt < :end
            order by q.createdAt desc
            """)
    List<RecentQuoteRow> findRecentByStatusAndCreatedAtBetween(
            @Param("status") QuoteStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("""
            select function('date', q.createdAt) as day, coalesce(sum(q.total), 0) as total
            from QuoteRequest q
            where q.status = :status
              and q.createdAt >= :start
              and q.createdAt < :end
            group by function('date', q.createdAt)
            order by function('date', q.createdAt)
            """)
    List<DailyTotalRow> sumDailyTotalsByStatusAndCreatedAtBetween(
            @Param("status") QuoteStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            select function('date', d.createdAt) as day, coalesce(sum(q.total), 0) as total
            from QuoteDocument d
            join d.quoteRequest q
            where upper(d.tipo) = upper(:tipo)
              and d.createdAt >= :start
              and d.createdAt < :end
            group by function('date', d.createdAt)
            order by function('date', d.createdAt)
            """)
    List<DailyTotalRow> sumDailyTotalsByDocumentTipoAndCreatedAtBetween(
            @Param("tipo") String tipo,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            select c.nombreComercial as customerName, coalesce(sum(q.total), 0) as total
            from QuoteRequest q
            join q.customer c
            where q.status = :status
              and q.createdAt >= :start
              and q.createdAt < :end
            group by c.nombreComercial
            order by sum(q.total) desc
            """)
    List<CustomerTotalRow> topCustomersByTotal(
            @Param("status") QuoteStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("""
            select c.nombreComercial as customerName, coalesce(sum(q.total), 0) as total
            from QuoteDocument d
            join d.quoteRequest q
            join q.customer c
            where upper(d.tipo) = upper(:tipo)
              and d.createdAt >= :start
              and d.createdAt < :end
            group by c.nombreComercial
            order by sum(q.total) desc
            """)
    List<CustomerTotalRow> topCustomersByDocumentTipoTotal(
            @Param("tipo") String tipo,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("""
            select q.id as id, q.quoteNumber as quoteNumber, d.createdAt as createdAt, q.total as total, c.nombreComercial as customerName
            from QuoteDocument d
            join d.quoteRequest q
            join q.customer c
            where upper(d.tipo) = upper(:tipo)
              and d.createdAt >= :start
              and d.createdAt < :end
            order by d.createdAt desc
            """)
    List<RecentQuoteRow> findRecentByDocumentTipoAndCreatedAtBetween(
            @Param("tipo") String tipo,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("""
            select q.id as id,
                   q.quoteNumber as quoteNumber,
                   q.createdAt as createdAt,
                   q.total as total,
                   q.status as status,
                   c.nombreComercial as customerName
            from QuoteRequest q
            join q.customer c
            where q.createdAt >= :start
              and q.createdAt < :end
            order by q.createdAt desc
            """)
    List<RecentBudgetRow> findRecentBudgetsBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("""
            select q.id as id,
                   q.quoteNumber as quoteNumber,
                   q.createdAt as createdAt,
                   q.status as status,
                   c.nombreComercial as customerName
            from QuoteRequest q
            join q.customer c
            where q.createdAt >= :start
              and q.createdAt < :end
            order by q.createdAt desc
            """)
    List<DocumentManagementQuoteRow> findForDocumentManagement(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    interface RecentQuoteRow {
        UUID id();

        String quoteNumber();

        LocalDateTime createdAt();

        BigDecimal total();

        String customerName();
    }

    interface DailyTotalRow {
        LocalDate day();

        BigDecimal total();
    }

    interface CustomerTotalRow {
        String customerName();

        BigDecimal total();
    }

    interface RecentBudgetRow {
        UUID id();

        String quoteNumber();

        LocalDateTime createdAt();

        BigDecimal total();

        QuoteStatus status();

        String customerName();
    }

    interface DocumentManagementQuoteRow {
        UUID getId();

        String getQuoteNumber();

        LocalDateTime getCreatedAt();

        QuoteStatus getStatus();

        String getCustomerName();
    }
}
