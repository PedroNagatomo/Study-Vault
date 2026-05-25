// backend/src/main/java/com/studyvault/dto/ErrorResponseDTO.java
package com.studyvault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponseDTO {

    private int status;
    private String message;
    private List<String> errors;
    private LocalDateTime timestamp;
    private String path;

    public static ErrorResponseDTO of(int status, String message, String path) {
        return ErrorResponseDTO.builder()
                .status(status)
                .message(message)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }

    public static ErrorResponseDTO of(int status, String message, List<String> errors, String path) {
        return ErrorResponseDTO.builder()
                .status(status)
                .message(message)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }
}