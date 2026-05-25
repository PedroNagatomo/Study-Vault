// backend/src/main/java/com/studyvault/dto/TagCountDTO.java
package com.studyvault.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagCountDTO {
    private String tag;
    private Long count;
}