package com.aluon.crm.customer.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import com.aluon.crm.customer.model.Customer;


public record CustomerResponse(
        UUID id,
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
        List<DeliveryAddressResponse> direccionesEntrega
) {
}
