package com.aluon.crm.social.dto;

import com.aluon.crm.social.model.SocialMediaPublicationStatus;

import java.time.OffsetDateTime;
import java.util.List;

public record SocialMediaPublicationResponse(
        String id,
        String title,
        String content,
        String mediaUrl,
        SocialMediaPublicationStatus status,
        OffsetDateTime scheduledAt,
        OffsetDateTime queuedAt,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        List<SocialMediaChannelResponse> channels
) {
}
