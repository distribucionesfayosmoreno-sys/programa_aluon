package com.aluon.crm.quote.render;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteItem;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Base64;
import java.util.Locale;
import java.util.List;
import java.util.Objects;

@Component
public final class QuoteHtmlRenderer {

    private static final String TEMPLATE_PATH = "templates/quote/quote-pixelperfect.html";
    private static final String LOGO_PATH = "static/aluon-logo.png";
    private static final Locale LOCALE_ES = new Locale("es", "ES");

    private final QuoteTemplateProperties props;
    private final MoneyFormatter money = new MoneyFormatter();

    public QuoteHtmlRenderer(QuoteTemplateProperties props) {
        this.props = Objects.requireNonNull(props, "props");
    }

    public String render(QuoteRequest quoteRequest) {
        QuoteRequest quote = Objects.requireNonNull(quoteRequest, "quoteRequest");
        String template = loadTemplate();

        String customerName = quote.getCustomer() != null
                ? (quote.getCustomer().getNombreComercial() != null
                        && !quote.getCustomer().getNombreComercial().isBlank()
                                ? quote.getCustomer().getNombreComercial()
                                : quote.getCustomer().getRazonSocial())
                : "";

        String createdAtLong = quote.getCreatedAt() != null ? formatLongDate(quote.getCreatedAt().toLocalDate()) : "";
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
                .replace("__LOGO_DATA_URI__", HtmlEscaper.escape(loadLogoDataUri()))
                .replace("__CUSTOMER_BLOCK__", HtmlEscaper.escape(renderCustomerBlock(quote, customerName)))
                .replace("__DOC_DATE_LONG__", HtmlEscaper.escape(createdAtLong))
                .replace("__DOC_NUMBER__", HtmlEscaper.escape(quote.getQuoteNumber()))
                .replace("<!--__ITEM_ROWS__-->", rowsHtml)
                .replace("__SUBTOTAL__", HtmlEscaper.escape(money.formatEur(subtotal)))
                .replace("__VAT__", HtmlEscaper.escape(money.formatEur(vatAmount)))
                .replace("__TOTAL__", HtmlEscaper.escape(money.formatEur(total)));
    }

    private String renderRows(List<QuoteItem> items) {
        StringBuilder out = new StringBuilder(items.size() * 240);
        for (QuoteItem item : items) {
            String descriptionHtml = buildItemDescriptionHtml(item);
            String unitPrice = money.formatEur(item.getPricePerM2());
            String qty = item.getM2() != null
                    ? item.getM2().setScale(2, RoundingMode.HALF_UP).toPlainString()
                    : "-";
            String total = money.formatEur(item.getLineTotal());

            out.append("<tr>")
                    .append("<td class=\"col-qty\">").append(HtmlEscaper.escape(qty)).append("</td>")
                    .append("<td class=\"col-desc\">").append(descriptionHtml).append("</td>")
                    .append("<td class=\"col-unit\">").append(HtmlEscaper.escape(unitPrice)).append("</td>")
                    .append("<td class=\"col-total\">").append(HtmlEscaper.escape(total)).append("</td>")
                    .append("</tr>");
        }
        if (items.isEmpty()) {
            out.append("<tr>")
                    .append("<td class=\"col-qty\">-</td>")
                    .append("<td class=\"col-desc\">Sin líneas</td>")
                    .append("<td class=\"col-unit\">-</td>")
                    .append("<td class=\"col-total\">-</td>")
                    .append("</tr>");
        }
        return out.toString();
    }

