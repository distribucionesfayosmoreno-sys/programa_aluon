package com.aluon.core.signature.dto;

import lombok.Data;

@Data
public class UpdateEmailSignatureRequest {
    private String fullName;
    private String role;
    private String phone;
    private String email;
    private String website;
    private String address;
    private String logoUrl;
    private String accentColor;
}
