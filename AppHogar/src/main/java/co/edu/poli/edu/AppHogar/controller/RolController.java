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

import co.edu.poli.edu.AppHogar.entity.Rol;
import co.edu.poli.edu.AppHogar.repository.RolRepository;

@RestController
@RequestMapping("/roles")
public class RolController {

    @Autowired
    private RolRepository repository;

    @GetMapping
    public List<Rol> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Rol create(@RequestBody Rol rol) {
        return repository.save(rol);
    }

    @GetMapping("/{id}")
    public Rol getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Rol update(@PathVariable Long id, @RequestBody Rol rol) {
        rol.setId(id);
        return repository.save(rol);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
