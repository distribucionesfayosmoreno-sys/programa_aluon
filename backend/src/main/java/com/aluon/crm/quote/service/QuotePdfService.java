package com.aluon.crm.quote.service;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteItem;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Service
public class QuotePdfService {

    public byte[] renderQuotePdf(QuoteRequest quoteRequest) {
        QuoteRequest quote = Objects.requireNonNull(quoteRequest, "quoteRequest");
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
                PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

                float margin = 48f;
                float y = page.getMediaBox().getHeight() - margin;
                float x = margin;
                float leading = 14f;

                content.beginText();
                content.setFont(fontBold, 16);
                content.newLineAtOffset(x, y);
                content.showText("Presupuesto " + safe(quote.getQuoteNumber()));
                content.endText();

                y -= 28f;
                content.beginText();
                content.setFont(fontRegular, 10);
                content.newLineAtOffset(x, y);
                content.showText("Fecha: " + (quote.getCreatedAt() != null
                        ? quote.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                        : "-"));
                content.endText();

                y -= 18f;
                content.beginText();
                content.setFont(fontRegular, 10);
                content.newLineAtOffset(x, y);
                String customerName = quote.getCustomer() != null
                        ? (quote.getCustomer().getNombreComercial() != null
                        ? quote.getCustomer().getNombreComercial()
                        : quote.getCustomer().getRazonSocial())
                        : "-";
                content.showText("Cliente: " + safe(customerName));
                content.endText();

                y -= 26f;
                content.beginText();
                content.setFont(fontBold, 11);
                content.newLineAtOffset(x, y);
                content.showText("Líneas");
                content.endText();

                y -= 16f;
                List<QuoteItem> items = quote.getItems() == null ? List.of() : quote.getItems();
                for (QuoteItem item : items) {
                    if (y < margin + 60f) break;
                    content.beginText();
                    content.setFont(fontRegular, 9);
                    content.newLineAtOffset(x, y);
                    String line = safe(item.getDoorModel())
                            + " / " + safe(item.getDoorType())
                            + "  " + safe(item.getWidthMm()) + "x" + safe(item.getHeightMm()) + "mm"
                            + "  Total: " + (item.getLineTotal() != null ? item.getLineTotal().setScale(2, RoundingMode.HALF_UP) : "-");
                    content.showText(line);
                    content.endText();
                    y -= leading;
                }

                y -= 18f;
                content.beginText();
                content.setFont(fontBold, 12);
                content.newLineAtOffset(x, y);
                content.showText("TOTAL: " + (quote.getTotal() != null ? quote.getTotal().setScale(2, RoundingMode.HALF_UP) : "-") + " €");
                content.endText();
            }

            return toBytes(document);
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo generar el PDF del presupuesto", ex);
        }
    }

    private byte[] toBytes(PDDocument document) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.save(out);
        return out.toByteArray();
    }

    private String safe(Object value) {
        return value == null ? "-" : value.toString();
    }
}
