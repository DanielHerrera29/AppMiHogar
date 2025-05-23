package co.edu.poli.edu.AppHogar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "clima")
public class Clima {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ciudad;
    private String descripcion;
    private double temperatura;
    private String latitud;
    private String longitud;
    private LocalDateTime ultimaActualizacion;

    public Clima() {}

    // Getters y Setters
    public Long getId() { 
        return id; }
    public void setId(Long id) {
         this.id = id; }
    public String getCiudad() {
         return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    public String getDescripcion() { 
        return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public double getTemperatura() { 
        return temperatura; }
    public void setTemperatura(double temperatura) { this.temperatura = temperatura; }
    public String getLatitud() { 
        return latitud; }
    public void setLatitud(String latitud) { this.latitud = latitud; }
    public String getLongitud() {
         return longitud; }
    public void setLongitud(String longitud) { 
        this.longitud = longitud; }
    public LocalDateTime getUltimaActualizacion() { 
        return ultimaActualizacion; }
    public void setUltimaActualizacion(LocalDateTime ultimaActualizacion) { 
        this.ultimaActualizacion = ultimaActualizacion; }
}