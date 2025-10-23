package com.fourbits.examflow.dto;

import java.time.LocalDateTime;

public class PublicSlotDetailsDTO {
    
    // Status can be "UPCOMING", "ACTIVE", "NONE"
    private String status;
    private Long slotId;
    private LocalDateTime revealTime;

    public PublicSlotDetailsDTO(String status, Long slotId, LocalDateTime revealTime) {
        this.status = status;
        this.slotId = slotId;
        this.revealTime = revealTime;
    }

    // Getters and Setters...
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }
    public LocalDateTime getRevealTime() { return revealTime; }
    public void setRevealTime(LocalDateTime revealTime) { this.revealTime = revealTime; }
}