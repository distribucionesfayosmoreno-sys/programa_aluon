package com.aluon.crm.documents.model;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteChannel;
import com.aluon.crm.quote.model.QuoteStatus;
import com.aluon.crm.quote.model.QuoteValidationMode;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class QuoteSeriesResolverTest {

    @Test
    void resolvesCurrentSeriesFromExplicitFields() {
        QuoteRequest quote = baseQuote()
                .seriesDate(LocalDate.of(2026, 6, 4))
                .seriesSequence(12)
                .quoteNumber("PTO-20260604-0012")
                .build();

        DocumentSeries series = QuoteSeriesResolver.resolve(quote);

        assertThat(series.date()).isEqualTo(LocalDate.of(2026, 6, 4));
        assertThat(series.sequence()).isEqualTo(12);
    }

    @Test
    void resolvesCurrentSeriesFromNewQuoteNumberFormat() {
        QuoteRequest quote = baseQuote()
                .quoteNumber("PTO-20260604-0012")
                .build();

        DocumentSeries series = QuoteSeriesResolver.resolve(quote);

        assertThat(series.date()).isEqualTo(LocalDate.of(2026, 6, 4));
        assertThat(series.sequence()).isEqualTo(12);
    }

    @Test
    void resolvesLegacySeriesFromQuoteCreatedAtWhenNumberHasYearAndSequenceOnly() {
        QuoteRequest quote = baseQuote()
                .quoteNumber("PT-2026-0012")
                .createdAt(LocalDateTime.of(2026, 6, 21, 10, 15))
                .build();

        DocumentSeries series = QuoteSeriesResolver.resolve(quote);

        assertThat(series.date()).isEqualTo(LocalDate.of(2026, 6, 21));
        assertThat(series.sequence()).isEqualTo(12);
    }

    private QuoteRequest.QuoteRequestBuilder baseQuote() {
        return QuoteRequest.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .quoteNumber("PTO-20260604-0001")
                .customer(null)
                .tariffCode("TARIFA_DEMO")
                .contactEmail("demo@aluon.local")
                .contactWhatsapp("600000000")
                .status(QuoteStatus.ENVIADO)
                .validationMode(QuoteValidationMode.MANUAL)
                .channel(QuoteChannel.EMAIL)
                .total(BigDecimal.ZERO)
                .createdAt(LocalDateTime.of(2026, 6, 4, 10, 0));
    }
}
