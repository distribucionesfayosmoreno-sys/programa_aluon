package com.aluon.core.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.aluon.core.user.model.Role;
import org.eclipse.jdt.annotation.NonNull;


@RestController
@RequestMapping("/api/admin/roles")
public class RoleController {

    @GetMapping
    public List<@NonNull Role> getRoles() {
        return List.of(Role.values());
    }
}
