package com.aluon.crm.customer.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "aluon_saas_clientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "NOMBRE_COMERCIAL", nullable = false)
    private String nombreComercial;

    @Column(name = "RAZON_SOCIAL")
    private String razonSocial;

    @Column(name = "PERSONA_CONTACTO")
    private String personaContacto;

    @Column(name = "TARIFA")
    private String tarifa;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_DOCUMENTO")
    private DocumentType tipoDocumento;

    @Column(name = "NUMERO_DOCUMENTO")
    private String numeroDocumento;

    @Column(name = "TELEFONO")
    private String telefono;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "DIRECCION")
    private String direccion;

    @Column(name = "CP")
    private String cp;

    @Column(name = "POBLACION")
    private String poblacion;

    @Column(name = "PROVINCIA")
    private String provincia;

    @Column(name = "PAIS")
    private String pais;

    @Column(name = "IBAN")
    private String iban;

    @Column(name = "FORMA_PAGO")
    private String formaPago;

    @Column(name = "DIAS_VENCIMIENTO")
    private Integer diasVencimiento;

    @Column(name = "AUTO_APPROVE_QUOTES", nullable = false)
    private boolean autoApproveQuotes;

    @Column(name = "REMANENTE", precision = 19, scale = 4)
    private BigDecimal remanente;

    @Column(name = "ACTIVE", nullable = false)
    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DeliveryAddress> direccionesEntrega = new ArrayList<>();

    public void addDireccion(DeliveryAddress direccion) {
        direccionesEntrega.add(direccion);
        direccion.setCustomer(this);
    }

    public enum DocumentType {
        DNI, CIF, NIE, PASAPORTE
    }
}
