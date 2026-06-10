package com.aluon.crm.catalog.repository;

import com.aluon.crm.catalog.model.CatalogProductModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CatalogProductModelRepository extends JpaRepository<CatalogProductModel, UUID> {
    List<CatalogProductModel> findAllByOrderByModeloAsc();

    List<CatalogProductModel> findAllByActivoTrueOrderByOrdenAscNombreAsc();

    List<CatalogProductModel> findAllByOrderByOrdenAscNombreAsc();

    Optional<CatalogProductModel> findByModeloIgnoreCase(String modelo);
}
