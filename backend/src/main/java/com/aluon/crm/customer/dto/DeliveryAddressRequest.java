package com.aluon.crm.customer.dto;

import java.util.UUID;

public record DeliveryAddressRequest(
        UUID id,
        String nombreAlias,
        String direccion,
        String cp,
        String poblacion,
        String provincia,
        String telefono,
        String contacto
) {
}
