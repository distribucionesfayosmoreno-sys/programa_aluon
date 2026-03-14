package com.aluon.production.order;

import com.aluon.crm.customer.Customer;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;
import java.util.UUID;

@Entity
@Table(name = "orders") // "Order" es palabra reservada en SQL.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Multitenancy Field
    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "codigo_orden", nullable = false, unique = true)
    private String codigoOrden;

    @Column(name = "modelo_puerta", nullable = false)
    private String modeloPuerta;

    @Column(name = "ancho_mm", nullable = false)
    private Integer anchoMm;

    @Column(name = "alto_mm", nullable = false)
    private Integer altoMm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus estado;
}

enum OrderStatus {
    PENDIENTE_MATERIAL, EN_PRODUCCION, LISTO_MONTAJE, INSTALADA, FACTURADA
}
