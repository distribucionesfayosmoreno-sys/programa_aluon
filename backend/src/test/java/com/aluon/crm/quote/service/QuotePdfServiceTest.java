package com.aluon.crm.quote.service;

import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.model.DeliveryAddress;
import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteChannel;
import com.aluon.crm.quote.model.QuoteItem;
import com.aluon.crm.quote.model.QuoteStatus;
import com.aluon.crm.quote.model.QuoteValidationMode;
import com.aluon.crm.quote.render.DeliveryNoteHtmlRenderer;
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
        DeliveryNoteHtmlRenderer deliveryRenderer = new DeliveryNoteHtmlRenderer(props);
        QuotePdfService service = new QuotePdfService(renderer, deliveryRenderer);

        Customer customer = Customer.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .nombreComercial("Cliente Demo")
                .direccion("Calle Falsa 123")
                .cp("45001")
                .poblacion("Toledo")
                .provincia("Toledo")
                .email("demo@cliente.com")
                .telefono("600 000 000")
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

    @Test
    void rendersDeliveryNotePdfFromDedicatedTemplate() {
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
        DeliveryNoteHtmlRenderer deliveryRenderer = new DeliveryNoteHtmlRenderer(props);
        QuotePdfService service = new QuotePdfService(renderer, deliveryRenderer);

        Customer customer = Customer.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .nombreComercial("Cliente Demo")
                .direccion("Calle Falsa 123")
                .cp("45001")
                .poblacion("Toledo")
                .provincia("Toledo")
                .telefono("600 000 000")
                .build();

        QuoteItem item = QuoteItem.builder()
                .id(UUID.randomUUID())
                .tenantId(UUID.randomUUID())
                .doorModel(DoorModel.CLASSIC)
                .doorType(DoorType.PEATONAL)
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
                .status(QuoteStatus.PENDIENTE_VALIDACION)
                .validationMode(QuoteValidationMode.MANUAL)
                .channel(QuoteChannel.EMAIL)
                .total(new BigDecimal("240.00"))
                .createdAt(LocalDateTime.now())
                .items(List.of(item))
                .build();

        byte[] pdf = service.renderQuotePdf(quote, "ALBARAN", "ALB-20260604-0001");
        assertThat(pdf).isNotNull();
        assertThat(pdf.length).isGreaterThan(200);
        assertThat(new String(pdf, 0, 4)).isEqualTo("%PDF");
    }
}
