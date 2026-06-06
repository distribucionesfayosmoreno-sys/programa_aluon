package com.aluon.core.whatsapp.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record WhatsappTemplateDto(
        UUID id,
        String templateKey,
        String messageText,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
