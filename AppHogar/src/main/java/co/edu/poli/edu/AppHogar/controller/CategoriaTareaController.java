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

import co.edu.poli.edu.AppHogar.entity.CategoriaTarea;
import co.edu.poli.edu.AppHogar.repository.CategoriaTareaRepository;

@RestController
@RequestMapping("/categoria-tareas")
public class CategoriaTareaController {

    @Autowired
    private CategoriaTareaRepository repository;

    @GetMapping
    public List<CategoriaTarea> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public CategoriaTarea create(@RequestBody CategoriaTarea categoriaTarea) {
        return repository.save(categoriaTarea);
    }

    @GetMapping("/{id}")
    public CategoriaTarea getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public CategoriaTarea update(@PathVariable Long id, @RequestBody CategoriaTarea categoriaTarea) {
        categoriaTarea.setId(id);
        return repository.save(categoriaTarea);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
