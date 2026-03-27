package com.aluon.crm.customer.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;
import java.util.UUID;

@Entity
@Table(name = "delivery_addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "NOMBRE_ALIAS", nullable = false)
    private String nombreAlias;

    @Column(name = "DIRECCION")
    private String direccion;

    @Column(name = "CP")
    private String cp;

    @Column(name = "POBLACION")
    private String poblacion;

    @Column(name = "PROVINCIA")
    private String provincia;

    @Column(name = "TELEFONO")
    private String telefono;

    @Column(name = "CONTACTO")
    private String contacto;
}
