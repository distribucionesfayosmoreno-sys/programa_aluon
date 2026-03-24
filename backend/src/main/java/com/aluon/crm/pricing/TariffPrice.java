package com.aluon.crm.pricing;

import com.aluon.production.cutlist.DoorModel;
import com.aluon.production.cutlist.DoorType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "tariff_prices",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tariff_id", "door_model", "door_type"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TariffPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tariff_id", nullable = false)
    private Tariff tariff;

    @Enumerated(EnumType.STRING)
    @Column(name = "door_model", nullable = false)
    private DoorModel doorModel;

    @Enumerated(EnumType.STRING)
    @Column(name = "door_type", nullable = false)
    private DoorType doorType;

    @Column(name = "price_per_m2", nullable = false, precision = 12, scale = 2)
    private BigDecimal pricePerM2;
}
