package com.aluon.crm.customer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import com.aluon.crm.customer.model.Customer;
import java.util.List;
import java.util.Optional;


public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    List<Customer> findAllByActiveTrue();
    List<Customer> findAllByActiveTrueOrderByNombreComercialAsc();
    List<Customer> findByActiveTrueAndNombreComercialContainingIgnoreCaseOrderByNombreComercialAsc(String nombreComercial);
    Optional<Customer> findByIdAndActiveTrue(UUID id);
    Optional<Customer> findFirstByEmailIgnoreCaseAndActiveTrue(String email);
    boolean existsByNumeroDocumentoIgnoreCaseAndActiveTrue(String numeroDocumento);
    boolean existsByNumeroDocumentoIgnoreCaseAndIdNotAndActiveTrue(String numeroDocumento, UUID id);
}
