package com.aluon.crm.pricing.repository;

import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import com.aluon.crm.pricing.model.Tariff;
import com.aluon.crm.pricing.model.TariffPrice;


public interface TariffPriceRepository extends JpaRepository<TariffPrice, UUID> {
    Optional<TariffPrice> findByTariffAndDoorModelAndDoorType(Tariff tariff, DoorModel doorModel, DoorType doorType);
}
