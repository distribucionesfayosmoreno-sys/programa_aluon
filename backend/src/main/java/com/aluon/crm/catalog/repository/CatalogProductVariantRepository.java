package com.aluon.crm.catalog.repository;

import com.aluon.crm.catalog.model.CatalogDoorProduct;
import com.aluon.crm.catalog.model.CatalogProductVariant;
import com.aluon.production.cutlist.model.DoorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CatalogProductVariantRepository extends JpaRepository<CatalogProductVariant, UUID> {
    List<CatalogProductVariant> findAllByPuertaOrderByVarianteAsc(CatalogDoorProduct puerta);

    Optional<CatalogProductVariant> findByPuertaAndVariante(CatalogDoorProduct puerta, DoorType variante);

    boolean existsByPuertaId(UUID puertaId);

    @Query("""
            select v
            from CatalogProductVariant v
            join fetch v.puerta p
            join fetch p.modelo m
            where m.id = :familyId
            order by v.orden asc, v.nombre asc
            """)
    List<CatalogProductVariant> findAllByFamilyId(UUID familyId);

    @Query("""
            select v
            from CatalogProductVariant v
            join fetch v.puerta p
            join fetch p.modelo m
            where m.id = :familyId
              and m.activo = true
              and v.activo = true
            order by v.orden asc, v.nombre asc
            """)
    List<CatalogProductVariant> findActiveByFamilyId(UUID familyId);
}
