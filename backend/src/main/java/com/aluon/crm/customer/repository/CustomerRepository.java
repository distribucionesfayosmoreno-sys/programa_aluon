package com.aluon.crm.customer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import com.aluon.crm.customer.model.Customer;
import java.util.List;
import java.util.Optional;


public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    List<Customer> findAllByActiveTrue();
    Optional<Customer> findByIdAndActiveTrue(UUID id);
}
