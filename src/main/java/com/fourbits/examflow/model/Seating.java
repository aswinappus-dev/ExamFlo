package com.fourbits.examflow.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "seating")
public class Seating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "classGroup"})
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hall_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "examSlots"})
    private Hall hall;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_slot_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "classGroups", "halls", "seatingPlan"})
    private ExamSlot examSlot;

    @Column(nullable = false)
    private String seatNumber; // e.g., "A1-1"

    @Enumerated(EnumType.STRING)
    private AttendanceStatus attendance;

    // Getters and Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Hall getHall() { return hall; }
    public void setHall(Hall hall) { this.hall = hall; }
    public ExamSlot getExamSlot() { return examSlot; }
    public void setExamSlot(ExamSlot examSlot) { this.examSlot = examSlot; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public AttendanceStatus getAttendance() { return attendance; }
    public void setAttendance(AttendanceStatus attendance) { this.attendance = attendance; }
}