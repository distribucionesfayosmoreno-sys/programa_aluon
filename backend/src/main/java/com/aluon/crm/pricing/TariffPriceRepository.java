package com.aluon.crm.pricing;

import com.aluon.production.cutlist.DoorModel;
import com.aluon.production.cutlist.DoorType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TariffPriceRepository extends JpaRepository<TariffPrice, UUID> {
    Optional<TariffPrice> findByTariffAndDoorModelAndDoorType(Tariff tariff, DoorModel doorModel, DoorType doorType);
}
