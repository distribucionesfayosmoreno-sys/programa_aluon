package com.aluon.crm.quote.repository;

import com.aluon.crm.quote.model.QuoteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.aluon.crm.quote.model.QuoteItem;
import com.aluon.production.cutlist.model.DoorModel;


public interface QuoteItemRepository extends JpaRepository<QuoteItem, UUID> {
    @Query("""
            select i.doorModel as doorModel, coalesce(sum(i.lineTotal), 0) as total
            from QuoteItem i
            join i.quoteRequest q
            where q.status = :status
              and q.createdAt >= :start
              and q.createdAt < :end
            group by i.doorModel
            order by sum(i.lineTotal) desc
            """)
    java.util.List<DoorModelTotalRow> sumLineTotalByDoorModel(
            @Param("status") QuoteStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    interface DoorModelTotalRow {
        DoorModel doorModel();

        BigDecimal total();
    }
}
