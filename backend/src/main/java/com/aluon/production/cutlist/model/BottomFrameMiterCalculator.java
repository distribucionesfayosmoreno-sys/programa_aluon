package com.aluon.production.cutlist.model;

import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class BottomFrameMiterCalculator {

    public record BottomFrameMiter(String angleLeft, String angleRight, double lengthMm) {
    }

    public BottomFrameMiter calculate(Unevenness unevenness, double horizontalWidthMm) {
        if (unevenness == null || !unevenness.present() || horizontalWidthMm <= 0) {
            return new BottomFrameMiter("90.00º", "90.00º", horizontalWidthMm);
        }

        double thetaDeg = Math.toDegrees(Math.atan(unevenness.slopeTan()));
        double acute = 90.0 - thetaDeg;
        double obtuse = 90.0 + thetaDeg;

        boolean leftHigher = unevenness.isLeftHigher();
        String left = formatDeg(leftHigher ? obtuse : acute);
        String right = formatDeg(leftHigher ? acute : obtuse);

        double riseMm = horizontalWidthMm * unevenness.slopeTan();
        double length = Math.hypot(horizontalWidthMm, riseMm);
        return new BottomFrameMiter(left, right, length);
    }

    private String formatDeg(double value) {
        return String.format(Locale.US, "%.2fº", value);
    }
}

