package com.aluon.crm.catalog.porton;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import java.nio.charset.StandardCharsets;
import java.sql.DriverManager;
import static org.assertj.core.api.Assertions.assertThat;

class PortonMigrationTest {
    @Test void migrationPreservesOldLinesAndCanBeAppliedTwice() throws Exception {
        try (var connection = DriverManager.getConnection("jdbc:h2:mem:porton-migration")) {
            try (var statement = connection.createStatement()) {
                statement.execute("CREATE TABLE aluon_saas_quote_items (id INTEGER PRIMARY KEY)");
                statement.execute("INSERT INTO aluon_saas_quote_items(id) VALUES (1)");
                try (var input = new ClassPathResource("db/migration/V59__quote_items_porton_configuration.sql").getInputStream()) {
                    var sql = new String(input.readAllBytes(), StandardCharsets.UTF_8);
                    statement.execute(sql);
                    statement.execute(sql);
                }
                try (var rows = statement.executeQuery("SELECT id, porton_configuration FROM aluon_saas_quote_items")) {
                    assertThat(rows.next()).isTrue();
                    assertThat(rows.getInt("id")).isEqualTo(1);
                    assertThat(rows.getString("porton_configuration")).isNull();
                }
            }
        }
    }
}
