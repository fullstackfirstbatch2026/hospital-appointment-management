package com.app.hospitalappointment.service;

import java.util.List;

import com.app.hospitalappointment.entity.Patient;

public interface PatientService {

    List<Patient> listOfPatient();

    Patient findByPatientId(Long id);

    List<Patient> findByPatientName(String name);

    List<Patient> findByCity(String city);
}