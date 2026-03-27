package com.aluon.core.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import com.aluon.core.user.model.Role;


@RestController
@RequestMapping("/api/admin/roles")
public class RoleController {

    @GetMapping
    public List<Role> getRoles() {
        return Arrays.asList(Role.values());
    }
}
