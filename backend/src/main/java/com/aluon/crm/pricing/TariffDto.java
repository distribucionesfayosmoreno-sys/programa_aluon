package com.aluon.crm.pricing;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TariffDto {
    private String code;
    private String label;
}
