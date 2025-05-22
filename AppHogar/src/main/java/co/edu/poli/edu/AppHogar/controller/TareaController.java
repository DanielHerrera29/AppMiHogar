package co.edu.poli.edu.AppHogar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import co.edu.poli.edu.AppHogar.entity.Tarea;
import co.edu.poli.edu.AppHogar.repository.TareaRepository;

@RestController
@RequestMapping("/tareas")
public class TareaController {

    @Autowired
    private TareaRepository repository;

    @GetMapping
    public List<Tarea> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Tarea create(@RequestBody Tarea tarea) {
        return repository.save(tarea);
    }

    @GetMapping("/{id}")
    public Tarea getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Tarea update(@PathVariable Long id, @RequestBody Tarea tarea) {
        tarea.setId(id);
        return repository.save(tarea);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
