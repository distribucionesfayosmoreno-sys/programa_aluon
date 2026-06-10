package com.aluon.crm.customer.model;

import java.util.Locale;

public enum CustomerTariff {
    TARIFA_A("A", "TARIFA A (CLIENTES HABITUALES)"),
    TARIFA_B("B", "TARIFA B (CLIENTES NUEVOS)");

    private final String code;
    private final String label;

    CustomerTariff(String code, String label) {
        this.code = code;
        this.label = label;
    }

    public String code() {
        return code;
    }

    public String label() {
        return label;
    }

    public static CustomerTariff fromRaw(String raw) {
        String normalized = normalize(raw);
        if ("B".equals(normalized) || normalized.contains("NUEV")) {
            return TARIFA_B;
        }
        return TARIFA_A;
    }

    public static String normalizeCode(String raw) {
        return fromRaw(raw).code();
    }

    private static String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().toUpperCase(Locale.ROOT);
    }
}
