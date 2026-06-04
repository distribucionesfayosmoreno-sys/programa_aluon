package com.aluon.crm.quote.service;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.render.DeliveryNoteHtmlRenderer;
import com.aluon.crm.quote.render.QuoteHtmlRenderer;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Objects;

@Service
@EnableConfigurationProperties(com.aluon.crm.quote.render.QuoteTemplateProperties.class)
public class QuotePdfService {

    private static final String DOCUMENT_TYPE_ALBARAN = "ALBARAN";

    private final QuoteHtmlRenderer htmlRenderer;
    private final DeliveryNoteHtmlRenderer deliveryNoteHtmlRenderer;

    public QuotePdfService(QuoteHtmlRenderer htmlRenderer, DeliveryNoteHtmlRenderer deliveryNoteHtmlRenderer) {
        this.htmlRenderer = Objects.requireNonNull(htmlRenderer, "htmlRenderer");
        this.deliveryNoteHtmlRenderer = Objects.requireNonNull(deliveryNoteHtmlRenderer, "deliveryNoteHtmlRenderer");
    }

    public byte[] renderQuotePdf(QuoteRequest quoteRequest) {
        return renderQuotePdf(quoteRequest, null, null);
    }

    public byte[] renderQuotePdf(QuoteRequest quoteRequest, String docType, String docNumber) {
        QuoteRequest quote = Objects.requireNonNull(quoteRequest, "quoteRequest");
        String type = docType == null ? "" : docType.trim().toUpperCase();
        String html = DOCUMENT_TYPE_ALBARAN.equals(type)
                ? deliveryNoteHtmlRenderer.render(quote, docNumber)
                : htmlRenderer.render(quote, docType, docNumber);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);
            builder.toStream(out);
            builder.useFastMode();
            builder.run();
            return out.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo generar el PDF del documento", ex);
        }
    }
}
