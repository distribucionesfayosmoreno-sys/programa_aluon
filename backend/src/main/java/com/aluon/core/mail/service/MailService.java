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
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Map;
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
        EmailTemplate template = templateService.getOrCreateTemplate(templateKey);

        String signatureHtml = signatureService.findLatestHtml();
        String subject = applyVariables(template.getSubject(), variables, signatureHtml);
        String bodyHtml = applyVariables(template.getBodyHtml(), variables, signatureHtml);

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            logger.warn("JavaMailSender no configurado. No se enviará email a {}.", to);
            return;
        }

        if (configuredPassword == null || configuredPassword.isBlank()) {
            logger.warn("SMTP sin contraseña configurada. Se omite el envío de email a {}.", to);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            String from = defaultFrom;
            if (from != null && !from.isBlank()) {
                helper.setFrom(from);
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(bodyHtml, true);
            mailSender.send(message);
        } catch (MailException ex) {
            logger.error("Error enviando email a {} (MailException). Se continúa sin bloquear el flujo.", to, ex);
        } catch (MessagingException ex) {
            logger.error("Error enviando email a {}", to, ex);
        }
    }

    private String applyVariables(String template, Map<String, String> variables, String signatureHtml) {
        String result = template;
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
