package com.aluon.production.station.repository;

import com.aluon.production.station.model.ProductionStation;
import com.aluon.production.station.model.ProductionStationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductionStationRepository extends JpaRepository<ProductionStation, UUID> {

    @Query("""
        SELECT ps FROM ProductionStation ps
        JOIN FETCH ps.order
        LEFT JOIN FETCH ps.operatorUser
        WHERE ps.order.id = :orderId
        ORDER BY ps.sequenceOrder ASC
    """)
    List<ProductionStation> findByOrderIdOrderBySequenceOrder(UUID orderId);

    Optional<ProductionStation> findByOrderIdAndStationCode(UUID orderId, ProductionStationCode stationCode);

    boolean existsByOrderId(UUID orderId);
}
