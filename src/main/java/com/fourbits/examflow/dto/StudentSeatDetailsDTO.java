package com.fourbits.examflow.dto;

public class StudentSeatDetailsDTO {

    private String studentName;
    private String registerNumber;
    private String hallName;
    private String block;
    private String seatNumber;

    public StudentSeatDetailsDTO(String studentName, String registerNumber, String hallName, String block, String seatNumber) {
        this.studentName = studentName;
        this.registerNumber = registerNumber;
        this.hallName = hallName;
        this.block = block;
        this.seatNumber = seatNumber;
    }

    // Getters and Setters...
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getHallName() { return hallName; }
    public void setHallName(String hallName) { this.hallName = hallName; }
    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
}