package com.app.hospitalappointment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.hospitalappointment.entity.Doctor;
import com.app.hospitalappointment.service.DoctorService;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    // Get all doctors
    @GetMapping
    public List<Doctor> listOfDoctor() {
        return service.listOfDoctor();
    }

    // Find doctor by ID
    @GetMapping("/{id}")
    public Doctor findByDoctorId(
            @PathVariable Long id) {

        return service.findByDoctorId(id);
    }

    // Find doctors by name
    @GetMapping("/name/{name}")
    public List<Doctor> findByDoctorName(
            @PathVariable String name) {

        return service.findByDoctorName(name);
    }

    // Find doctors by specialization
    @GetMapping("/specialization/{specializationId}")
    public List<Doctor> findBySpecialization(
            @PathVariable Long specializationId) {

        return service.findBySpecialization(
                specializationId);
    }

    // Doctors having more appointments than average
    @GetMapping("/above-average-appointments")
    public List<Object[]> findDoctorsAboveAverageAppointments() {

        return service.findDoctorsAboveAverageAppointments();
    }
}