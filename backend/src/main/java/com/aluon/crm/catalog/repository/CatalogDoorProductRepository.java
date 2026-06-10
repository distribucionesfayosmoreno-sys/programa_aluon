package com.aluon.crm.catalog.repository;

import com.aluon.crm.catalog.model.CatalogDoorProduct;
import com.aluon.crm.catalog.model.CatalogProductModel;
import com.aluon.crm.catalog.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CatalogDoorProductRepository extends JpaRepository<CatalogDoorProduct, UUID> {
    List<CatalogDoorProduct> findAllByModeloOrderByProductoAsc(CatalogProductModel modelo);

    List<CatalogDoorProduct> findAllByModeloIdOrderByProductoAsc(UUID modeloId);

    @EntityGraph(attributePaths = "modelo")
    Optional<CatalogDoorProduct> findByModeloIdAndProducto(UUID modeloId, ProductCategory producto);

    Optional<CatalogDoorProduct> findByModeloIdAndProductoAndTenantId(UUID modeloId, ProductCategory producto, UUID tenantId);
}
