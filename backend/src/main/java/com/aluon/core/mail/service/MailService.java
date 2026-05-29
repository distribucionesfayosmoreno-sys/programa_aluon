package com.aluon.core.mail.service;

import com.aluon.core.signature.service.EmailSignatureService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Objects;
import com.aluon.core.mail.model.EmailTemplate;


@Service
@RequiredArgsConstructor
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final EmailTemplateService templateService;
    private final EmailSignatureService signatureService;

    @Value("${spring.mail.from:}")
    private String defaultFrom;

    @Value("${spring.mail.username:}")
    private String configuredUsername;

    @Value("${spring.mail.password:}")
    private String configuredPassword;

    public void sendTemplate(String templateKey, String to, Map<String, String> variables) {
        EmailTemplate template = Objects.requireNonNull(templateService.getOrCreateTemplate(templateKey), "template");

        String signatureHtml = signatureService.findLatestHtml();
        String subject = applyVariables(template.getSubject(), variables, signatureHtml);
        String bodyHtml = applyVariables(template.getBodyHtml(), variables, signatureHtml);

        String safeTo = Objects.requireNonNull(to, "to");
        String safeSubject = Objects.requireNonNull(subject, "subject");
        String safeBodyHtml = Objects.requireNonNull(bodyHtml, "bodyHtml");

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            logger.warn("JavaMailSender no configurado. No se enviará email a {}.", safeTo);
            return;
        }

        if (configuredPassword == null || configuredPassword.isBlank()) {
            logger.warn("SMTP sin contraseña configurada. Se omite el envío de email a {}.", safeTo);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            String from = defaultFrom;
            if (from != null && !from.isBlank()) {
                helper.setFrom(from);
            }
            helper.setTo(safeTo);
            helper.setSubject(safeSubject);
            helper.setText(safeBodyHtml, true);
            mailSender.send(message);
        } catch (MailException ex) {
            logger.error("Error enviando email a {} (MailException). Se continúa sin bloquear el flujo.", safeTo, ex);
        } catch (MessagingException ex) {
            logger.error("Error enviando email a {}", safeTo, ex);
        }
    }

    public void sendHtmlWithAttachment(String to, String subject, String htmlBody, String attachmentFileName, byte[] attachmentBytes) {
        String safeTo = Objects.requireNonNull(to, "to");
        String safeSubject = Objects.requireNonNull(subject, "subject");
        String safeHtmlBody = Objects.requireNonNull(htmlBody, "htmlBody");
        String safeAttachmentFileName = Objects.requireNonNull(attachmentFileName, "attachmentFileName");
        byte[] safeAttachmentBytes = Objects.requireNonNull(attachmentBytes, "attachmentBytes");

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            logger.warn("JavaMailSender no configurado. No se enviará email a {}.", safeTo);
            return;
        }

        if (configuredPassword == null || configuredPassword.isBlank()) {
            logger.warn("SMTP sin contraseña configurada. Se omite el envío de email a {}.", safeTo);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            String from = defaultFrom;
            if (from != null && !from.isBlank()) {
                helper.setFrom(from);
            }
            helper.setTo(safeTo);
            helper.setSubject(safeSubject);
            helper.setText(safeHtmlBody, true);
            helper.addAttachment(safeAttachmentFileName, new ByteArrayResource(safeAttachmentBytes));
            mailSender.send(message);
        } catch (MailException ex) {
            logger.error("Error enviando email a {} (MailException). Se continúa sin bloquear el flujo.", safeTo, ex);
        } catch (MessagingException ex) {
            logger.error("Error enviando email a {}", safeTo, ex);
        }
    }

    private String applyVariables(String template, Map<String, String> variables, String signatureHtml) {
        String result = template == null ? "" : template;
        if (variables != null) {
            for (Map.Entry<String, String> entry : variables.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue() == null ? "" : entry.getValue();
                result = result.replace("{{" + key + "}}", value);
            }
        }
        result = result.replace("{{signatureHtml}}", signatureHtml == null ? "" : signatureHtml);
        return result;
    }
}
