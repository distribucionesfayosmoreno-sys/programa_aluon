package com.aluon.crm.catalog.repository;

import com.aluon.crm.catalog.model.CatalogDoorProduct;
import com.aluon.crm.catalog.model.CatalogProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CatalogProductVariantRepository extends JpaRepository<CatalogProductVariant, UUID> {
    List<CatalogProductVariant> findAllByPuertaOrderByVarianteAsc(CatalogDoorProduct puerta);
}

