package com.aluon.crm.doorsimulation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record StartInpaintRequest(
        @NotNull @Valid MaskRectDto maskRect,
        String prompt,
        String negativePrompt
) {
}

