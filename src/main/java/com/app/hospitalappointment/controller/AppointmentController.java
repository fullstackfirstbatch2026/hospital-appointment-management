
package com.app.hospitalappointment.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.hospitalappointment.entity.Appointment;
import com.app.hospitalappointment.service.AppointmentService;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(
            AppointmentService service) {
        this.service = service;
    }

    // Get all appointments
    @GetMapping
    public List<Appointment> listOfAppointment() {
        return service.listOfAppointment();
    }

    // Find appointment by ID
    @GetMapping("/{id}")
    public Appointment findByAppointmentId(
            @PathVariable Long id) {
        return service.findByAppointmentId(id);
    }

    // Find appointments by doctor
    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> findByDoctorId(
            @PathVariable Long doctorId) {
        return service.findByDoctorId(doctorId);
    }

    // Find appointments by patient
    @GetMapping("/patient/{patientId}")
    public List<Appointment> findByPatientId(
            @PathVariable Long patientId) {
        return service.findByPatientId(patientId);
    }

    // Find appointments by date
    @GetMapping("/date/{date}")
    public List<Appointment> findByAppointmentDate(
            @PathVariable LocalDate date) {
        return service.findByAppointmentDate(date);
    }

    // JOIN - Doctor name + Patient name
    @GetMapping("/details")
    public List<Object[]> getAppointmentDetails() {
        return service.getAppointmentDetails();
    }
}
