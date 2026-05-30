package com.aluon.dashboard.api;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DashboardFinanceResponse(
        Donut income,
        Donut expenses,
        List<Tile> tiles,
        Trend trend,
        List<Transaction> transactions,
        List<Bar> paymentIssues,
        List<HistogramRow> histogram
) {

    public record Donut(
            String title,
            BigDecimal total,
            List<Slice> slices
    ) {
    }

    public record Slice(
            String id,
            String label,
            BigDecimal value
    ) {
    }

    public record Tile(
            String id,
            String label,
            BigDecimal amount
    ) {
    }

    public record Trend(
            String label,
            List<Point> points
    ) {
    }

    public record Point(
            LocalDate day,
            BigDecimal value
    ) {
    }

    public record Transaction(
            String id,
            String title,
            String subtitle,
            BigDecimal amount,
            LocalDate day,
            String tone
    ) {
    }

    public record Bar(
            String id,
            String label,
            long value
    ) {
    }

    public record HistogramRow(
            String id,
            String label,
            BigDecimal value
    ) {
    }
}
