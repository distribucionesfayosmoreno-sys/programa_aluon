package com.aluon.crm.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerPasswordResetConfirmRequest {
    private String token;
    private String password;
}
