package com.aluon.production.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderItemDto {
    private String description;
    private Integer units;
    private String cutMeasure;
}
