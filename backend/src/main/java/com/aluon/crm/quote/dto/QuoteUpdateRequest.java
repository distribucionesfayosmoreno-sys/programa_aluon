package com.aluon.crm.quote.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuoteUpdateRequest {
    private String customerNombreComercial;
    private String customerTelefono;
    private String customerDireccion;
    private String customerCp;
    private String customerPoblacion;
    private String customerProvincia;

    private String deliveryDireccionEntrega;
    private String deliveryCp;
    private String deliveryPoblacion;
    private String deliveryProvincia;

    private String contactEmail;
    private String contactWhatsapp;
}

