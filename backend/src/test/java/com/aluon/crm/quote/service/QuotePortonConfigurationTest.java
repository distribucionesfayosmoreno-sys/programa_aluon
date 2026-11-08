package com.aluon.crm.quote.service;

import com.aluon.crm.catalog.porton.PortonConfiguration;
import com.aluon.crm.catalog.service.CatalogDoorPricingResult;
import com.aluon.crm.catalog.service.CatalogDoorPricingService;
import com.aluon.crm.catalog.model.ProductCategory;
import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.repository.CustomerRepository;
import com.aluon.crm.documents.model.DocumentSeries;
import com.aluon.crm.documents.service.DocumentNumberService;
import com.aluon.crm.quote.dto.*;
import com.aluon.crm.quote.model.*;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import com.aluon.production.cutlist.model.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class QuotePortonConfigurationTest {
    @ParameterizedTest @ValueSource(booleans = {true, false})
    void preservesConfigurationAndRequiresReviewOnlyForTechnicalReferences(boolean technical) {
        var quotes = mock(QuoteRequestRepository.class);
        var customers = mock(CustomerRepository.class);
        var prices = mock(CatalogDoorPricingService.class);
        var numbers = mock(DocumentNumberService.class);
        var service = new QuoteService(quotes, customers, prices, numbers);
        UUID customerId = UUID.randomUUID();
        when(customers.findById(customerId)).thenReturn(Optional.of(Customer.builder().id(customerId).tarifa("A").autoApproveQuotes(true).build()));
        when(numbers.nextSeries()).thenReturn(new DocumentSeries(LocalDate.of(2026, 11, 7), 1));
        when(prices.resolve(any(), any(), any(), anyString(), anyInt(), anyInt()))
                .thenReturn(new CatalogDoorPricingResult(new BigDecimal("6.0000"), new BigDecimal("100.00"), true));
        when(quotes.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        var item = new QuoteItemRequest();
        item.setDoorModel(DoorModel.CLASSIC);
        item.setDoorType(DoorType.CORREDERA);
        item.setProductCategory(ProductCategory.PUERTA_GARAJE);
        item.setWidthMm(3000);
        item.setHeightMm(2000);
        if (technical) item.setPortonConfiguration(new PortonConfiguration("TELESCOPICA", "M200", "HORIZONTAL", "RAL_7016_TM", null,
                true, true, false, "SUPERFICIE", "SOLAPADO"));
        var request = new QuoteCreateRequest();
        request.setCustomerId(customerId);
        request.setItems(List.of(item));
        var response = service.create(request);
        assertThat(response.getTotal()).isEqualByComparingTo("600.00");
        assertThat(response.getStatus()).isEqualTo(technical ? QuoteStatus.PENDIENTE_VALIDACION : QuoteStatus.ENVIADO);
        assertThat(response.getValidationMode()).isEqualTo(technical ? QuoteValidationMode.MANUAL : QuoteValidationMode.AUTO);
        assertThat(response.getItems().get(0).getPortonConfiguration()).isEqualTo(item.getPortonConfiguration());
        if (technical) assertThat(response.getItems().get(0).getPortonDescription()).contains("M200", "Fotocélula");
    }
}
