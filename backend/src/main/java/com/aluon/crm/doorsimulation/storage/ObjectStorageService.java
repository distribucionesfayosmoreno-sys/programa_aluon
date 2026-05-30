package com.aluon.crm.doorsimulation.storage;

import com.aluon.crm.doorsimulation.config.ObjectStorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "integrations.door-simulation.google-street-view", name = "enabled", havingValue = "true")
public class ObjectStorageService {

    private final ObjectStorageProperties props;
    private final S3Client s3;

    public String putPng(byte[] bytes, String keyPrefix) {
        return put(bytes, "image/png", keyPrefix, "png");
    }

    public String putJpeg(byte[] bytes, String keyPrefix) {
        return put(bytes, "image/jpeg", keyPrefix, "jpg");
    }

    public String put(byte[] bytes, String contentType, String keyPrefix, String extension) {
        assertEnabledAndConfigured();
        if (bytes == null || bytes.length == 0) throw new IllegalArgumentException("No hay datos para subir");
        if (!StringUtils.hasText(contentType)) throw new IllegalArgumentException("contentType es obligatorio");
        if (!StringUtils.hasText(extension)) throw new IllegalArgumentException("extension es obligatoria");

        String safePrefix = StringUtils.hasText(keyPrefix) ? keyPrefix.replaceAll("/+$", "") : "door-simulation";
        String key = safePrefix + "/" + UUID.randomUUID() + "." + extension;

        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(props.bucket())
                .key(key)
                .contentType(contentType)
                .build();

        s3.putObject(req, RequestBody.fromBytes(bytes));
        return buildPublicUrl(key);
    }

    private String buildPublicUrl(String key) {
        if (StringUtils.hasText(props.publicBaseUrl())) {
            String base = props.publicBaseUrl().replaceAll("/+$", "");
            return base + "/" + props.bucket() + "/" + key;
        }
        // fallback: URL "virtual-hosted" típica (puede no funcionar en MinIO sin configuración)
        return "s3://" + props.bucket() + "/" + key;
    }

    public byte[] getBytesFromUrl(String url) {
        assertEnabledAndConfigured();
        StoredObjectRef ref = parseUrl(url);
        GetObjectRequest req = GetObjectRequest.builder()
                .bucket(ref.bucket())
                .key(ref.key())
                .build();
        ResponseBytes<GetObjectResponse> bytes = s3.getObjectAsBytes(req);
        return bytes.asByteArray();
    }

    private StoredObjectRef parseUrl(String url) {
        if (!StringUtils.hasText(url)) throw new IllegalArgumentException("url es obligatoria");
        String trimmed = url.trim();
        if (trimmed.startsWith("s3://")) {
            String rest = trimmed.substring("s3://".length());
            int slash = rest.indexOf('/');
            if (slash <= 0 || slash == rest.length() - 1) {
                throw new IllegalArgumentException("URL s3 inválida");
            }
            return new StoredObjectRef(rest.substring(0, slash), rest.substring(slash + 1));
        }

        // Esperamos formato: {publicBaseUrl}/{bucket}/{key}
        String bucket = props.bucket();
        int idx = trimmed.indexOf("/" + bucket + "/");
        if (idx < 0) throw new IllegalArgumentException("URL no reconocida para object storage");
        String key = trimmed.substring(idx + bucket.length() + 2);
        if (!StringUtils.hasText(key)) throw new IllegalArgumentException("Key inválida en URL");
        return new StoredObjectRef(bucket, key);
    }

    private void assertEnabledAndConfigured() {
        if (!props.enabled()) throw new IllegalArgumentException("Object storage deshabilitado");
        if (!StringUtils.hasText(props.bucket())) throw new IllegalArgumentException("Object storage no configurado: falta bucket");
    }

    private record StoredObjectRef(String bucket, String key) {
    }
}
