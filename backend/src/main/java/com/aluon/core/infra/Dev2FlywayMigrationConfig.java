package com.aluon.core.infra;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationVersion;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile("dev2")
public class Dev2FlywayMigrationConfig {

    @Bean
    public FlywayMigrationStrategy dev2FlywayMigrationStrategy(DataSource dataSource) {
        return flyway -> {
            Flyway configured = Flyway.configure()
                    .dataSource(dataSource)
                    .locations("classpath:db/migration")
                    .baselineOnMigrate(true)
                    .baselineVersion(MigrationVersion.fromVersion("0"))
                    .load();

            configured.repair();
            configured.migrate();
        };
    }
}
