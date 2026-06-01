package com.aluon.crm.infra;

import java.util.Locale;
import java.util.Random;

final class LocalSeedNames {

    private LocalSeedNames() {
    }

    static String companyNameForSeed(String seedKey) {
        String key = seedKey == null ? "" : seedKey.trim().toLowerCase(Locale.ROOT);
        Random random = new Random(stableHash64(key));

        String[] prefixes = {
                "Talleres",
                "Carpintería",
                "Aluminios",
                "Cerrajería",
                "Construcciones",
                "Reformas",
                "Metalúrgica",
                "Suministros",
        };

        String[] baseNames = {
                "Sierra",
                "Levante",
                "Del Sur",
                "Costa Azul",
                "Vega Alta",
                "Ribera",
                "Montesol",
                "Roca Fuerte",
                "Puerta Nueva",
                "Nexo",
                "Alborán",
                "Valle Verde",
                "Mirador",
                "San Jorge",
                "La Estación",
        };

        String[] suffixes = { "S.L.", "S.L.U.", "C.B.", "e Hijos", "& Asociados" };

        String prefix = pick(random, prefixes);
        String name = pick(random, baseNames);
        String suffix = pick(random, suffixes);

        // Some variety in formatting
        if (random.nextBoolean()) {
            return String.format("%s %s %s", prefix, name, suffix);
        }
        return String.format("%s %s, %s", prefix, name, suffix);
    }

    static String contactPersonForSeed(String seedKey) {
        String key = seedKey == null ? "" : seedKey.trim().toLowerCase(Locale.ROOT);
        Random random = new Random(stableHash64("contact:" + key));

        String[] firstNames = {
                "Carlos", "Lucía", "Javier", "María", "Sergio", "Carmen", "David", "Paula",
                "Alejandro", "Marta", "Rubén", "Laura", "Antonio", "Sara", "Miguel", "Elena",
        };
        String[] lastNames = {
                "García", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Díaz",
                "Hernández", "Ruiz", "Jiménez", "Moreno", "Álvarez", "Romero", "Navarro", "Torres",
        };

        return String.format("%s %s", pick(random, firstNames), pick(random, lastNames)).toUpperCase(Locale.ROOT);
    }

    private static String pick(Random random, String[] values) {
        return values[random.nextInt(values.length)];
    }

    private static long stableHash64(String value) {
        long h = 1125899906842597L; // prime
        for (int i = 0; i < value.length(); i += 1) {
            h = 31L * h + value.charAt(i);
        }
        return h;
    }
}

