package com.aluon.crm.catalog.service;

import com.aluon.crm.catalog.model.CatalogDoorProduct;
import com.aluon.crm.catalog.model.CatalogProductModel;
import com.aluon.crm.catalog.model.ProductCategory;
import com.aluon.crm.catalog.repository.CatalogDoorProductRepository;
import com.aluon.crm.catalog.repository.CatalogProductModelRepository;
import com.aluon.crm.customer.model.CustomerTariff;
import com.aluon.crm.pricing.model.Tariff;
import com.aluon.crm.pricing.model.TariffPrice;
import com.aluon.crm.pricing.repository.TariffPriceRepository;
import com.aluon.crm.pricing.repository.TariffRepository;
import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import lombok.RequiredArgsConstructor;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogDoorPricingService {

    private static final BigDecimal MM2_IN_M2 = BigDecimal.valueOf(1_000_000);

    private final CatalogProductModelRepository modelRepository;
    private final CatalogDoorProductRepository doorProductRepository;
    private final TariffRepository tariffRepository;
    private final TariffPriceRepository tariffPriceRepository;
    private final CurrentTenantIdentifierResolver<UUID> tenantResolver;

    public CatalogDoorPricingResult resolve(
            DoorModel doorModel,
            DoorType doorType,
            ProductCategory productCategory,
            String customerTariff,
            Integer widthMm,
            Integer heightMm
    ) {
        BigDecimal calculatedM2 = calculateM2(widthMm, heightMm);
        CatalogDoorProduct catalogProduct = resolveCatalogProduct(doorModel, productCategory);
        if (catalogProduct == null) {
            return fallbackToLegacyPricing(doorModel, doorType, customerTariff, calculatedM2);
        }

        BigDecimal catalogPrice = resolveCatalogPrice(catalogProduct, customerTariff);
        if (catalogPrice == null || catalogPrice.signum() <= 0) {
            return fallbackToLegacyPricing(doorModel, doorType, customerTariff, calculatedM2);
        }

        BigDecimal minM2 = catalogProduct.getMetros2Minimo();
        BigDecimal resolvedM2 = calculatedM2;
        if (minM2 != null && minM2.signum() > 0 && calculatedM2.compareTo(minM2) < 0) {
            resolvedM2 = minM2.setScale(4, RoundingMode.HALF_UP);
        }

        return new CatalogDoorPricingResult(
                resolvedM2,
                catalogPrice.setScale(2, RoundingMode.HALF_UP),
                true
        );
    }

    private CatalogDoorProduct resolveCatalogProduct(DoorModel doorModel, ProductCategory productCategory) {
        if (doorModel == null || productCategory == null) {
            return null;
        }

        CatalogProductModel model = modelRepository.findByModeloIgnoreCase(doorModel.name()).orElse(null);
        if (model == null) {
            return null;
        }

        UUID tenantId = resolveTenantId();
        return doorProductRepository.findByModeloIdAndProductoAndTenantId(model.getId(), productCategory, tenantId)
                .orElse(null);
    }

    private BigDecimal resolveCatalogPrice(CatalogDoorProduct catalogProduct, String customerTariff) {
        CustomerTariff tariff = CustomerTariff.fromRaw(customerTariff);
        return tariff == CustomerTariff.TARIFA_B
                ? catalogProduct.getPrecioTarifaB()
                : catalogProduct.getPrecioTarifaA();
    }

    private CatalogDoorPricingResult fallbackToLegacyPricing(DoorModel doorModel, DoorType doorType, String customerTariff, BigDecimal m2) {
        Tariff tariff = resolveTariff(customerTariff);
        BigDecimal pricePerM2 = tariffPriceRepository.findByTariffAndDoorModelAndDoorType(tariff, doorModel, doorType)
                .map(TariffPrice::getPricePerM2)
                .orElseThrow(() -> new IllegalArgumentException("No hay precio configurado para el modelo " + doorModel + " y tipo " + doorType));

        return new CatalogDoorPricingResult(
                m2,
                pricePerM2.setScale(2, RoundingMode.HALF_UP),
                false
        );
    }

    private Tariff resolveTariff(String customerTariff) {
        CustomerTariff tariff = CustomerTariff.fromRaw(customerTariff);
        return tariffRepository.findByCodeIgnoreCase(tariff.code())
                .orElseGet(() -> tariffRepository.findByDefaultTariffTrue()
                        .orElseThrow(() -> new IllegalArgumentException("No hay tarifa por defecto configurada")));
    }

    private BigDecimal calculateM2(Integer widthMm, Integer heightMm) {
        int safeWidth = Objects.requireNonNull(widthMm, "widthMm");
        int safeHeight = Objects.requireNonNull(heightMm, "heightMm");
        return BigDecimal.valueOf(safeWidth)
                .multiply(BigDecimal.valueOf(safeHeight))
                .divide(MM2_IN_M2, 4, RoundingMode.HALF_UP);
    }

    private UUID resolveTenantId() {
        return tenantResolver.resolveCurrentTenantIdentifier();
    }
}
