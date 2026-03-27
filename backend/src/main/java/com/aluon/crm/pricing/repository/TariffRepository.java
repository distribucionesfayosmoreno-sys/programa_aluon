package com.aluon.crm.pricing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import com.aluon.crm.pricing.model.Tariff;


public interface TariffRepository extends JpaRepository<Tariff, UUID> {
    Optional<Tariff> findByDefaultTariffTrue();
    Optional<Tariff> findByCodeIgnoreCase(String code);
}
