package com.aluon.crm.quote.render;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.Currency;
import java.util.Locale;

final class MoneyFormatter {

    private static final Locale LOCALE_ES = new Locale("es", "ES");

    private final NumberFormat format;

    MoneyFormatter() {
        NumberFormat f = NumberFormat.getCurrencyInstance(LOCALE_ES);
        f.setCurrency(Currency.getInstance("EUR"));
        this.format = f;
    }

    String formatEur(BigDecimal value) {
        if (value == null) return "-";
        BigDecimal scaled = value.setScale(2, RoundingMode.HALF_UP);
        return format.format(scaled);
    }
}
