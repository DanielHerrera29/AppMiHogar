package co.edu.poli.edu.AppHogar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.poli.edu.AppHogar.entity.Compra;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {
}
