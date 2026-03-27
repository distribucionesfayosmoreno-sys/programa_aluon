package com.aluon.crm.quote.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import com.aluon.crm.quote.model.QuoteItem;


public interface QuoteItemRepository extends JpaRepository<QuoteItem, UUID> {
}
