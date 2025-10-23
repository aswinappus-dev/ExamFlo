package com.fourbits.examflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StudentDTO {

    private Long id;

    @NotBlank(message = "Register number is required")
    private String registerNumber;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Class Group ID is required")
    private Long classGroupId;
    
    private String classGroupName; // To display in the table

    // Constructors
    public StudentDTO() {}

    public StudentDTO(Long id, String registerNumber, String name, Long classGroupId, String classGroupName) {
        this.id = id;
        this.registerNumber = registerNumber;
        this.name = name;
        this.classGroupId = classGroupId;
        this.classGroupName = classGroupName;
    }

    // Getters and Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getClassGroupId() { return classGroupId; }
    public void setClassGroupId(Long classGroupId) { this.classGroupId = classGroupId; }
    public String getClassGroupName() { return classGroupName; }
    public void setClassGroupName(String classGroupName) { this.classGroupName = classGroupName; }
}