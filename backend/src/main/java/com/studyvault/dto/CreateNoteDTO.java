// backend/src/main/java/com/studyvault/dto/CreateNoteDTO.java
package com.studyvault.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateNoteDTO {
    private String title;
    private String content;
    private List<String> tags;
}