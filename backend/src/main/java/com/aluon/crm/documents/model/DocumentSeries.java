package com.aluon.crm.documents.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

public record DocumentSeries(LocalDate date, int sequence) {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.BASIC_ISO_DATE;

    public DocumentSeries {
        Objects.requireNonNull(date, "date");
        if (sequence <= 0) throw new IllegalArgumentException("sequence must be > 0");
    }

    public String format(DocumentPrefix prefix) {
        Objects.requireNonNull(prefix, "prefix");
        String datePart = date.format(DATE_FORMAT);
        String seqPart = String.format("%04d", sequence);
        return prefix.name() + "-" + datePart + "-" + seqPart;
    }
}

