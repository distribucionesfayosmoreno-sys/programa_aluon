package com.aluon.crm.quote.render;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteItem;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Component
public final class QuoteHtmlRenderer {

    private static final String TEMPLATE_PATH = "templates/quote/quote-v1.html";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final QuoteTemplateProperties props;
    private final MoneyFormatter money = new MoneyFormatter();

    public QuoteHtmlRenderer(QuoteTemplateProperties props) {
        this.props = Objects.requireNonNull(props, "props");
    }

    public String render(QuoteRequest quoteRequest) {
        QuoteRequest quote = Objects.requireNonNull(quoteRequest, "quoteRequest");
        String template = loadTemplate();

        String customerName = quote.getCustomer() != null
                ? (quote.getCustomer().getNombreComercial() != null && !quote.getCustomer().getNombreComercial().isBlank()
                ? quote.getCustomer().getNombreComercial()
                : quote.getCustomer().getRazonSocial())
                : "";

        String createdAt = quote.getCreatedAt() != null ? quote.getCreatedAt().format(DATE_FORMAT) : "";
        List<QuoteItem> items = quote.getItems() == null ? List.of() : quote.getItems();

        BigDecimal subtotal = items.stream()
                .map(QuoteItem::getLineTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal vatRate = props.vatRate().max(BigDecimal.ZERO);
        BigDecimal vatAmount = subtotal.multiply(vatRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(vatAmount);

        String rowsHtml = renderRows(items);

        return template
                .replace("#2563eb", HtmlEscaper.escape(props.accentColor()))
                .replace("__BRAND_NAME__", HtmlEscaper.escape(props.brandName()))
                .replace("__TAGLINE__", HtmlEscaper.escape(props.tagline()))
                .replace("__DOC_TITLE__", "PRESUPUESTO")
                .replace("__QUOTE_NUMBER__", HtmlEscaper.escape(quote.getQuoteNumber()))
                .replace("__QUOTE_DATE__", HtmlEscaper.escape(createdAt))
                .replace("__CUSTOMER_NAME__", HtmlEscaper.escape(customerName))
                .replace("__CUSTOMER_EMAIL__", HtmlEscaper.escape(nullToEmpty(quote.getContactEmail())))
                .replace("__CUSTOMER_PHONE__", HtmlEscaper.escape(nullToEmpty(quote.getContactWhatsapp())))
                .replace("<!--__ITEM_ROWS__-->", rowsHtml)
                .replace("__SUBTOTAL__", HtmlEscaper.escape(money.formatEur(subtotal)))
                .replace("__VAT_LABEL__", HtmlEscaper.escape(vatRateLabel(vatRate)))
                .replace("__VAT_AMOUNT__", HtmlEscaper.escape(money.formatEur(vatAmount)))
                .replace("__TOTAL__", HtmlEscaper.escape(money.formatEur(total)));
    }

    private String renderRows(List<QuoteItem> items) {
        StringBuilder out = new StringBuilder(items.size() * 220);
        int rowNo = 1;
        for (QuoteItem item : items) {
            String description = buildItemDescription(item);
            String unitPrice = money.formatEur(item.getPricePerM2());
            String qty = item.getM2() != null ? item.getM2().setScale(2, RoundingMode.HALF_UP).toPlainString() : "-";
            String total = money.formatEur(item.getLineTotal());

            out.append("<tr>")
                    .append("<td class=\"cell cell-no\">").append(rowNo++).append("</td>")
                    .append("<td class=\"cell cell-desc\">").append(HtmlEscaper.escape(description)).append("</td>")
                    .append("<td class=\"cell cell-price\">").append(HtmlEscaper.escape(unitPrice)).append("</td>")
                    .append("<td class=\"cell cell-qty\">").append(HtmlEscaper.escape(qty)).append("</td>")
                    .append("<td class=\"cell cell-total\">").append(HtmlEscaper.escape(total)).append("</td>")
                    .append("</tr>");
        }
        if (items.isEmpty()) {
            out.append("<tr>")
                    .append("<td class=\"cell cell-no\">-</td>")
                    .append("<td class=\"cell cell-desc\">Sin líneas</td>")
                    .append("<td class=\"cell cell-price\">-</td>")
                    .append("<td class=\"cell cell-qty\">-</td>")
                    .append("<td class=\"cell cell-total\">-</td>")
                    .append("</tr>");
        }
        return out.toString();
    }

    private String buildItemDescription(QuoteItem item) {
        if (item == null) return "";
        String model = item.getDoorModel() != null ? item.getDoorModel().name() : "";
        String type = item.getDoorType() != null ? item.getDoorType().name() : "";
        String dims = (item.getWidthMm() != null && item.getHeightMm() != null)
                ? (item.getWidthMm() + "x" + item.getHeightMm() + " mm")
                : "";
        String category = item.getProductCategory() != null ? item.getProductCategory().name() : "";
        return (model + " / " + type + (dims.isBlank() ? "" : (" · " + dims)) + (category.isBlank() ? "" : (" · " + category))).trim();
    }

    private String vatRateLabel(BigDecimal vatRate) {
        if (vatRate == null || vatRate.compareTo(BigDecimal.ZERO) <= 0) return "IVA";
        BigDecimal percent = vatRate.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP);
        return "IVA (" + percent.toPlainString() + "%)";
    }

    private String loadTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource(TEMPLATE_PATH);
            byte[] bytes = resource.getInputStream().readAllBytes();
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo cargar la plantilla HTML del presupuesto", ex);
        }
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
