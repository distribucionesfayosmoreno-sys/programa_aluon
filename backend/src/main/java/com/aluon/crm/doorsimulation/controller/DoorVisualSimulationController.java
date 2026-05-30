package com.aluon.crm.doorsimulation.controller;

import com.aluon.crm.doorsimulation.dto.CreateDoorSimulationRequest;
import com.aluon.crm.doorsimulation.dto.CreateDoorSimulationResponse;
import com.aluon.crm.doorsimulation.dto.DoorSimulationStatusResponse;
import com.aluon.crm.doorsimulation.dto.StartInpaintRequest;
import com.aluon.crm.doorsimulation.dto.StartInpaintResponse;
import com.aluon.crm.doorsimulation.service.DoorVisualSimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/door-visual-simulations")
@RequiredArgsConstructor
public class DoorVisualSimulationController {

    private final DoorVisualSimulationService service;

    @PostMapping
    public ResponseEntity<CreateDoorSimulationResponse> create(@Valid @RequestBody CreateDoorSimulationRequest request) {
        return ResponseEntity.ok(service.createJobAndFetchBaseImage(request));
    }

    @PostMapping("/{jobId}/inpaint")
    public ResponseEntity<StartInpaintResponse> startInpaint(@PathVariable UUID jobId, @Valid @RequestBody StartInpaintRequest request) {
        return ResponseEntity.ok(service.startInpaint(jobId, request));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<DoorSimulationStatusResponse> getStatus(@PathVariable UUID jobId) {
        return ResponseEntity.ok(service.getStatus(jobId));
    }
}

