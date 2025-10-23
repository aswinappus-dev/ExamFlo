package com.fourbits.examflow.dto;

import java.time.LocalDateTime;

import com.fourbits.examflow.model.ExamSlotStatus;

public class ExamSlotDTO {
    
    private Long id;
    private String name;
    private LocalDateTime startTime;
    private ExamSlotStatus status;

    public ExamSlotDTO(Long id, String name, LocalDateTime startTime, ExamSlotStatus status) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.status = status;
    }

    // Getters and Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public ExamSlotStatus getStatus() { return status; }
    public void setStatus(ExamSlotStatus status) { this.status = status; }
}