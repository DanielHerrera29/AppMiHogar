package co.edu.poli.edu.AppHogar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.poli.edu.AppHogar.entity.CategoriaTarea;

@Repository
public interface CategoriaTareaRepository extends JpaRepository<CategoriaTarea, Long> {
}
