package com.aluon.production.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderRequestDto {
    private UUID customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String modeloPuerta;
    private Integer anchoMm;
    private Integer altoMm;
    private String notes;
    private String color;
    private String installerName;
    private List<MultipartFile> attachments;
}
