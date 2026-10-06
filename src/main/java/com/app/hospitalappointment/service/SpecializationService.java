package com.app.hospitalappointment.service;

import java.util.List;

import com.app.hospitalappointment.entity.Specialization;

public interface SpecializationService {

    List<Specialization> listOfSpecialization();

    Specialization findBySpecializationId(Long id);

    Specialization findBySpecializationName(String name);
}