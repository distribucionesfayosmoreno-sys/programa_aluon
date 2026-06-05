package com.aluon.production.station.model;

import com.aluon.production.order.model.Order;
import com.aluon.core.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Representa una estación individual dentro de la cadena de montaje
 * para una orden de producción. Cada orden genera 7 registros (uno
 * por estación) al entrar en la etapa PROD.
 */
@Entity
@Table(
    name = "production_stations",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_production_station_order_code",
        columnNames = {"order_id", "station_code"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductionStation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "station_code", nullable = false, length = 30)
    private ProductionStationCode stationCode;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ProductionStationStatus status = ProductionStationStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_user_id")
    private User operatorUser;

    @Column(name = "operator_name")
    private String operatorName;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "block_reason", columnDefinition = "TEXT")
    private String blockReason;

    @Column(name = "blocked_at")
    private LocalDateTime blockedAt;

    @Column(name = "unblocked_at")
    private LocalDateTime unblockedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
