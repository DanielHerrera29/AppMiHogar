package co.edu.poli.edu.AppHogar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import co.edu.poli.edu.AppHogar.entity.Tarea;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
}
