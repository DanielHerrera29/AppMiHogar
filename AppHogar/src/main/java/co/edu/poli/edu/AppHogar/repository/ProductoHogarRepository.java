package co.edu.poli.edu.AppHogar.repository;

import co.edu.poli.edu.AppHogar.entity.ProductoHogar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProductoHogarRepository extends JpaRepository<ProductoHogar, Long> {
    Optional<ProductoHogar> findByTitulo(String titulo);
}