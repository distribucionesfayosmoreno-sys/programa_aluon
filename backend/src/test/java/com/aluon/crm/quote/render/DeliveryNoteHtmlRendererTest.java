package com.aluon.crm.quote.render;

import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.model.DeliveryAddress;
import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteChannel;
import com.aluon.crm.quote.model.QuoteItem;
import com.aluon.crm.quote.model.QuoteStatus;
import com.aluon.crm.quote.model.QuoteValidationMode;
import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class DeliveryNoteHtmlRendererTest {

    @Test
    void rendersCustomerAndDeliveryDataIntoTemplate() {
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
        DeliveryNoteHtmlRenderer renderer = new DeliveryNoteHtmlRenderer(props);

        Customer customer = Customer.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .nombreComercial("Cliente Demo")
                .razonSocial("Cliente Demo SL")
                .numeroDocumento("B12345678")
                .direccion("Calle Falsa 123")
                .cp("45001")
                .poblacion("Toledo")
                .provincia("Toledo")
                .telefono("600 000 000")
                .email("demo@cliente.com")
                .direccionesEntrega(List.of(
                        DeliveryAddress.builder()
                                .id(UUID.randomUUID())
                                .tenantId(UUID.randomUUID())
                                .nombreAlias("Obra principal")
                                .direccion("Pol. Ind. Demo, Nave 4")
                                .cp("45290")
                                .poblacion("Pantoja")
                                .provincia("Toledo")
                                .contacto("Juan Pérez")
                                .telefono("600 111 222")
                                .build()
                ))
                .build();

        QuoteItem item = QuoteItem.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .doorModel(DoorModel.CLASSIC)
                .doorType(DoorType.PEATONAL)
                .productCategory(null)
                .colorCode("#ffffff")
                .primerRequired(Boolean.TRUE)
                .widthMm(1200)
                .heightMm(2000)
                .unidades(2)
                .m2(new BigDecimal("2.40"))
                .pricePerM2(new BigDecimal("100.00"))
                .lineTotal(new BigDecimal("240.00"))
                .build();

        QuoteRequest quote = QuoteRequest.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .quoteNumber("P-0002")
                .customer(customer)
                .status(QuoteStatus.ENVIADO)
                .validationMode(QuoteValidationMode.MANUAL)
                .channel(QuoteChannel.EMAIL)
                .total(new BigDecimal("240.00"))
                .createdAt(LocalDateTime.of(2026, 6, 4, 10, 0))
                .items(List.of(item))
                .build();

        String html = renderer.render(quote, "ALB-20260604-0001");

        assertThat(html).contains("ALBARÁN");
        assertThat(html).contains("ALB-20260604-0001");
        assertThat(html).contains("Cliente Demo");
        assertThat(html).contains("Obra principal");
        assertThat(html).contains("Calle Falsa 123");
        assertThat(html).contains("Pol. Ind. Demo, Nave 4");
        assertThat(html).contains("classic peatonal");
    }
}
