package com.aluon.core.whatsapp.dto;

public record WhatsappTemplateRequest(
        String templateKey,
        String messageText
) {
}
