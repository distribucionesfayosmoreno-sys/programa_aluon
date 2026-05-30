package com.aluon.crm.doorsimulation.service;

import com.aluon.crm.doorsimulation.event.DoorSimulationInpaintRequestedEvent;
import com.aluon.crm.doorsimulation.integrations.StabilityInpaintingClient;
import com.aluon.crm.doorsimulation.model.DoorVisualSimulationJob;
import com.aluon.crm.doorsimulation.model.DoorVisualSimulationJobStatus;
import com.aluon.crm.doorsimulation.repo.DoorVisualSimulationJobRepository;
import com.aluon.crm.doorsimulation.storage.ObjectStorageService;
import com.aluon.crm.doorsimulation.util.MaskPngFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DoorSimulationInpaintWorker {

    private final DoorVisualSimulationJobRepository repo;
    private final ObjectStorageService objectStorageService;
    private final StabilityInpaintingClient stabilityClient;

    @Async("doorSimulationExecutor")
    @EventListener
    public void onInpaintRequested(DoorSimulationInpaintRequestedEvent event) {
        process(event);
    }

    @Transactional
    protected void process(DoorSimulationInpaintRequestedEvent event) {
        DoorVisualSimulationJob job = repo.findById(event.jobId()).orElse(null);
        if (job == null) return;
        if (job.getStatus() != DoorVisualSimulationJobStatus.PROCESSING) return;
        if (!StringUtils.hasText(job.getBaseImageUrl())) {
            fail(job, "Job inválido: falta baseImageUrl");
            return;
        }
        if (job.getMaskX() == null || job.getMaskY() == null || job.getMaskWidth() == null || job.getMaskHeight() == null) {
            fail(job, "Job inválido: falta máscara");
            return;
        }

        try {
            byte[] baseImageBytes = objectStorageService.getBytesFromUrl(job.getBaseImageUrl());
            BufferedImage decoded = decode(baseImageBytes);
            int w = decoded.getWidth();
            int h = decoded.getHeight();

            byte[] maskPng = MaskPngFactory.createRectMaskPng(w, h, job.getMaskX(), job.getMaskY(), job.getMaskWidth(), job.getMaskHeight());
            byte[] resultBytes = stabilityClient.inpaint(baseImageBytes, maskPng, event.prompt(), event.negativePrompt());
            if (resultBytes == null || resultBytes.length == 0) {
                fail(job, "Stability AI devolvió una respuesta vacía");
                return;
            }

            String resultUrl = objectStorageService.putPng(resultBytes, "door-simulation/result");
            job.setResultImageUrl(resultUrl);
            job.setStatus(DoorVisualSimulationJobStatus.DONE);
            job.setErrorMessage(null);
            job.setUpdatedAt(LocalDateTime.now());
            repo.save(job);
        } catch (Exception ex) {
            fail(job, "Error en inpainting: " + safeMessage(ex));
        }
    }

    private static BufferedImage decode(byte[] bytes) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(bytes));
            if (img == null) throw new IllegalArgumentException("No se pudo decodificar la imagen");
            return img;
        } catch (Exception ex) {
            throw new IllegalArgumentException("No se pudo decodificar la imagen base");
        }
    }

    private void fail(DoorVisualSimulationJob job, String message) {
        job.setStatus(DoorVisualSimulationJobStatus.FAILED);
        job.setErrorMessage(message);
        job.setUpdatedAt(LocalDateTime.now());
        repo.save(job);
    }

    private static String safeMessage(Exception ex) {
        String msg = ex.getMessage();
        if (msg == null) return "error desconocido";
        String trimmed = msg.trim();
        if (trimmed.length() > 500) return trimmed.substring(0, 500);
        return trimmed;
    }
}

