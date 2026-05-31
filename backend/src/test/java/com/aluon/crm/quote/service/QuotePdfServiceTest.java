package com.aluon.crm.quote.service;

import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteChannel;
import com.aluon.crm.quote.model.QuoteItem;
import com.aluon.crm.quote.model.QuoteStatus;
import com.aluon.crm.quote.model.QuoteValidationMode;
import com.aluon.crm.quote.render.QuoteHtmlRenderer;
import com.aluon.crm.quote.render.QuoteTemplateProperties;
import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class QuotePdfServiceTest {

    @Test
    void rendersPdfFromHtmlTemplate() {
        QuoteTemplateProperties props = new QuoteTemplateProperties(
                "#2563eb",
                "ALUON",
                "CERRAJERÍA",
                BigDecimal.ZERO,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
        QuoteHtmlRenderer renderer = new QuoteHtmlRenderer(props);
        QuotePdfService service = new QuotePdfService(renderer);

        Customer customer = Customer.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .nombreComercial("Cliente Demo")
                .email("demo@cliente.com")
                .telefono("600 000 000")
                .build();

        QuoteItem item = QuoteItem.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .doorModel(DoorModel.CLASSIC)
                .doorType(DoorType.PEATONAL)
                .widthMm(1200)
                .heightMm(2000)
                .unidades(1)
                .m2(new BigDecimal("2.40"))
                .pricePerM2(new BigDecimal("100.00"))
                .lineTotal(new BigDecimal("240.00"))
                .build();

        QuoteRequest quote = QuoteRequest.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .quoteNumber("P-0001")
                .customer(customer)
                .contactEmail(customer.getEmail())
                .contactWhatsapp(customer.getTelefono())
                .status(QuoteStatus.PENDIENTE_VALIDACION)
                .validationMode(QuoteValidationMode.MANUAL)
                .channel(QuoteChannel.EMAIL)
                .total(new BigDecimal("240.00"))
                .createdAt(LocalDateTime.now())
                .items(List.of(item))
                .build();

        byte[] pdf = service.renderQuotePdf(quote);
        assertThat(pdf).isNotNull();
        assertThat(pdf.length).isGreaterThan(200);
        assertThat(new String(pdf, 0, 4)).isEqualTo("%PDF");
    }
}
