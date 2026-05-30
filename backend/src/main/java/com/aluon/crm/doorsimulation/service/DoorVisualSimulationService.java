package com.aluon.crm.doorsimulation.service;

import com.aluon.crm.doorsimulation.config.DoorSimulationGoogleProperties;
import com.aluon.crm.doorsimulation.dto.CreateDoorSimulationRequest;
import com.aluon.crm.doorsimulation.dto.CreateDoorSimulationResponse;
import com.aluon.crm.doorsimulation.dto.DoorSimulationFrontendConfigResponse;
import com.aluon.crm.doorsimulation.dto.DoorSimulationStatusResponse;
import com.aluon.crm.doorsimulation.dto.MaskRectDto;
import com.aluon.crm.doorsimulation.dto.StartInpaintRequest;
import com.aluon.crm.doorsimulation.dto.StartInpaintResponse;
import com.aluon.crm.doorsimulation.event.DoorSimulationInpaintRequestedEvent;
import com.aluon.crm.doorsimulation.integrations.GoogleStreetViewClient;
import com.aluon.crm.doorsimulation.model.DoorVisualSimulationJob;
import com.aluon.crm.doorsimulation.model.DoorVisualSimulationJobStatus;
import com.aluon.crm.doorsimulation.repo.DoorVisualSimulationJobRepository;
import com.aluon.crm.doorsimulation.storage.ObjectStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "integrations.door-simulation.google-street-view", name = "enabled", havingValue = "true")
public class DoorVisualSimulationService {

    private static final int DEFAULT_POLL_AFTER_MS = 1500;

    private final DoorSimulationGoogleProperties googleProps;
    private final GoogleStreetViewClient streetViewClient;
    private final ObjectStorageService objectStorageService;
    private final DoorVisualSimulationJobRepository repo;
    private final ApplicationEventPublisher events;

    @Transactional
    public CreateDoorSimulationResponse createJobAndFetchBaseImage(CreateDoorSimulationRequest request) {
        String address = requireNonBlank(request.address(), "address");
        String imageSize = StringUtils.hasText(request.imageSize()) ? request.imageSize() : googleProps.defaultImageSize();
        int fov = request.fov() != null ? request.fov() : googleProps.defaultFov();
        if (!("640x640".equals(imageSize) || "512x512".equals(imageSize))) throw new IllegalArgumentException("imageSize inválido");
        if (fov < 10 || fov > 120) throw new IllegalArgumentException("fov inválido (10..120)");

        String location = resolveLocation(request, address);
        byte[] bytes = streetViewClient.fetchStreetViewImage(location, imageSize, fov, request.heading(), request.pitch());
        if (bytes == null || bytes.length == 0) throw new IllegalArgumentException("No se pudo obtener la imagen base");

        String url = objectStorageService.putJpeg(bytes, "door-simulation/base");

        LocalDateTime now = LocalDateTime.now();
        UUID id = UUID.randomUUID();
        DoorVisualSimulationJob job = DoorVisualSimulationJob.builder()
                .id(id)
                .address(address)
                .status(DoorVisualSimulationJobStatus.AWAITING_MASK)
                .baseImageUrl(url)
                .createdAt(now)
                .updatedAt(now)
                .build();

        repo.save(job);

        int[] dims = parseSize(imageSize);
        return new CreateDoorSimulationResponse(id, job.getStatus(), url, dims[0], dims[1]);
    }

    @Transactional
    public StartInpaintResponse startInpaint(UUID jobId, StartInpaintRequest request) {
        DoorVisualSimulationJob job = repo.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job no encontrado"));
        if (job.getStatus() == DoorVisualSimulationJobStatus.PROCESSING) {
            throw new IllegalArgumentException("El job ya está en procesamiento");
        }
        if (!StringUtils.hasText(job.getBaseImageUrl())) {
            throw new IllegalArgumentException("Job inválido: falta baseImageUrl");
        }

        MaskRectDto rect = request.maskRect();
        job.setMaskX(rect.x());
        job.setMaskY(rect.y());
        job.setMaskWidth(rect.width());
        job.setMaskHeight(rect.height());
        job.setStatus(DoorVisualSimulationJobStatus.PROCESSING);
        job.setErrorMessage(null);
        job.setUpdatedAt(LocalDateTime.now());
        repo.save(job);

        events.publishEvent(new DoorSimulationInpaintRequestedEvent(jobId, request.prompt(), request.negativePrompt()));
        return new StartInpaintResponse(jobId, job.getStatus(), DEFAULT_POLL_AFTER_MS);
    }

    @Transactional(readOnly = true)
    public DoorSimulationStatusResponse getStatus(UUID jobId) {
        DoorVisualSimulationJob job = repo.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job no encontrado"));
        return new DoorSimulationStatusResponse(
                job.getId(),
                job.getStatus(),
                job.getBaseImageUrl(),
                job.getResultImageUrl(),
                job.getErrorMessage(),
                job.getCreatedAt(),
                job.getUpdatedAt()
        );
    }

    @Transactional(readOnly = true)
    public DoorSimulationFrontendConfigResponse getFrontendConfig() {
        String browserApiKey = StringUtils.hasText(googleProps.browserApiKey()) ? googleProps.browserApiKey() : googleProps.apiKey();
        return new DoorSimulationFrontendConfigResponse(googleProps.enabled(), browserApiKey);
    }

    private static int[] parseSize(String imageSize) {
        if (!StringUtils.hasText(imageSize)) throw new IllegalArgumentException("imageSize inválido");
        String[] parts = imageSize.split("x");
        if (parts.length != 2) throw new IllegalArgumentException("imageSize inválido");
        int w = Integer.parseInt(parts[0]);
        int h = Integer.parseInt(parts[1]);
        return new int[]{w, h};
    }

    private static String requireNonBlank(String value, String field) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException(field + " es obligatorio");
        return value.trim();
    }

    private static String resolveLocation(CreateDoorSimulationRequest request, String fallbackAddress) {
        Double latitude = request.latitude();
        Double longitude = request.longitude();
        if (latitude != null && longitude != null) {
            return latitude + "," + longitude;
        }
        return fallbackAddress;
    }
}
