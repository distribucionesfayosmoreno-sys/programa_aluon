package com.aluon.core.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private Integer telefono;
    private Role role;
    private String horario;
    private ContractType tipoContrato;
    private String fotoBase64;
}
