package com.aluon.crm.doorsimulation.dto;

import jakarta.validation.constraints.Min;

public record MaskRectDto(
        @Min(0) int x,
        @Min(0) int y,
        @Min(1) int width,
        @Min(1) int height
) {
}

