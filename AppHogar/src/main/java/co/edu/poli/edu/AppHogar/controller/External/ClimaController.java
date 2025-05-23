// src/main/java/co/edu/poli.edu.AppHogar/controller/ClimaController.java
package co.edu.poli.edu.AppHogar.controller.External;

import co.edu.poli.edu.AppHogar.entity.Clima; // Asegúrate de importar tu entidad Clima
import co.edu.poli.edu.AppHogar.controller.External.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clima")
public class ClimaController {

    private final ClimaService climaService;

    public ClimaController(ClimaService climaService) {
        this.climaService = climaService;
    }

    @GetMapping("/{ciudad}")
    public ResponseEntity<?> obtenerClimaYGuardar(@PathVariable String ciudad) {
        try {
            Clima clima = climaService.obtenerYGuardarClima(ciudad);
            // ¡Esta es la línea clave! Debes devolver la entidad 'clima' que obtuviste del servicio.
            return ResponseEntity.ok(clima); // Esto devolverá un JSON que representa tu entidad Clima
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener o guardar el clima: " + e.getMessage());
        }
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Clima>> obtenerTodosLosClimasGuardados() {
        List<Clima> climas = climaService.obtenerTodosLosClimasGuardados();
        return ResponseEntity.ok(climas);
    }

    @GetMapping("/db/{id}")
    public ResponseEntity<?> obtenerClimaGuardadoPorId(@PathVariable Long id) {
        Optional<Clima> clima = climaService.obtenerClimaGuardadoPorId(id);
        if (clima.isPresent()) {
            return ResponseEntity.ok(clima.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Clima con ID " + id + " no encontrado en la base de datos.");
        }
    }

    @GetMapping("/db/ciudad/{ciudad}")
    public ResponseEntity<?> obtenerClimaGuardadoPorCiudad(@PathVariable String ciudad) {
        Optional<Clima> clima = climaService.obtenerClimaGuardadoPorCiudad(ciudad);
        if (clima.isPresent()) {
            return ResponseEntity.ok(clima.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Clima para la ciudad " + ciudad + " no encontrado en la base de datos.");
        }
    }
}