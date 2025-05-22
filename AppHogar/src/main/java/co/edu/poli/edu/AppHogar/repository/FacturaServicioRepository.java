package co.edu.poli.edu.AppHogar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.poli.edu.AppHogar.entity.FacturaServicio;

@Repository
public interface FacturaServicioRepository extends JpaRepository<FacturaServicio, Long> {
}
