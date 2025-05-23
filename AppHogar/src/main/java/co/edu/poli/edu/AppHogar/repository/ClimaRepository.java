package co.edu.poli.edu.AppHogar.repository;

import co.edu.poli.edu.AppHogar.entity.Clima;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List; // Agregamos import para findAll

@Repository
public interface ClimaRepository extends JpaRepository<Clima, Long> {
    Optional<Clima> findByCiudad(String ciudad);
}