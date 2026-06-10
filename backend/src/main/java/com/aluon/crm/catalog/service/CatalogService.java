package com.aluon.crm.catalog.service;

import com.aluon.crm.catalog.dto.CatalogDoorProductResponse;
import com.aluon.crm.catalog.dto.CatalogFamilyChildResponse;
import com.aluon.crm.catalog.dto.CatalogFamilyResponse;
import com.aluon.crm.catalog.dto.CatalogProductModelResponse;
import com.aluon.crm.catalog.dto.CatalogProductVariantResponse;
import com.aluon.crm.catalog.model.CatalogDoorProduct;
import com.aluon.crm.catalog.model.CatalogProductModel;
import com.aluon.crm.catalog.model.CatalogProductVariant;
import com.aluon.crm.catalog.repository.CatalogDoorProductRepository;
import com.aluon.crm.catalog.repository.CatalogProductModelRepository;
import com.aluon.crm.catalog.repository.CatalogProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CatalogProductModelRepository modelRepository;
    private final CatalogDoorProductRepository doorProductRepository;
    private final CatalogProductVariantRepository variantRepository;

    @Transactional(readOnly = true)
    public List<CatalogFamilyResponse> listFamilies() {
        return modelRepository.findAllByActivoTrueOrderByOrdenAscNombreAsc()
                .stream()
                .map(model -> new CatalogFamilyResponse(
                        model.getId(),
                        model.getModelo(),
                        model.getNombre(),
                        model.getDescripcion(),
                        resolveImage(model.getImagenCard(), model.getImagenModelo())
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CatalogFamilyChildResponse> listFamilyChildren(UUID familyId) {
        UUID id = Objects.requireNonNull(familyId, "familyId");
        return variantRepository.findActiveByFamilyId(id)
                .stream()
                .map(this::toFamilyChildResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CatalogProductModelResponse> listModels() {
        return modelRepository.findAllByOrderByOrdenAscNombreAsc()
                .stream()
                .map(model -> new CatalogProductModelResponse(model.getId(), model.getModelo(), model.getImagenModelo()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CatalogDoorProductResponse> listDoorProducts(UUID modeloId) {
        UUID id = Objects.requireNonNull(modeloId, "modeloId");
        CatalogProductModel modelo = modelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Modelo no encontrado"));
        return doorProductRepository.findAllByModeloIdOrderByProductoAsc(modelo.getId())
                .stream()
                .map(puerta -> new CatalogDoorProductResponse(
                        puerta.getId(),
                        puerta.getModelo().getId(),
                        puerta.getProducto(),
                        puerta.getImagenModelo(),
                        puerta.getPrecioTarifaA(),
                        puerta.getPrecioTarifaB(),
                        puerta.getMetros2Minimo()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CatalogProductVariantResponse> listVariants(UUID puertaId) {
        UUID id = Objects.requireNonNull(puertaId, "puertaId");
        CatalogDoorProduct puerta = doorProductRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        return variantRepository.findAllByPuertaOrderByVarianteAsc(puerta)
                .stream()
                .map(variant -> new CatalogProductVariantResponse(
                        variant.getId(),
                        variant.getPuerta().getId(),
                        variant.getVariante(),
                        variant.getImagenVariante()
                ))
                .toList();
    }

    private CatalogFamilyChildResponse toFamilyChildResponse(CatalogProductVariant variant) {
        CatalogDoorProduct doorProduct = variant.getPuerta();
        CatalogProductModel family = doorProduct.getModelo();
        return new CatalogFamilyChildResponse(
                variant.getId(),
                family.getId(),
                doorProduct.getProducto(),
                variant.getVariante(),
                variant.getNombre(),
                variant.getDescripcion(),
                resolveImage(variant.getImagenCard(), variant.getImagenVariante())
        );
    }

    private String resolveImage(String cardImage, String legacyImage) {
        if (cardImage != null && !cardImage.isBlank()) {
            return cardImage;
        }
        return legacyImage;
    }
}
