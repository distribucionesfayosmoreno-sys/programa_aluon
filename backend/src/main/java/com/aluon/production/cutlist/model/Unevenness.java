package com.aluon.production.cutlist.model;

public record Unevenness(
        boolean present,
        int heightLeftMm,
        int heightRightMm,
        double slantedWidthMm,
        String angle,
        double slopeTan
) {
    public int diffMm() {
        return Math.abs(heightLeftMm - heightRightMm);
    }

    public boolean isLeftHigher() {
        return heightLeftMm > heightRightMm;
    }
}

