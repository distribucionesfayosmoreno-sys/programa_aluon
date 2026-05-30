package com.aluon.crm.doorsimulation.storage;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
@ConditionalOnProperty(prefix = "integrations.door-simulation.google-street-view", name = "enabled", havingValue = "true")
public class DoorSimulationAssetsController {

    private final ObjectStorageService objectStorageService;

    public DoorSimulationAssetsController(ObjectStorageService objectStorageService) {
        this.objectStorageService = objectStorageService;
    }

    @GetMapping("/api/door-visual-simulations/assets/{*assetPath}")
    public ResponseEntity<byte[]> getAsset(@PathVariable String assetPath) {
        if (!StringUtils.hasText(assetPath)) {
            return ResponseEntity.notFound().build();
        }
        String cleanAssetPath = assetPath.startsWith("/") ? assetPath.substring(1) : assetPath;
        String path = "/api/door-visual-simulations/assets/" + cleanAssetPath;
        byte[] body = objectStorageService.getBytesFromUrl(path);
        MediaType mediaType = path.endsWith(".png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG;
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .contentType(mediaType)
                .body(body);
    }
}
