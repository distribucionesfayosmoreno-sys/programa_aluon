package com.aluon.crm.doorsimulation.service;

import com.aluon.crm.doorsimulation.config.DoorSimulationGoogleProperties;
import com.aluon.crm.doorsimulation.dto.CreateDoorSimulationRequest;
import com.aluon.crm.doorsimulation.integrations.GoogleStreetViewClient;
import com.aluon.crm.doorsimulation.repo.DoorVisualSimulationJobRepository;
import com.aluon.crm.doorsimulation.storage.ObjectStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class DoorVisualSimulationServiceTest {

    @Mock
    GoogleStreetViewClient streetViewClient;
    @Mock
    ObjectStorageService objectStorageService;
    @Mock
    DoorVisualSimulationJobRepository repo;
    @Mock
    ApplicationEventPublisher events;

    @Test
    void rejectsInvalidImageSize() {
        DoorSimulationGoogleProperties props = new DoorSimulationGoogleProperties(true, "k", null, "640x640", 90);
        DoorVisualSimulationService service = new DoorVisualSimulationService(props, streetViewClient, objectStorageService, repo, events);
        assertThrows(IllegalArgumentException.class, () -> service.createJobAndFetchBaseImage(
                new CreateDoorSimulationRequest("Calle Mayor 1", "800x800", null, null, null)
        ));
    }

    @Test
    void rejectsInvalidFov() {
        DoorSimulationGoogleProperties props = new DoorSimulationGoogleProperties(true, "k", null, "640x640", 90);
        DoorVisualSimulationService service = new DoorVisualSimulationService(props, streetViewClient, objectStorageService, repo, events);
        assertThrows(IllegalArgumentException.class, () -> service.createJobAndFetchBaseImage(
                new CreateDoorSimulationRequest("Calle Mayor 1", "640x640", 200, null, null)
        ));
    }
}

