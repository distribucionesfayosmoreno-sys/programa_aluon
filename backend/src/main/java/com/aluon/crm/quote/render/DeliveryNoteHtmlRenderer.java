package com.aluon.crm.quote.render;

import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.model.DeliveryAddress;
import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.model.QuoteItem;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Component
public final class DeliveryNoteHtmlRenderer {

    private static final String TEMPLATE_PATH = "templates/quote/delivery-note-pixelperfect.html";
    private static final String STYLES_PATH = "templates/quote/delivery-note-pixelperfect.css";
    private static final Locale LOCALE_ES = new Locale("es", "ES");

    private final QuoteTemplateProperties props;
    private final MoneyFormatter money = new MoneyFormatter();

    public DeliveryNoteHtmlRenderer(QuoteTemplateProperties props) {
        this.props = Objects.requireNonNull(props, "props");
    }

    public String render(QuoteRequest quoteRequest, String docNumber) {
        QuoteRequest quote = Objects.requireNonNull(quoteRequest, "quoteRequest");
        String template = loadTemplate().replace("<!--__STYLES__-->", "<style>" + loadStyles() + "</style>");
        String number = docNumber == null || docNumber.isBlank() ? quote.getQuoteNumber() : docNumber.trim();
        Customer customer = quote.getCustomer();
        DeliveryAddress deliveryAddress = resolveDeliveryAddress(customer);
        String createdAtLong = quote.getCreatedAt() != null ? formatLongDate(quote.getCreatedAt().toLocalDate()) : "";
        List<QuoteItem> items = quote.getItems() == null ? List.of() : quote.getItems();
        BigDecimal subtotal = sumLineTotals(items);
        BigDecimal vatRate = props.vatRate().max(BigDecimal.ZERO);
        BigDecimal vatAmount = subtotal.multiply(vatRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(vatAmount);

        return template
                .replace("__COMPANY_NAME__", HtmlEscaper.escape(props.companyLegalName()))
                .replace("__COMPANY_TAGLINE__", HtmlEscaper.escape(props.tagline()))
                .replace("__COMPANY_LINES__", HtmlEscaper.escape(String.join("\n", props.companyAddressLines())))
                .replace("__HERO_BRAND__", HtmlEscaper.escape(props.brandName()))
                .replace("__HERO_TAGLINE__", HtmlEscaper.escape(props.tagline()))
                .replace("__DOC_TYPE__", HtmlEscaper.escape("ALBARÁN"))
                .replace("__DOC_NUMBER__", HtmlEscaper.escape(number))
                .replace("__DOC_DATE_LONG__", HtmlEscaper.escape(createdAtLong))
                .replace("__CUSTOMER_BLOCK__", HtmlEscaper.escape(renderCustomerBlock(quote, customer)))
                .replace("__DELIVERY_BLOCK__", HtmlEscaper.escape(renderDeliveryBlock(deliveryAddress, customer)))
                .replace("<!--__ITEM_ROWS__-->", buildRowsHtml(items))
                .replace("__SUBTOTAL__", HtmlEscaper.escape(money.formatEur(subtotal)))
                .replace("__VAT__", HtmlEscaper.escape(money.formatEur(vatAmount)))
                .replace("__TOTAL__", HtmlEscaper.escape(money.formatEur(total)))
                .replace("__TERMS__", HtmlEscaper.escape(String.join("\n", props.termsLines())))
                .replace("__SIGNATURE_LEFT_LABEL__", HtmlEscaper.escape(props.signatureLeftLabel()))
                .replace("__SIGNATURE_RIGHT_LABEL__", HtmlEscaper.escape(props.signatureRightLabel()));
    }

    private String buildRowsHtml(List<QuoteItem> items) {
        List<QuoteItem> safeItems = items == null ? List.of() : items;
        StringBuilder out = new StringBuilder(Math.max(1, safeItems.size()) * 240);
        for (QuoteItem item : safeItems) {
            String quantity = formatQuantity(item);
            String unitPrice = money.formatEur(item == null ? null : item.getPricePerM2());
            String lineTotal = money.formatEur(item == null ? null : item.getLineTotal());
            out.append("<tr>")
                    .append("<td class=\"qty\">").append(HtmlEscaper.escape(quantity)).append("</td>")
                    .append("<td class=\"desc\">")
                    .append("<div class=\"itemTitle\">").append(HtmlEscaper.escape(buildTitle(item))).append("</div>");

            String meta = buildItemMeta(item);
            if (!meta.isBlank()) {
                out.append("<div class=\"itemMeta\">").append(HtmlEscaper.escape(meta)).append("</div>");
            }

            out.append("</td>")
                    .append("<td class=\"unit\">").append(HtmlEscaper.escape(unitPrice)).append("</td>")
                    .append("<td class=\"total\">").append(HtmlEscaper.escape(lineTotal)).append("</td>")
                    .append("</tr>");
        }

        if (safeItems.isEmpty()) {
            out.append("<tr>")
                    .append("<td class=\"qty\">-</td>")
                    .append("<td class=\"desc\"><div class=\"itemTitle\">Sin líneas</div></td>")
                    .append("<td class=\"unit\">-</td>")
                    .append("<td class=\"total\">-</td>")
                    .append("</tr>");
        }

        return out.toString();
    }

    private String formatQuantity(QuoteItem item) {
        if (item == null) {
            return "0,00";
        }
        BigDecimal quantity = item.getM2() != null
                ? item.getM2()
                : BigDecimal.valueOf(item.getUnidades() == null ? 0 : item.getUnidades());
        return quantity.setScale(2, RoundingMode.HALF_UP).toPlainString().replace('.', ',');
    }

    private String buildTitle(QuoteItem item) {
        if (item == null) return "";
        String model = item.getDoorModel() == null ? "" : humanizeEnum(item.getDoorModel().name());
        String type = item.getDoorType() == null ? "" : humanizeEnum(item.getDoorType().name());
        return (model + (type.isBlank() ? "" : " " + type)).trim();
    }

    private String buildItemMeta(QuoteItem item) {
        if (item == null) return "";
        StringBuilder out = new StringBuilder(120);
        String category = item.getProductCategory() == null ? "" : humanizeEnum(item.getProductCategory().name());
        String dims = item.getWidthMm() != null && item.getHeightMm() != null
                ? item.getWidthMm() + " x " + item.getHeightMm() + " mm"
                : "";

        appendMeta(out, "Categoría", category);
        appendMeta(out, "Medidas", dims);
        appendMeta(out, "Color", item.getColorCode());
        if (Boolean.TRUE.equals(item.getPrimerRequired())) appendMeta(out, "Imprimación", "Sí");
        if (Boolean.TRUE.equals(item.getLarguero())) appendMeta(out, "Larguero", "Sí");
        if (Boolean.TRUE.equals(item.getMarcoSuperior())) appendMeta(out, "Marco superior", "Sí");
        if (Boolean.TRUE.equals(item.getBisagras())) appendMeta(out, "Bisagras", "Sí");
        if (Boolean.TRUE.equals(item.getPorteroAutomatico())) appendMeta(out, "Portero automático", "Sí");
        if (item.getFloorClearanceMm() != null) appendMeta(out, "Holgura", item.getFloorClearanceMm() + " mm");
        return out.toString().trim();
    }

    private void appendMeta(StringBuilder out, String label, String value) {
        if (value == null || value.isBlank()) return;
        if (out.length() > 0) out.append(" · ");
        out.append(label).append(": ").append(value.trim());
    }

    private String renderCustomerBlock(QuoteRequest quote, Customer customer) {
        if (quote == null || customer == null) return "";
        StringBuilder out = new StringBuilder(240);
        String customerName = customer.getNombreComercial() != null && !customer.getNombreComercial().isBlank()
                ? customer.getNombreComercial()
                : customer.getRazonSocial();

        appendLine(out, customerName);
        appendLine(out, formatDocument(customer));
        appendLine(out, nullToEmpty(customer.getDireccion()));
        appendLine(out, formatCityLine(customer.getCp(), customer.getPoblacion(), customer.getProvincia()));

        String phone = quote.getContactWhatsapp() != null && !quote.getContactWhatsapp().isBlank()
                ? quote.getContactWhatsapp()
                : customer.getTelefono();
        appendLine(out, phone == null ? "" : "TELF.: " + phone.trim());

        String email = quote.getContactEmail() != null && !quote.getContactEmail().isBlank()
                ? quote.getContactEmail()
                : customer.getEmail();
        appendLine(out, email);

        return out.toString().trim();
    }

    private String renderDeliveryBlock(DeliveryAddress deliveryAddress, Customer customer) {
        if (deliveryAddress == null && customer == null) return "";
        StringBuilder out = new StringBuilder(240);

        if (deliveryAddress != null) {
            appendLine(out, deliveryAddress.getNombreAlias());
            appendLine(out, nullToEmpty(deliveryAddress.getDireccion()));
            appendLine(out, formatCityLine(deliveryAddress.getCp(), deliveryAddress.getPoblacion(), deliveryAddress.getProvincia()));
            appendLine(out, deliveryAddress.getContacto());
            appendLine(out, deliveryAddress.getTelefono());
            return out.toString().trim();
        }

        appendLine(out, customer.getNombreComercial());
        appendLine(out, nullToEmpty(customer.getDireccion()));
        appendLine(out, formatCityLine(customer.getCp(), customer.getPoblacion(), customer.getProvincia()));
        appendLine(out, customer.getTelefono());
        return out.toString().trim();
    }

    private DeliveryAddress resolveDeliveryAddress(Customer customer) {
        if (customer == null || customer.getDireccionesEntrega() == null || customer.getDireccionesEntrega().isEmpty()) {
            return null;
        }
        return customer.getDireccionesEntrega().get(0);
    }

    private void appendLine(StringBuilder out, String value) {
        String text = value == null ? "" : value.trim();
        if (text.isBlank()) return;
        if (out.length() > 0) out.append('\n');
        out.append(text);
    }

    private String formatCityLine(String cp, String population, String province) {
        StringBuilder out = new StringBuilder(80);
        if (cp != null && !cp.isBlank()) out.append(cp.trim());
        if (population != null && !population.isBlank()) {
            if (!out.isEmpty()) out.append(' ');
            out.append(population.trim());
        }
        if (province != null && !province.isBlank()) {
            if (!out.isEmpty()) out.append(' ');
            out.append('(').append(province.trim()).append(')');
        }
        return out.toString();
    }

    private String formatDocument(Customer customer) {
        if (customer == null || customer.getTipoDocumento() == null) return "";
        String number = customer.getNumeroDocumento() == null ? "" : customer.getNumeroDocumento().trim();
        if (number.isBlank()) return customer.getTipoDocumento().name();
        return customer.getTipoDocumento().name() + ": " + number;
    }

    private String humanizeEnum(String raw) {
        if (raw == null) return "";
        String value = raw.trim();
        if (value.isBlank()) return "";
        return value.replace('_', ' ').toLowerCase(LOCALE_ES);
    }

    private String formatLongDate(LocalDate date) {
        if (date == null) return "";
        String day = String.format("%02d", date.getDayOfMonth());
        String month = date.getMonth().getDisplayName(TextStyle.FULL, LOCALE_ES).toUpperCase(LOCALE_ES);
        return day + " DE " + month + " DE " + date.getYear();
    }

    private BigDecimal sumLineTotals(List<QuoteItem> items) {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (QuoteItem item : items) {
            if (item == null || item.getLineTotal() == null) continue;
            subtotal = subtotal.add(item.getLineTotal());
        }
        return subtotal.setScale(2, RoundingMode.HALF_UP);
    }

    private String loadTemplate() {
        return loadClasspathText(TEMPLATE_PATH);
    }

    private String loadStyles() {
        return loadClasspathText(STYLES_PATH);
    }

    private String loadClasspathText(String path) {
        try (var in = new org.springframework.core.io.ClassPathResource(path).getInputStream()) {
            return new String(in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        } catch (java.io.IOException ex) {
            throw new IllegalStateException("No se pudo cargar el recurso HTML/CSS del albarán", ex);
        }
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
