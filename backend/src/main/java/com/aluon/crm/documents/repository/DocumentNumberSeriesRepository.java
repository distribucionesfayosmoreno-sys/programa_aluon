package com.aluon.crm.documents.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Repository
public class DocumentNumberSeriesRepository {

    private final JdbcTemplate jdbcTemplate;

    public DocumentNumberSeriesRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = Objects.requireNonNull(jdbcTemplate, "jdbcTemplate");
    }

    public int nextSequence(UUID tenantId, LocalDate seriesDate) {
        Objects.requireNonNull(tenantId, "tenantId");
        Objects.requireNonNull(seriesDate, "seriesDate");

        Integer allocated = jdbcTemplate.queryForObject(
                """
                INSERT INTO document_number_series (tenant_id, series_date, last_sequence)
                VALUES (?, ?, 1)
                ON CONFLICT (tenant_id, series_date)
                DO UPDATE SET last_sequence = document_number_series.last_sequence + 1
                RETURNING last_sequence
                """,
                Integer.class,
                tenantId,
                seriesDate
        );

        if (allocated == null || allocated <= 0) {
            throw new IllegalStateException("No se pudo reservar un número de documento");
        }
        return allocated;
    }
}

