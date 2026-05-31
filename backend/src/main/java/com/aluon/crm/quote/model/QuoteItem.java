package com.aluon.crm.quote.model;

import com.aluon.crm.catalog.model.ProductCategory;
import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

import java.math.BigDecimal;
import java.util.UUID;
import com.aluon.crm.quote.dto.QuoteRequest;


@Entity
@Table(name = "aluon_saas_quote_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quote_request_id", nullable = false)
    private QuoteRequest quoteRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "door_model", nullable = false)
    private DoorModel doorModel;

    @Enumerated(EnumType.STRING)
    @Column(name = "door_type", nullable = false)
    private DoorType doorType;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_category")
    private ProductCategory productCategory;

    @Column(name = "color_code")
    private String colorCode;

    @Column(name = "primer_required")
    private Boolean primerRequired;

    @Enumerated(EnumType.STRING)
    @Column(name = "opening_variant")
    private DoorType openingVariant;

    @Column(name = "width_mm", nullable = false)
    private Integer widthMm;

    @Column(name = "height_mm", nullable = false)
    private Integer heightMm;

    @Column(name = "floor_clearance_mm")
    private Integer floorClearanceMm;

    @Column(name = "larguero")
    private Boolean larguero;

    @Column(name = "marco_superior")
    private Boolean marcoSuperior;

    @Column(name = "bisagras")
    private Boolean bisagras;

    @Column(name = "portero_automatico")
    private Boolean porteroAutomatico;

    @Column(name = "unidades", nullable = false)
    @Builder.Default
    private Integer unidades = 1;

    @Column(name = "m2", nullable = false, precision = 12, scale = 4)
    private BigDecimal m2;

    @Column(name = "price_per_m2", nullable = false, precision = 12, scale = 2)
    private BigDecimal pricePerM2;

    @Column(name = "line_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotal;
}
