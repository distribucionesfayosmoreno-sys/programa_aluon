package com.aluon.core.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import com.aluon.core.user.model.ContractType;


@RestController
@RequestMapping("/api/admin/contract-types")
public class ContractTypeController {

    @GetMapping
    public List<ContractType> getContractTypes() {
        return Arrays.asList(ContractType.values());
    }
}
