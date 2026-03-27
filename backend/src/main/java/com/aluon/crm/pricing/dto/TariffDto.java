package com.aluon.crm.pricing.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TariffDto {
    private String code;
    private String label;
}
