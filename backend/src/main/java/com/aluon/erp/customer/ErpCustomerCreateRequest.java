package com.aluon.erp.customer;

import com.aluon.crm.customer.Customer;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ErpCustomerCreateRequest {
    private String nombreComercial;
    private String razonSocial;
    private String personaContacto;
    private String tarifa;
    private Customer.DocumentType tipoDocumento;
    private String telefono;
    private String email;
    private String direccion;
    private String cp;
    private String poblacion;
    private String provincia;
    private String pais;
    private String iban;
    private String formaPago;
    private Integer diasVencimiento;
    private Boolean autoApproveQuotes;
    private BigDecimal remanente;
    private List<ErpDeliveryAddressRequest> direccionesEntrega;
}
