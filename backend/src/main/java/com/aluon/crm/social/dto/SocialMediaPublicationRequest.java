package com.aluon.crm.social.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.time.OffsetDateTime;
import java.util.List;

public record SocialMediaPublicationRequest(
        @NotBlank String title,
        @NotBlank String content,
        String mediaUrl,
        OffsetDateTime scheduledAt,
        @NotEmpty @Valid List<SocialMediaChannelRequest> channels
) {
}
