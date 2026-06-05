package com.aluon.crm.social.model;

public enum SocialMediaPlatform {
    FACEBOOK(1, "Facebook"),
    INSTAGRAM(2, "Instagram"),
    X(3, "X"),
    TIKTOK(4, "TikTok");

    private final int sortOrder;
    private final String displayName;

    SocialMediaPlatform(int sortOrder, String displayName) {
        this.sortOrder = sortOrder;
        this.displayName = displayName;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public String getDisplayName() {
        return displayName;
    }
}
