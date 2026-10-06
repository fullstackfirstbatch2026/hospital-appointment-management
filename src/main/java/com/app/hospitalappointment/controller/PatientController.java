package com.app.hospitalappointment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.hospitalappointment.entity.Patient;
import com.app.hospitalappointment.service.PatientService;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    // Get all patients
    @GetMapping
    public List<Patient> listOfPatient() {
        return service.listOfPatient();
    }

    // Find patient by ID
    @GetMapping("/{id}")
    public Patient findByPatientId(
            @PathVariable Long id) {
        return service.findByPatientId(id);
    }

    // Find patients by name
    @GetMapping("/name/{name}")
    public List<Patient> findByPatientName(
            @PathVariable String name) {
        return service.findByPatientName(name);
    }

    // Find patients by city
    @GetMapping("/city/{city}")
    public List<Patient> findByCity(
            @PathVariable String city) {
        return service.findByCity(city);
    }
}