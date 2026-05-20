package com.aluon.core.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.Objects;
import com.aluon.core.user.dto.CreateUserRequest;
import com.aluon.core.user.dto.UpdateUserRequest;
import com.aluon.core.user.model.User;
import com.aluon.core.user.dto.UserDto;
import com.aluon.core.user.repository.UserRepository;


@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public UserDto findById(Long id) {
        return toDto(getUserById(Objects.requireNonNull(id, "id")));
    }

    public UserDto create(CreateUserRequest request) {
        validateCreate(request);

        if (userRepository.existsByUsername(request.getEmail())) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }

        User user = User.builder()
                .username(request.getEmail())
                .passwordHash("SIN_CONTRASENA")
                .rol(request.getRole())
                .nombre(request.getNombre())
                .apellidos(request.getApellidos())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .horario(request.getHorario())
                .tipoContrato(request.getTipoContrato())
                .foto(decodeBase64(request.getFotoBase64()))
                .build();

        return toDto(userRepository.save(user));
    }

    public UserDto update(Long id, UpdateUserRequest request) {
        Objects.requireNonNull(request, "request");
        User user = getUserById(Objects.requireNonNull(id, "id"));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String nextEmail = request.getEmail();
            if (!nextEmail.equals(user.getEmail()) && userRepository.existsByUsername(nextEmail)) {
                throw new RuntimeException("El nombre de usuario ya existe");
            }
            user.setEmail(nextEmail);
            user.setUsername(nextEmail);
        }

        if (request.getRole() != null) {
            user.setRol(request.getRole());
        }

        if (request.getNombre() != null) {
            user.setNombre(request.getNombre());
        }

        if (request.getApellidos() != null) {
            user.setApellidos(request.getApellidos());
        }

        if (request.getTelefono() != null) {
            user.setTelefono(request.getTelefono());
        }

        if (request.getHorario() != null) {
            user.setHorario(request.getHorario());
        }

        if (request.getTipoContrato() != null) {
            user.setTipoContrato(request.getTipoContrato());
        }

        if (request.getFotoBase64() != null) {
            user.setFoto(decodeBase64(request.getFotoBase64()));
        }

        return toDto(userRepository.save(user));
    }

    public void deleteById(Long id) {
        userRepository.deleteById(Objects.requireNonNull(id, "id"));
    }

    private void validateCreate(CreateUserRequest request) {
        if (request == null || request.getNombre() == null || request.getNombre().isBlank()) {
            throw new RuntimeException("El nombre es obligatorio");
        }
        if (request.getApellidos() == null || request.getApellidos().isBlank()) {
            throw new RuntimeException("Los apellidos son obligatorios");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("El email es obligatorio");
        }
        if (request.getRole() == null) {
            throw new RuntimeException("El rol es obligatorio");
        }
        if (request.getTipoContrato() == null) {
            throw new RuntimeException("El tipo de contrato es obligatorio");
        }
    }

    private User getUserById(Long id) {
        return userRepository.findById(Objects.requireNonNull(id, "id"))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .nombre(user.getNombre())
                .apellidos(user.getApellidos())
                .email(user.getEmail())
                .telefono(user.getTelefono())
                .role(user.getRol())
                .horario(user.getHorario())
                .tipoContrato(user.getTipoContrato())
                .fotoBase64(encodeBase64(user.getFoto()))
                .build();
    }

    private byte[] decodeBase64(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return Base64.getDecoder().decode(value);
    }

    private String encodeBase64(byte[] value) {
        if (value == null || value.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(value);
    }
}
