package com.aluon.crm.documents.model;

import com.aluon.crm.quote.dto.QuoteRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class QuoteSeriesResolver {

    private static final Pattern LEGACY_QUOTE_NUMBER_PATTERN = Pattern.compile("^[A-Za-z]+-(\\d{4})-(\\d+).*$");

    private QuoteSeriesResolver() {
    }

    public static DocumentSeries resolve(QuoteRequest quote) {
        Objects.requireNonNull(quote, "quote");

        LocalDate seriesDate = quote.getSeriesDate();
        Integer seriesSequence = quote.getSeriesSequence();
        if (seriesDate != null && seriesSequence != null && seriesSequence > 0) {
            return new DocumentSeries(seriesDate, seriesSequence);
        }

        Optional<DocumentSeries> parsed = DocumentSeriesParser.tryParse(quote.getQuoteNumber());
        if (parsed.isPresent()) {
            return parsed.get();
        }

        Optional<DocumentSeries> legacy = resolveLegacySeries(quote.getQuoteNumber(), quote.getCreatedAt());
        if (legacy.isPresent()) {
            return legacy.get();
        }

        throw new IllegalStateException("El presupuesto no tiene una serie válida para enlazar documentos");
    }

    private static Optional<DocumentSeries> resolveLegacySeries(String quoteNumber, LocalDateTime createdAt) {
        if (createdAt == null || quoteNumber == null || quoteNumber.isBlank()) {
            return Optional.empty();
        }

        Matcher matcher = LEGACY_QUOTE_NUMBER_PATTERN.matcher(quoteNumber.trim());
        if (!matcher.matches()) {
            return Optional.empty();
        }

        try {
            int sequence = Integer.parseInt(matcher.group(2));
            if (sequence <= 0) {
                return Optional.empty();
            }
            return Optional.of(new DocumentSeries(createdAt.toLocalDate(), sequence));
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }
}
