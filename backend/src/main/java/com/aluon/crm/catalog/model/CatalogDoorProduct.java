package com.aluon.crm.catalog.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.TenantId;

import java.util.UUID;
import java.math.BigDecimal;

@Entity
@Table(name = "aluon_saas_catalogo_puertas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogDoorProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "modelo_id", nullable = false)
    private CatalogProductModel modelo;

    @Enumerated(EnumType.STRING)
    @Column(name = "producto", nullable = false)
    private ProductCategory producto;

    @Column(name = "imagen_modelo", columnDefinition = "TEXT")
    private String imagenModelo;

    @Column(name = "precio_tarifa_a", precision = 12, scale = 2)
    private BigDecimal precioTarifaA;

    @Column(name = "precio_tarifa_b", precision = 12, scale = 2)
    private BigDecimal precioTarifaB;

    @Column(name = "metros2_minimo", precision = 12, scale = 4)
    private BigDecimal metros2Minimo;
}
