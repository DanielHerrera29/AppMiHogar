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

import co.edu.poli.edu.AppHogar.entity.Proveedor;
import co.edu.poli.edu.AppHogar.repository.ProveedorRepository;

@RestController
@RequestMapping("/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorRepository repository;

    @GetMapping
    public List<Proveedor> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Proveedor create(@RequestBody Proveedor proveedor) {
        return repository.save(proveedor);
    }

    @GetMapping("/{id}")
    public Proveedor getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Proveedor update(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        proveedor.setId(id);
        return repository.save(proveedor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
