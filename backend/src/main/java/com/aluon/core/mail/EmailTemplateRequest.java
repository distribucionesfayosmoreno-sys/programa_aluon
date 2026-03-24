package com.aluon.core.mail;

import lombok.Data;

@Data
public class EmailTemplateRequest {
    private String templateKey;
    private String subject;
    private String bodyHtml;
}
