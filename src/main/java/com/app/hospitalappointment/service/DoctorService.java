package com.app.hospitalappointment.service;

import java.util.List;

import com.app.hospitalappointment.entity.Doctor;

public interface DoctorService {

    List<Doctor> listOfDoctor();

    Doctor findByDoctorId(Long id);

    List<Doctor> findByDoctorName(String name);

    List<Doctor> findBySpecialization(Long specializationId);

    List<Object[]> findDoctorsAboveAverageAppointments();
}