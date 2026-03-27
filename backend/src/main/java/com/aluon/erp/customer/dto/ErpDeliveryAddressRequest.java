package com.aluon.erp.customer.dto;

import lombok.Data;

@Data
public class ErpDeliveryAddressRequest {
    private String nombreAlias;
    private String direccion;
    private String cp;
    private String poblacion;
    private String provincia;
    private String telefono;
    private String contacto;
}
