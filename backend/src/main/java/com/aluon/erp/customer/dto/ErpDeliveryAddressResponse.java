package com.aluon.erp.customer.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ErpDeliveryAddressResponse {
    String id;
    String nombreAlias;
    String direccion;
    String cp;
    String poblacion;
    String provincia;
    String telefono;
    String contacto;
}
