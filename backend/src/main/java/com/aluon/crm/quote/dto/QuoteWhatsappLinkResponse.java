package com.aluon.crm.quote.dto;

public record QuoteWhatsappLinkResponse(
        String url,
        String message,
        String documentUrl
) {
}
