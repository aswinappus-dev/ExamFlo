package com.fourbits.examflow.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public class SlotCreationRequest {

    @NotBlank
    private String name;

    @NotNull
    @Future
    private LocalDateTime startTime;
    
    @NotNull
    @Future
    private LocalDateTime endTime;

    @NotEmpty
    private List<Long> classGroupIds;

    @NotEmpty
    private List<Long> hallIds;

    // Getters and Setters...
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public List<Long> getClassGroupIds() { return classGroupIds; }
    public void setClassGroupIds(List<Long> classGroupIds) { this.classGroupIds = classGroupIds; }
    public List<Long> getHallIds() { return hallIds; }
    public void setHallIds(List<Long> hallIds) { this.hallIds = hallIds; }
}