package com.fourbits.examflow.model;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column; // Import this
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "class_group")
public class ClassGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // A ClassGroup can have many Students
    @OneToMany(mappedBy = "classGroup")
    @JsonIgnore // Prevents infinite loops when sending as JSON
    private Set<Student> students;
    
    // A ClassGroup can be in many ExamSlots
    @ManyToMany(mappedBy = "classGroups")
    @JsonIgnore // Prevents infinite loops
    private Set<ExamSlot> examSlots;

    // Getters and Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Set<Student> getStudents() { return students; }
    public void setStudents(Set<Student> students) { this.students = students; }
    public Set<ExamSlot> getExamSlots() { return examSlots; }
    public void setExamSlots(Set<ExamSlot> examSlots) { this.examSlots = examSlots; }
}