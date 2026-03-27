package com.aluon.crm.customer;

import java.math.BigDecimal;
import java.util.List;

public record CustomerRequest(
        String nombreComercial,
        String razonSocial,
        String personaContacto,
        String tarifa,
        Customer.DocumentType tipoDocumento,
        String telefono,
        String email,
        String direccion,
        String cp,
        String poblacion,
        String provincia,
        String pais,
        String iban,
        String formaPago,
        Integer diasVencimiento,
        boolean autoApproveQuotes,
        BigDecimal remanente,
        List<DeliveryAddressRequest> direccionesEntrega
) {
}
