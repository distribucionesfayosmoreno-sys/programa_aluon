package com.aluon.production.cutlist.model;

import com.aluon.production.cutlist.dto.CutlistRequestDto;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CutlistCalculatorTempTest {

    @Test
    public void test() {
        CutlistCalculator calculator = new CutlistCalculator();
        CutlistRequestDto req = new CutlistRequestDto();
        req.setDoorType(DoorType.ABATIBLE_DOS);
        req.setModel(DoorModel.PREMIUM);
        req.setWidthMm(2000);
        req.setHeightMm(1100);
        req.setHeightLeftMm(1000);
        req.setHeightRightMm(1100);
        req.setTopFrame(false);
        req.setLargueroMm(50);
        req.setGroundClearanceMm(0);

        List<CutlistCalculator.CutlistLine> lines = calculator.generate(req);
        boolean foundAngledLama = false;
        for (CutlistCalculator.CutlistLine line : lines) {
            System.out.println(line.description());
            if (line.description().contains("inglete")) {
                foundAngledLama = true;
            }
        }
        assertTrue(foundAngledLama, "Should have found an angled lama in the cutlist");
    }
}
