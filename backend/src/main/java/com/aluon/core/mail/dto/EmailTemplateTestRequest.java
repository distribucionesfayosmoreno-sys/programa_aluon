package com.aluon.core.mail.dto;

import lombok.Data;

@Data
public class EmailTemplateTestRequest {
    private String templateKey;
    private String to;
    private String nombreComercial;
    private String email;
    private String telefono;
}
