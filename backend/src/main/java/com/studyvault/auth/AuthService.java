package com.studyvault.auth;

import com.studyvault.model.Role;
import com.studyvault.model.User;
import com.studyvault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Verificar se email já existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }

        // Verificar se username já existe
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username já está em uso");
        }

        // Criar usuário
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.USER)
                .isEnabled(true)
                .build();

        userRepository.save(user);

        // Gerar tokens
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        return buildAuthResponse(user, jwtToken, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        // Autenticar
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Buscar usuário
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Gerar tokens com claims adicionais
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId());
        extraClaims.put("username", user.getUsername());
        extraClaims.put("role", user.getRole().name());

        var jwtToken = jwtService.generateToken(extraClaims, user);
        var refreshToken = jwtService.generateRefreshToken(user);

        // Atualizar último login
        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);

        return buildAuthResponse(user, jwtToken, refreshToken);
    }

    public AuthResponse refreshToken(String refreshToken) {
        // Extrair email do refresh token
        final String userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail == null) {
            throw new RuntimeException("Token inválido");
        }

        // Buscar usuário
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Validar refresh token
        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new RuntimeException("Refresh token inválido ou expirado");
        }

        // Gerar novo access token
        var newAccessToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Mantém o mesmo refresh token
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .build();
    }

    private AuthResponse buildAuthResponse(User user, String jwtToken, String refreshToken) {
        var userDto = AuthResponse.UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .build();

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(userDto)
                .build();
    }
}