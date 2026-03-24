package com.aluon.core.mail;

import com.aluon.core.signature.EmailSignatureService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
@ConditionalOnClass(JavaMailSender.class)
@ConditionalOnBean(JavaMailSender.class)
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;
    private final EmailTemplateService templateService;
    private final EmailSignatureService signatureService;

    @Value("${spring.mail.from:}")
    private String defaultFrom;

    public void sendTemplate(String templateKey, String to, Map<String, String> variables) {
        EmailTemplate template = templateService.getOrCreateTemplate(templateKey);

        String signatureHtml = signatureService.findLatestHtml();
        String subject = applyVariables(template.getSubject(), variables, signatureHtml);
        String bodyHtml = applyVariables(template.getBodyHtml(), variables, signatureHtml);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            if (defaultFrom != null && !defaultFrom.isBlank()) {
                helper.setFrom(defaultFrom);
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(bodyHtml, true);
            mailSender.send(message);
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
