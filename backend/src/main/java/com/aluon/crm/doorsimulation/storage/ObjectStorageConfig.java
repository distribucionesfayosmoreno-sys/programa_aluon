package com.aluon.crm.doorsimulation.storage;

import com.aluon.crm.doorsimulation.config.ObjectStorageProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
@ConditionalOnProperty(prefix = "integrations.door-simulation.google-street-view", name = "enabled", havingValue = "true")
public class ObjectStorageConfig {

    @Bean
    @ConditionalOnProperty(prefix = "integrations.door-simulation.object-storage", name = "enabled", havingValue = "true")
    S3Client doorSimulationS3Client(ObjectStorageProperties props) {
        assertConfigured(props);

        var builder = S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(props.accessKey(), props.secretKey())
                ))
                .region(Region.of(props.region()))
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build());

        if (StringUtils.hasText(props.endpoint())) {
            builder = builder.endpointOverride(URI.create(props.endpoint()));
        }
        return builder.build();
    }

    private static void assertConfigured(ObjectStorageProperties props) {
        if (!StringUtils.hasText(props.bucket())) throw new IllegalArgumentException("Object storage no configurado: falta bucket");
        if (!StringUtils.hasText(props.accessKey())) throw new IllegalArgumentException("Object storage no configurado: falta accessKey");
        if (!StringUtils.hasText(props.secretKey())) throw new IllegalArgumentException("Object storage no configurado: falta secretKey");
        if (!StringUtils.hasText(props.region())) throw new IllegalArgumentException("Object storage no configurado: falta region");
    }
}
