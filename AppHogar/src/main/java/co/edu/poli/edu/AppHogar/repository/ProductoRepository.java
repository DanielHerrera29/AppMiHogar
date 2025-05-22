package co.edu.poli.edu.AppHogar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.poli.edu.AppHogar.entity.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
