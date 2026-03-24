package com.aluon.core.signature;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailSignatureDto {
    private UUID id;
    private String fullName;
    private String role;
    private String phone;
    private String email;
    private String website;
    private String address;
    private String logoUrl;
    private String accentColor;
    private String html;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
