// src/main/java/co/edu/poli.edu.AppHogar/service/ClimaService.java
package co.edu.poli.edu.AppHogar.controller.External;

import co.edu.poli.edu.AppHogar.entity.Clima; // Asegúrate de que tu entidad Clima esté importada
import co.edu.poli.edu.AppHogar.repository.ClimaRepository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class ClimaService {

    private final ClimaRepository climaRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;

    private final String GEOCODING_URL = "https://nominatim.openstreetmap.org/search?q=%s&format=json&limit=1";
    private final String WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&current_weather=true";

    @Autowired
    public ClimaService(ClimaRepository climaRepository, RestTemplate restTemplate) {
        this.climaRepository = climaRepository;
        this.restTemplate = restTemplate;
        this.mapper = new ObjectMapper();
    }

    public Clima obtenerYGuardarClima(String ciudad) {
        try {
            // 1. Obtener coordenadas
            String geoUrl = String.format(GEOCODING_URL, ciudad);
            String geoResponse = restTemplate.getForObject(geoUrl, String.class);
            JsonNode geoArray = mapper.readTree(geoResponse);

            if (geoArray.isEmpty()) {
                throw new RuntimeException("Ciudad no encontrada en el servicio de geocodificación: " + ciudad);
            }

            JsonNode location = geoArray.get(0);
            String lat = location.get("lat").asText();
            String lon = location.get("lon").asText();

            // 2. Obtener datos del clima
            String weatherUrl = String.format(WEATHER_URL, lat, lon);
            String weatherResponse = restTemplate.getForObject(weatherUrl, String.class);
            JsonNode weatherJson = mapper.readTree(weatherResponse);
            JsonNode currentWeatherNode = weatherJson.get("current_weather");

            if (currentWeatherNode == null) {
                throw new RuntimeException("No se encontró información de clima actual para " + ciudad + " en la API externa.");
            }

            double temperatura = currentWeatherNode.get("temperature").asDouble();
            int weatherCode = currentWeatherNode.get("weathercode").asInt();
            String timeString = currentWeatherNode.get("time").asText();

            // 3. Traducir el weathercode a descripción en español
            String descripcionClima = mapWeatherCodeToDescription(weatherCode);

            // 4. Formatear la fecha/hora
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            LocalDateTime ultimaActualizacion = LocalDateTime.parse(timeString, formatter);

            // 5. Crear o actualizar la entidad Clima
            Optional<Clima> existingClima = climaRepository.findByCiudad(ciudad);
            Clima climaEntidad;

            if (existingClima.isPresent()) {
                climaEntidad = existingClima.get();
            } else {
                climaEntidad = new Clima();
                climaEntidad.setCiudad(ciudad);
            }

            climaEntidad.setTemperatura(temperatura);
            climaEntidad.setDescripcion(descripcionClima); // <-- Aquí se asigna la descripción traducida
            climaEntidad.setLatitud(lat);
            climaEntidad.setLongitud(lon);
            climaEntidad.setUltimaActualizacion(ultimaActualizacion);

            // 6. Guardar en la base de datos
            return climaRepository.save(climaEntidad);

        } catch (Exception e) {
            System.err.println("Error al obtener o guardar el clima para " + ciudad + ": " + e.getMessage());
            throw new RuntimeException("Error al obtener o guardar el clima para " + ciudad + ": " + e.getMessage(), e);
        }
    }

    /**
     * Mapea un código de clima de Open-Meteo a una descripción en español.
     * @param weatherCode El código de clima.
     * @return La descripción del clima en español.
     */
    private String mapWeatherCodeToDescription(int weatherCode) {
        switch (weatherCode) {
            case 0: return "Cielo despejado";
            case 1:
            case 2:
            case 3: return "Principalmente despejado, parcialmente nublado y nublado";
            case 45:
            case 48: return "Niebla y niebla helada";
            case 51:
            case 53:
            case 55: return "Llovizna: Ligera, moderada y densa";
            case 56:
            case 57: return "Llovizna helada: Ligera y densa";
            case 61:
            case 63:
            case 65: return "Lluvia: Ligera, moderada y fuerte";
            case 66:
            case 67: return "Lluvia helada: Ligera y fuerte";
            case 71:
            case 73:
            case 75: return "Nevada: Ligera, moderada y fuerte";
            case 77: return "Granos de nieve";
            case 80:
            case 81:
            case 82: return "Chubascos de lluvia: Ligeros, moderados y violentos";
            case 85:
            case 86: return "Chubascos de nieve: Ligeros y fuertes";
            case 95: return "Tormenta: Ligera o moderada";
            case 96:
            case 99: return "Tormenta con granizo ligero y fuerte";
            default: return "Condición climática desconocida (" + weatherCode + ")";
        }
    }

    public List<Clima> obtenerTodosLosClimasGuardados() {
        return climaRepository.findAll();
    }

    public Optional<Clima> obtenerClimaGuardadoPorId(Long id) {
        return climaRepository.findById(id);
    }

    public Optional<Clima> obtenerClimaGuardadoPorCiudad(String ciudad) {
        return climaRepository.findByCiudad(ciudad);
    }
}