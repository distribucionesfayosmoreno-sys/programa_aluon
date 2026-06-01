package com.aluon.production.cutlist.model;

import com.aluon.production.cutlist.dto.CutlistRequestDto;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CutlistCalculatorUnevenLamasTest {

    @Test
    void generatesMultipleAngledLamasWhenDropCrossesMoreThanRemainder() {
        CutlistLineFactory lineFactory = new CutlistLineFactory();
        BottomFrameMiterCalculator bottomFrameMiterCalculator = new BottomFrameMiterCalculator();
        CutlistModelRules modelRules = new CutlistModelRules(lineFactory, bottomFrameMiterCalculator);
        UnevennessCalculator unevennessCalculator = new UnevennessCalculator();
        LamaCutlistAppender lamaAppender = new LamaCutlistAppender(lineFactory, modelRules);

        DoorCutlistGenerator generator = new AbatibleDosCutlistGenerator(
                lineFactory,
                modelRules,
                unevennessCalculator,
                lamaAppender
        );
        CutlistCalculator calculator = new CutlistCalculator(List.of(generator));

        CutlistRequestDto req = new CutlistRequestDto();
        req.setDoorType(DoorType.ABATIBLE_DOS);
        req.setModel(DoorModel.PREMIUM);
        req.setWidthMm(2000);
        req.setHeightMm(1175);
        req.setHeightLeftMm(775);
        req.setHeightRightMm(1175);
        req.setTopFrame(false);
        req.setLargueroMm(50);
        req.setGroundClearanceMm(0);
        req.setAutomationReinforcement(false);

        List<CutlistLine> lines = calculator.generate(req);

        long angledLamas = lines.stream()
                .filter(line -> line.description().contains("Lama adicional"))
                .filter(line -> line.description().contains("inglete"))
                .count();
        assertEquals(1, angledLamas, "Expected exactly 1 angled lama line");

        boolean hasAngledBottomFrame = lines.stream()
                .anyMatch(line -> line.description().contains("Marco Horizontal") && line.description().contains("inglete") && line.description().contains("/"));
        assertTrue(hasAngledBottomFrame, "Expected bottom frame cut with inglete angles");

        boolean hasFullLamas = lines.stream()
                .anyMatch(line -> line.description().equals("Lama 200x20 corte recto") && line.units() > 0);
        assertTrue(hasFullLamas, "Expected some full straight lamas");
    }
}
