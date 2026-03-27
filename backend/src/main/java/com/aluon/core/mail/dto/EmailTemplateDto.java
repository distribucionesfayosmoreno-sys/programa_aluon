package com.aluon.core.mail.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailTemplateDto {
    private UUID id;
    private String templateKey;
    private String subject;
    private String bodyHtml;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
