package com.fourbits.examflow.dto;

import com.fourbits.examflow.model.AttendanceStatus;

public class AttendanceRequestDTO {
    
    private Long slotId;
    private Long studentId;
    private AttendanceStatus status;

    // Getters and Setters...
    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }
}