package com.aluon.crm.social.service;

import com.aluon.crm.social.dto.SocialMediaChannelRequest;
import com.aluon.crm.social.dto.SocialMediaChannelResponse;
import com.aluon.crm.social.dto.SocialMediaPublicationRequest;
import com.aluon.crm.social.dto.SocialMediaPublicationResponse;
import com.aluon.crm.social.model.SocialMediaPlatform;
import com.aluon.crm.social.model.SocialMediaPublication;
import com.aluon.crm.social.model.SocialMediaPublicationChannel;
import com.aluon.crm.social.model.SocialMediaPublicationStatus;
import com.aluon.crm.social.repository.SocialMediaPublicationRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocialMediaPublicationService {

    private final SocialMediaPublicationRepository repository;
    private final CurrentTenantIdentifierResolver<UUID> tenantResolver;

    @Transactional(readOnly = true)
    public List<SocialMediaPublicationResponse> listPublications() {
        return repository.findAllByOrderByUpdatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SocialMediaPublicationResponse getPublication(UUID publicationId) {
        return toResponse(requirePublication(publicationId));
    }

    @Transactional
    public SocialMediaPublicationResponse createPublication(SocialMediaPublicationRequest request) {
        SocialMediaPublication publication = SocialMediaPublication.builder()
                .tenantId(resolveTenantId())
                .title(clean(request.title()))
                .content(clean(request.content()))
                .mediaUrl(cleanNullable(request.mediaUrl()))
                .status(resolveStatusForSave(null, request.scheduledAt()))
                .scheduledAt(request.scheduledAt())
                .queuedAt(null)
                .build();
        publication.replaceChannels(buildChannels(publication, request.channels()));
        return toResponse(repository.save(publication));
    }

    @Transactional
    public SocialMediaPublicationResponse updatePublication(UUID publicationId, SocialMediaPublicationRequest request) {
        SocialMediaPublication publication = requirePublication(publicationId);
        publication.setTitle(clean(request.title()));
        publication.setContent(clean(request.content()));
        publication.setMediaUrl(cleanNullable(request.mediaUrl()));
        publication.setScheduledAt(request.scheduledAt());
        publication.setStatus(resolveStatusForSave(publication.getStatus(), request.scheduledAt()));
        if (publication.getStatus() != SocialMediaPublicationStatus.QUEUED) {
            publication.setQueuedAt(null);
        }
        publication.replaceChannels(buildChannels(publication, request.channels()));
        return toResponse(repository.save(publication));
    }

    @Transactional
    public void deletePublication(UUID publicationId) {
        repository.delete(requirePublication(publicationId));
    }

    @Transactional
    public SocialMediaPublicationResponse launchPublication(UUID publicationId) {
        SocialMediaPublication publication = requirePublication(publicationId);
        if (publication.getStatus() == SocialMediaPublicationStatus.PUBLISHED) {
            throw new IllegalArgumentException("La publicación ya fue marcada como publicada");
        }
        if (publication.getStatus() != SocialMediaPublicationStatus.QUEUED) {
            publication.setStatus(SocialMediaPublicationStatus.QUEUED);
            publication.setQueuedAt(OffsetDateTime.now());
            repository.save(publication);
        }
        return toResponse(publication);
    }

    private List<SocialMediaPublicationChannel> buildChannels(SocialMediaPublication publication, List<SocialMediaChannelRequest> requests) {
        validateChannels(requests);
        List<SocialMediaPublicationChannel> channels = new ArrayList<>();
        for (SocialMediaChannelRequest request : requests) {
            SocialMediaPublicationChannel channel = SocialMediaPublicationChannel.builder()
                    .tenantId(resolveTenantId())
                    .publication(publication)
                    .platform(request.platform())
                    .enabled(request.enabled())
                    .accountName(cleanNullable(request.accountName()))
                    .accountHandle(cleanNullable(request.accountHandle()))
                    .profileUrl(cleanNullable(request.profileUrl()))
                    .captionOverride(cleanNullable(request.captionOverride()))
                    .hashtags(cleanNullable(request.hashtags()))
                    .notes(cleanNullable(request.notes()))
                    .sortOrder(request.sortOrder())
                    .build();
            channels.add(channel);
        }
        channels.sort((left, right) -> Integer.compare(left.getSortOrder(), right.getSortOrder()));
        return channels;
    }

    private void validateChannels(List<SocialMediaChannelRequest> requests) {
        if (requests.size() != SocialMediaPlatform.values().length) {
            throw new IllegalArgumentException("Deben configurarse los cuatro canales: Facebook, Instagram, X y TikTok");
        }
        EnumSet<SocialMediaPlatform> platforms = EnumSet.noneOf(SocialMediaPlatform.class);
        for (SocialMediaChannelRequest request : requests) {
            if (!platforms.add(request.platform())) {
                throw new IllegalArgumentException("No puede repetirse el canal " + request.platform());
            }
        }
        if (platforms.size() != SocialMediaPlatform.values().length) {
            throw new IllegalArgumentException("Falta configurar alguno de los canales requeridos");
        }
    }

    private SocialMediaPublicationStatus resolveStatusForSave(SocialMediaPublicationStatus currentStatus, OffsetDateTime scheduledAt) {
        if (currentStatus == SocialMediaPublicationStatus.QUEUED || currentStatus == SocialMediaPublicationStatus.PUBLISHED) {
            return currentStatus;
        }
        return scheduledAt == null ? SocialMediaPublicationStatus.DRAFT : SocialMediaPublicationStatus.SCHEDULED;
    }

    private SocialMediaPublication requirePublication(UUID publicationId) {
        UUID id = Objects.requireNonNull(publicationId, "publicationId");
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));
    }

    private SocialMediaPublicationResponse toResponse(SocialMediaPublication publication) {
        return new SocialMediaPublicationResponse(
                publication.getId().toString(),
                publication.getTitle(),
                publication.getContent(),
                publication.getMediaUrl(),
                publication.getStatus(),
                publication.getScheduledAt(),
                publication.getQueuedAt(),
                publication.getCreatedAt(),
                publication.getUpdatedAt(),
                publication.getChannels().stream()
                        .sorted((left, right) -> Integer.compare(left.getSortOrder(), right.getSortOrder()))
                        .map(this::toResponse)
                        .toList()
        );
    }

    private SocialMediaChannelResponse toResponse(SocialMediaPublicationChannel channel) {
        return new SocialMediaChannelResponse(
                channel.getId().toString(),
                channel.getPlatform(),
                channel.isEnabled(),
                channel.getAccountName(),
                channel.getAccountHandle(),
                channel.getProfileUrl(),
                channel.getCaptionOverride(),
                channel.getHashtags(),
                channel.getNotes(),
                channel.getSortOrder()
        );
    }

    private UUID resolveTenantId() {
        return tenantResolver.resolveCurrentTenantIdentifier();
    }

    private String clean(String value) {
        return Objects.requireNonNull(value, "value").trim();
    }

    private String cleanNullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
