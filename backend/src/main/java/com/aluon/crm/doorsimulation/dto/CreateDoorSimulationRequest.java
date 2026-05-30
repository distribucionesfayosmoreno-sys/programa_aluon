package com.aluon.crm.doorsimulation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateDoorSimulationRequest(
        @NotBlank String address,
        @Pattern(regexp = "640x640|512x512") String imageSize,
        Integer fov,
        Double heading,
        Double pitch,
        Double latitude,
        Double longitude
) {
}
