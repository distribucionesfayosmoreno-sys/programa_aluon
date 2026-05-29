package com.aluon.crm.quote.dto;

public record QuoteEmailSendRequest(
        String to,
        String subject,
        String message
) {
}

