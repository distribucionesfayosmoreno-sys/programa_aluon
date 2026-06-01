package com.aluon.production.cutlist.model;

import com.aluon.production.cutlist.dto.CutlistRequestDto;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class UnevennessCalculator {

    public Unevenness calculate(CutlistRequestDto request) {
        Integer heightLeft = request.getHeightLeftMm();
        Integer heightRight = request.getHeightRightMm();
        Integer width = request.getWidthMm();
        Integer nominalHeight = request.getHeightMm();

        boolean present = heightLeft != null
                && heightRight != null
                && !heightLeft.equals(heightRight)
                && width != null
                && width > 0;

        if (!present) {
            int safeHeight = nominalHeight == null ? 0 : nominalHeight;
            int safeWidth = width == null ? 0 : width;
            return new Unevenness(false, safeHeight, safeHeight, safeWidth, "45.00º", 0.0);
        }

        int diff = Math.abs(heightLeft - heightRight);
        double angle = 90.0 - Math.toDegrees(Math.atan2(diff, width));
        double tanSlope = (double) diff / width;
        double slantedWidth = Math.hypot(width, diff);
        String angleStr = String.format(Locale.US, "%.2fº", angle);
        return new Unevenness(true, heightLeft, heightRight, slantedWidth, angleStr, tanSlope);
    }
}

