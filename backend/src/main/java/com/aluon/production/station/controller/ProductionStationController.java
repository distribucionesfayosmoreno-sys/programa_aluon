package com.aluon.production.station.controller;

import com.aluon.production.station.dto.ProductionStationBlockRequest;
import com.aluon.production.station.dto.ProductionStationDto;
import com.aluon.production.station.dto.ProductionStationUpdateRequest;
import com.aluon.production.station.model.ProductionStationCode;
import com.aluon.production.station.service.ProductionStationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders/{orderId}/production-stations")
@RequiredArgsConstructor
public class ProductionStationController {

    private final ProductionStationService stationService;

    /** Lista las estaciones de producción de una orden (crea si no existen). */
    @GetMapping
    public ResponseEntity<List<ProductionStationDto>> getStations(@PathVariable UUID orderId) {
        List<ProductionStationDto> stations = stationService.initializeStations(orderId);
        return ResponseEntity.ok(stations);
    }

    /** Avanza una estación (iniciar o completar). */
    @PatchMapping("/{stationCode}/advance")
    public ResponseEntity<ProductionStationDto> advanceStation(
        @PathVariable UUID orderId,
        @PathVariable ProductionStationCode stationCode,
        @Valid @RequestBody ProductionStationUpdateRequest request
    ) {
        ProductionStationDto result = stationService.advanceStation(
            orderId,
            stationCode,
            request.status(),
            request.operatorUserId(),
            request.operatorName(),
            request.notes()
        );
        return ResponseEntity.ok(result);
    }

    /** Bloquea una estación con un motivo. */
    @PatchMapping("/{stationCode}/block")
    public ResponseEntity<ProductionStationDto> blockStation(
        @PathVariable UUID orderId,
        @PathVariable ProductionStationCode stationCode,
        @Valid @RequestBody ProductionStationBlockRequest request
    ) {
        ProductionStationDto result = stationService.blockStation(orderId, stationCode, request.reason());
        return ResponseEntity.ok(result);
    }

    /** Desbloquea una estación. */
    @PatchMapping("/{stationCode}/unblock")
    public ResponseEntity<ProductionStationDto> unblockStation(
        @PathVariable UUID orderId,
        @PathVariable ProductionStationCode stationCode
    ) {
        ProductionStationDto result = stationService.unblockStation(orderId, stationCode);
        return ResponseEntity.ok(result);
    }
}
