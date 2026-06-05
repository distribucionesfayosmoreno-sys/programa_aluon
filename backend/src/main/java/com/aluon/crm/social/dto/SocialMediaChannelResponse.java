package com.aluon.crm.social.dto;

import com.aluon.crm.social.model.SocialMediaPlatform;

public record SocialMediaChannelResponse(
        String id,
        SocialMediaPlatform platform,
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
