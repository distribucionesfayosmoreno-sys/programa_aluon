package com.aluon.crm.catalog.repository;

import com.aluon.crm.catalog.model.CatalogDoorProduct;
import com.aluon.crm.catalog.model.CatalogProductModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CatalogDoorProductRepository extends JpaRepository<CatalogDoorProduct, UUID> {
    List<CatalogDoorProduct> findAllByModeloOrderByProductoAsc(CatalogProductModel modelo);
}

