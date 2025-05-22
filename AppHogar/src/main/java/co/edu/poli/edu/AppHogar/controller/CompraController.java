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

import co.edu.poli.edu.AppHogar.entity.Compra;
import co.edu.poli.edu.AppHogar.repository.CompraRepository;

@RestController
@RequestMapping("/compras")
public class CompraController {

    @Autowired
    private CompraRepository repository;

    @GetMapping
    public List<Compra> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Compra create(@RequestBody Compra compra) {
        return repository.save(compra);
    }

    @GetMapping("/{id}")
    public Compra getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Compra update(@PathVariable Long id, @RequestBody Compra compra) {
        compra.setId(id);
        return repository.save(compra);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
