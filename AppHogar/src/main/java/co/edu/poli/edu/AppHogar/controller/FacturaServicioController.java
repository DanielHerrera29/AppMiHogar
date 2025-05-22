package co.edu.poli.edu.AppHogar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.poli.edu.AppHogar.entity.FacturaServicio;
import co.edu.poli.edu.AppHogar.repository.FacturaServicioRepository;

@RestController
@RequestMapping("/facturas-servicio")
public class FacturaServicioController {

    @Autowired
    private FacturaServicioRepository repository;

    @GetMapping
    public List<FacturaServicio> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public FacturaServicio create(@RequestBody FacturaServicio factura) {
        return repository.save(factura);
    }

    @GetMapping("/{id}")
    public FacturaServicio getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public FacturaServicio update(@PathVariable Long id, @RequestBody FacturaServicio factura) {
        factura.setId(id);
        return repository.save(factura);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