    private String buildItemDescriptionHtml(QuoteItem item) {
        if (item == null)
            return "";
        String model = item.getDoorModel() != null ? humanizeEnum(item.getDoorModel().name()) : "";
        String type = item.getDoorType() != null ? humanizeEnum(item.getDoorType().name()) : "";
        String dims = (item.getWidthMm() != null && item.getHeightMm() != null)
                ? (item.getWidthMm() + "x" + item.getHeightMm() + " mm")
                : "";
        String category = item.getProductCategory() != null ? humanizeEnum(item.getProductCategory().name()) : "";
        String title = (model + (type.isBlank() ? "" : (" " + type))).trim();
        StringBuilder html = new StringBuilder(240);
        html.append("<div class=\"itemDescTitle\">").append(HtmlEscaper.escape(title)).append("</div>");
        String meta = buildItemMeta(category, dims, item.getUnidades(), item.getM2());
        if (!meta.isBlank()) {
            html.append("<div class=\"itemDescMeta\">").append(HtmlEscaper.escape(meta)).append("</div>");
        }
        if (!category.isBlank()) {
            // already included in meta
        }
        if (!dims.isBlank()) {
            // already included in meta
        }
        return html.toString();
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

    private String loadLogoDataUri() {
        try {
            ClassPathResource resource = new ClassPathResource(LOGO_PATH);
            byte[] bytes = resource.getInputStream().readAllBytes();
            if (bytes.length == 0)
                return "";
            String b64 = Base64.getEncoder().encodeToString(bytes);
            return "data:image/png;base64," + b64;
        } catch (IOException ex) {
            return "";
        }
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private String renderCustomerBlock(QuoteRequest quote, String customerName) {
        if (quote == null || quote.getCustomer() == null)
            return "";
        var customer = quote.getCustomer();
        StringBuilder out = new StringBuilder(240);

        if (!customerName.isBlank())
            out.append(customerName).append('\n');
        if (customer.getTipoDocumento() != null)
            out.append(customer.getTipoDocumento().name()).append('\n');

        String address = nullToEmpty(customer.getDireccion()).trim();
        if (!address.isBlank())
            out.append(address).append('\n');

        String cp = nullToEmpty(customer.getCp()).trim();
        String city = nullToEmpty(customer.getPoblacion()).trim();
        String prov = nullToEmpty(customer.getProvincia()).trim();
        String cityLine = joinNonBlank(" ", cp, city).trim();
        if (!prov.isBlank())
            cityLine = joinNonBlank(" ", cityLine, "(" + prov + ")").trim();
        if (!cityLine.isBlank())
            out.append(cityLine).append('\n');

        String phone = quote.getContactWhatsapp() != null ? quote.getContactWhatsapp() : customer.getTelefono();
        if (phone != null && !phone.isBlank())
            out.append("TELF.: ").append(phone.trim()).append('\n');

        String email = quote.getContactEmail() != null ? quote.getContactEmail() : customer.getEmail();
        if (email != null && !email.isBlank())
            out.append(email.trim());

        return out.toString().trim();
    }

    private String joinNonBlank(String sep, String a, String b) {
        String left = a == null ? "" : a.trim();
        String right = b == null ? "" : b.trim();
        if (left.isBlank())
            return right;
        if (right.isBlank())
            return left;
        return left + sep + right;
    }

    private String buildItemMeta(String category, String dims, Integer unidades, BigDecimal m2) {
        StringBuilder out = new StringBuilder(80);
        if (category != null && !category.isBlank())
            out.append("Referencia: ").append(category);
        if (m2 != null) {
            if (out.length() > 0)
                out.append('\n');
            out.append("m²: ").append(m2.setScale(2, RoundingMode.HALF_UP).toPlainString());
        }
        if (unidades != null && unidades > 0) {
            if (out.length() > 0)
                out.append('\n');
            out.append("Unidades: ").append(unidades);
        }
        if (dims != null && !dims.isBlank()) {
            if (out.length() > 0)
                out.append('\n');
            out.append("Medidas: ").append(dims);
        }
        return out.toString();
    }

    private String humanizeEnum(String raw) {
        if (raw == null)
            return "";
        String value = raw.trim();
        if (value.isBlank())
            return "";
        return value.replace('_', ' ').toLowerCase(LOCALE_ES);
    }

    private String formatLongDate(LocalDate date) {
        if (date == null)
            return "";
        String day = String.format("%02d", date.getDayOfMonth());
        String month = date.getMonth().getDisplayName(TextStyle.FULL, LOCALE_ES).toUpperCase(LOCALE_ES);
        String year = Integer.toString(date.getYear());
        return day + " DE " + month + " DE " + year;
    }
}
