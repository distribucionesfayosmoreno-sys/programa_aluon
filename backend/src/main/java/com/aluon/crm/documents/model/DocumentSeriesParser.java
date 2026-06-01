package com.aluon.crm.documents.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class DocumentSeriesParser {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.BASIC_ISO_DATE;
    private static final Pattern SERIES_PATTERN = Pattern.compile("^[A-Za-z]+-(\\d{8})-(\\d+).*$");

    private DocumentSeriesParser() {
    }

    public static Optional<DocumentSeries> tryParse(String documentNumber) {
        if (documentNumber == null || documentNumber.isBlank()) return Optional.empty();
        String normalized = documentNumber.trim();
        Matcher matcher = SERIES_PATTERN.matcher(normalized);
        if (!matcher.matches()) return Optional.empty();

        String datePart = matcher.group(1);
        String seqPart = matcher.group(2);

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
