package com.aluon.crm.catalog.repository;

import com.aluon.crm.catalog.model.CatalogDoorProduct;
import com.aluon.crm.catalog.model.CatalogProductModel;
import com.aluon.crm.catalog.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CatalogDoorProductRepository extends JpaRepository<CatalogDoorProduct, UUID> {
    List<CatalogDoorProduct> findAllByModeloOrderByProductoAsc(CatalogProductModel modelo);

    Optional<CatalogDoorProduct> findByModeloIdAndProducto(UUID modeloId, ProductCategory producto);
}
