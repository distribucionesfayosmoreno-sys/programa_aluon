package com.aluon.crm.social.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.TenantId;

import java.util.UUID;

@Entity
@Table(name = "social_media_publication_channels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialMediaPublicationChannel {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "publication_id", nullable = false)
    private SocialMediaPublication publication;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform", nullable = false, length = 20)
    private SocialMediaPlatform platform;

    @Column(name = "enabled", nullable = false)
    private boolean enabled;

    @Column(name = "account_name", length = 120)
    private String accountName;

    @Column(name = "account_handle", length = 120)
    private String accountHandle;

    @Column(name = "profile_url", columnDefinition = "text")
    private String profileUrl;

    @Column(name = "caption_override", columnDefinition = "text")
    private String captionOverride;

    @Column(name = "hashtags", columnDefinition = "text")
    private String hashtags;

    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;
}
