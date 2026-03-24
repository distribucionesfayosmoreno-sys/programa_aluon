package com.aluon.crm.registration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerRegistrationRequest {
    private String nombreComercial;
    private String razonSocial;
    private String personaContacto;
    private String email;
    private String telefonoWhatsapp;
    private String direccion;
    private String cp;
    private String poblacion;
    private String provincia;
    private String pais;
}
