package co.edu.poli.edu.AppHogar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import co.edu.poli.edu.AppHogar.entity.Rol;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
}
