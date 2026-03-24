package com.aluon.crm.pricing;

import com.aluon.production.cutlist.DoorModel;
import com.aluon.production.cutlist.DoorType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TariffService {

    private final TariffRepository tariffRepository;
    private final TariffPriceRepository tariffPriceRepository;

    public Tariff getDefaultTariff() {
        return tariffRepository.findByDefaultTariffTrue()
                .orElseThrow(() -> new IllegalArgumentException("No hay tarifa por defecto configurada"));
    }

    public Tariff getTariffByCode(String code) {
        if (code == null || code.isBlank()) {
            return getDefaultTariff();
        }
        return tariffRepository.findByCodeIgnoreCase(code.trim())
                .orElseGet(this::getDefaultTariff);
    }

    public BigDecimal getPricePerM2(Tariff tariff, DoorModel doorModel, DoorType doorType) {
        return tariffPriceRepository.findByTariffAndDoorModelAndDoorType(tariff, doorModel, doorType)
                .map(TariffPrice::getPricePerM2)
                .orElseThrow(() -> new IllegalArgumentException("No hay precio configurado para el modelo " + doorModel + " y tipo " + doorType));
    }
}
