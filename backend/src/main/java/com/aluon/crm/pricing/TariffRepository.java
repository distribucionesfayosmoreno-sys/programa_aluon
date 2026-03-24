package com.aluon.crm.pricing;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TariffRepository extends JpaRepository<Tariff, UUID> {
    Optional<Tariff> findByDefaultTariffTrue();
    Optional<Tariff> findByCodeIgnoreCase(String code);
}
