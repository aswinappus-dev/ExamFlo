package com.fourbits.examflow.model;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "exam_slot")
public class ExamSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamSlotStatus status;

    @ManyToMany
    @JoinTable(
      name = "exam_slot_class_groups", 
      joinColumns = @JoinColumn(name = "exam_slot_id"), 
      inverseJoinColumns = @JoinColumn(name = "class_group_id"))
    @JsonIgnoreProperties({"students", "examSlots"})
    private Set<ClassGroup> classGroups;

    @ManyToMany
    @JoinTable(
      name = "exam_slot_halls", 
      joinColumns = @JoinColumn(name = "exam_slot_id"), 
      inverseJoinColumns = @JoinColumn(name = "hall_id"))
    @JsonIgnoreProperties({"examSlots"})
    private Set<Hall> halls;

    @OneToMany(mappedBy = "examSlot", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"examSlot"})
    private Set<Seating> seatingPlan;

    // Getters and Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public ExamSlotStatus getStatus() { return status; }
    public void setStatus(ExamSlotStatus status) { this.status = status; }
    public Set<ClassGroup> getClassGroups() { return classGroups; }
    public void setClassGroups(Set<ClassGroup> classGroups) { this.classGroups = classGroups; }
    public Set<Hall> getHalls() { return halls; }
    public void setHalls(Set<Hall> halls) { this.halls = halls; }
    public Set<Seating> getSeatingPlan() { return seatingPlan; }
    public void setSeatingPlan(Set<Seating> seatingPlan) { this.seatingPlan = seatingPlan; }
}