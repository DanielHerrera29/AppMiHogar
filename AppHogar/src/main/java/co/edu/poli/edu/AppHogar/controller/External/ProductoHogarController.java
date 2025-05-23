package co.edu.poli.edu.AppHogar.controller.External;

import co.edu.poli.edu.AppHogar.entity.ProductoHogar;
import co.edu.poli.edu.AppHogar.repository.ProductoHogarRepository;
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
@RequestMapping("/api/productos-hogar")
public class ProductoHogarController {

    private final ProductoHogarService productoHogarService;
    private final ProductoHogarRepository productoHogarRepository;

    public ProductoHogarController(ProductoHogarService productoHogarService, ProductoHogarRepository productoHogarRepository) {
        this.productoHogarService = productoHogarService;
        this.productoHogarRepository = productoHogarRepository;
    }

    @GetMapping("/cargar")
    public ResponseEntity<?> cargarProductosYGuardar() {
        try {
            List<ProductoHogar> productos = productoHogarService.obtenerYGuardarProductosHogar();
            if (productos.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No se encontraron productos para el hogar o no se pudieron cargar desde la API externa.");
            }
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cargar y guardar productos: " + e.getMessage());
        }
    }

    @GetMapping("/todos")
    public ResponseEntity<List<ProductoHogar>> obtenerTodosLosProductosGuardados() {
        List<ProductoHogar> productos = productoHogarRepository.findAll();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/db/{id}")
    public ResponseEntity<?> obtenerProductoPorId(@PathVariable Long id) {
        Optional<ProductoHogar> producto = productoHogarService.obtenerProductoPorId(id);
        if (producto.isPresent()) {
            return ResponseEntity.ok(producto.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto con ID " + id + " no encontrado en la base de datos.");
        }
    }

    @GetMapping("/db/titulo/{titulo}")
    public ResponseEntity<?> obtenerProductoPorTitulo(@PathVariable String titulo) {
        Optional<ProductoHogar> producto = productoHogarService.obtenerProductoPorTitulo(titulo);
        if (producto.isPresent()) {
            return ResponseEntity.ok(producto.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto con título '" + titulo + "' no encontrado en la base de datos.");
        }
    }
}