package com.aluon.crm.customer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import com.aluon.crm.customer.model.Customer;


public interface CustomerRepository extends JpaRepository<Customer, UUID> {
}
