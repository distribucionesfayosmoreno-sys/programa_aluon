package com.aluon.crm.customer.model;

import java.util.Locale;
import java.util.Set;

public enum PaymentMethod {
    TRANSFERENCIA,
    GIRO,
    TARJETA,
    CONTADO;

    private static final Set<String> VALUES = Set.of(
            TRANSFERENCIA.name(),
            GIRO.name(),
            TARJETA.name(),
            CONTADO.name()
    );

    public static boolean isValid(String value) {
        if (value == null) {
            return false;
        }
        return VALUES.contains(normalize(value));
    }

    public static String normalize(String value) {
        if (value == null) {
            return null;
        }
        return value.trim().toUpperCase(Locale.ROOT);
    }
}
