package com.aluon.crm.pricing.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.aluon.crm.pricing.dto.TariffDto;
import com.aluon.crm.pricing.service.TariffService;


@RestController
@RequestMapping("/api/tariffs")
@RequiredArgsConstructor
public class TariffController {

    private final TariffService tariffService;

    @GetMapping
    public ResponseEntity<List<TariffDto>> list() {
        return ResponseEntity.ok(tariffService.listTariffs());
    }
}
