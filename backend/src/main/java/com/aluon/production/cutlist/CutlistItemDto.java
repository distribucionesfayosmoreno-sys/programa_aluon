package com.aluon.production.cutlist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CutlistItemDto {
    private String description;
    private Integer units;
    private String cutMeasure;
}
