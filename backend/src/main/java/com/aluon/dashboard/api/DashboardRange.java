package com.aluon.dashboard.api;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;

public enum DashboardRange {
    DAY,
    WEEK,
    MONTH,
    YEAR;

    public static DashboardRange from(String raw) {
        if (raw == null) return MONTH;
        String normalized = raw.trim().toUpperCase();
        return switch (normalized) {
            case "DAY" -> DAY;
            case "WEEK" -> WEEK;
            case "MONTH" -> MONTH;
            case "YEAR" -> YEAR;
            default -> MONTH;
        };
    }

    public LocalDateTime start(Clock clock) {
        LocalDate today = LocalDate.now(clock);
        return switch (this) {
            case DAY -> today.atStartOfDay();
            case WEEK -> today.minusDays(6).atStartOfDay();
            case MONTH -> today.withDayOfMonth(1).atStartOfDay();
            case YEAR -> today.withDayOfYear(1).atStartOfDay();
        };
    }

    public LocalDateTime endExclusive(Clock clock) {
        LocalDate today = LocalDate.now(clock);
        return switch (this) {
            case DAY -> today.plusDays(1).atStartOfDay();
            case WEEK -> today.plusDays(1).atStartOfDay();
            case MONTH -> today.plusDays(1).atStartOfDay();
            case YEAR -> today.plusDays(1).atStartOfDay();
        };
    }
}
