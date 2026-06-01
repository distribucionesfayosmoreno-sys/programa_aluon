package com.aluon.production.cutlist.model;

import com.aluon.production.cutlist.dto.CutlistRequestDto;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class CutlistCalculator {

    private final Map<DoorType, DoorCutlistGenerator> generatorsByType;

    public CutlistCalculator(List<DoorCutlistGenerator> generators) {
        Map<DoorType, DoorCutlistGenerator> map = new EnumMap<>(DoorType.class);
        for (DoorCutlistGenerator generator : generators) {
            map.put(generator.supports(), generator);
        }
        this.generatorsByType = Map.copyOf(map);
    }

    public List<CutlistLine> generate(CutlistRequestDto request) {
        DoorType doorType = request.getDoorType();
        DoorCutlistGenerator generator = generatorsByType.get(doorType);
        if (generator == null) {
            throw new IllegalArgumentException("Tipo de puerta no soportado: " + doorType);
        }
        return generator.generate(request);
    }
}

