package com.aluon.crm.social.dto;

import com.aluon.crm.social.model.SocialMediaPlatform;
import jakarta.validation.constraints.NotNull;

public record SocialMediaChannelRequest(
        @NotNull SocialMediaPlatform platform,
        boolean enabled,
        String accountName,
        String accountHandle,
        String profileUrl,
        String captionOverride,
        String hashtags,
        String notes,
        int sortOrder
) {
}
