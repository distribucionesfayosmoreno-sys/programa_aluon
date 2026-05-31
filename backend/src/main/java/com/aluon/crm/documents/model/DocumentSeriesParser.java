package com.aluon.crm.documents.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Objects;
import java.util.Optional;

public final class DocumentSeriesParser {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.BASIC_ISO_DATE;

    private DocumentSeriesParser() {
    }

    public static Optional<DocumentSeries> tryParse(String documentNumber) {
        if (documentNumber == null || documentNumber.isBlank()) return Optional.empty();
        String[] parts = documentNumber.trim().split("-");
        if (parts.length != 3) return Optional.empty();

        String datePart = parts[1];
        String seqPart = parts[2];

        try {
            LocalDate date = LocalDate.parse(datePart, DATE_FORMAT);
            int seq = Integer.parseInt(seqPart);
            if (seq <= 0) return Optional.empty();
            return Optional.of(new DocumentSeries(date, seq));
        } catch (DateTimeParseException | NumberFormatException ex) {
            return Optional.empty();
        }
    }

    public static DocumentSeries require(DocumentSeries series) {
        return Objects.requireNonNull(series, "series");
    }
}

