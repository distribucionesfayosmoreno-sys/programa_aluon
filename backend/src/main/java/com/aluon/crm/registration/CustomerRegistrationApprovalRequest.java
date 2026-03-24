package com.aluon.crm.registration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerRegistrationApprovalRequest {
    private String tariffCode;
    private Boolean autoApproveQuotes;
}
