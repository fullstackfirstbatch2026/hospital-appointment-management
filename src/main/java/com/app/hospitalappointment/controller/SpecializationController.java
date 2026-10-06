package com.app.hospitalappointment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.hospitalappointment.entity.Specialization;
import com.app.hospitalappointment.service.SpecializationService;

@RestController
@RequestMapping("/specializations")
public class SpecializationController {

    private final SpecializationService service;

    public SpecializationController(
            SpecializationService service) {
        this.service = service;
    }

    // Get all specializations
    @GetMapping
    public List<Specialization> listOfSpecialization() {
        return service.listOfSpecialization();
    }

    // Find specialization by ID
    @GetMapping("/{id}")
    public Specialization findBySpecializationId(
            @PathVariable Long id) {
        return service.findBySpecializationId(id);
    }

    // Find specialization by name
    @GetMapping("/name/{name}")
    public Specialization findBySpecializationName(
            @PathVariable String name) {
        return service.findBySpecializationName(name);
    }
}