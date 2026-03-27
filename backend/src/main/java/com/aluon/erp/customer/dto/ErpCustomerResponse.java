package com.aluon.erp.customer.dto;

import com.aluon.crm.customer.model.Customer;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.util.List;

@Value
@Builder
public class ErpCustomerResponse {
    String id;
    String nombreComercial;
    String razonSocial;
    String personaContacto;
    String tarifa;
    Customer.DocumentType tipoDocumento;
    String telefono;
    String email;
    String direccion;
    String cp;
    String poblacion;
    String provincia;
    String pais;
    String iban;
    String formaPago;
    Integer diasVencimiento;
    boolean autoApproveQuotes;
    BigDecimal remanente;
    List<ErpDeliveryAddressResponse> direccionesEntrega;
}
