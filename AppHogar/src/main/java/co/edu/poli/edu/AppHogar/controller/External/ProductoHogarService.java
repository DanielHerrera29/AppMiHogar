package co.edu.poli.edu.AppHogar.controller.External;

import co.edu.poli.edu.AppHogar.entity.ProductoHogar;
import co.edu.poli.edu.AppHogar.repository.ProductoHogarRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductoHogarService {

    private final ProductoHogarRepository productoHogarRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;

    private final String FAKESTORE_API_URL = "https://fakestoreapi.com/products";

    // Mapa estático para traducir categorías al español
    private static final Map<String, String> CATEGORY_TRANSLATIONS = new HashMap<>();
    static {
        CATEGORY_TRANSLATIONS.put("electronics", "Electrónica");
        CATEGORY_TRANSLATIONS.put("jewelery", "Joyería");
        CATEGORY_TRANSLATIONS.put("men's clothing", "Ropa de Hombre");
        CATEGORY_TRANSLATIONS.put("women's clothing", "Ropa de Mujer");
        // Puedes añadir más si encuentras otras categorías relevantes o generales
    }

    // --- MAPAS ESTÁTICOS PARA SIMULAR TRADUCCIONES DE TÍTULOS Y DESCRIPCIONES ---
   
    private static final Map<String, String> TITLE_TRANSLATIONS = new HashMap<>();
    private static final Map<String, String> DESCRIPTION_TRANSLATIONS = new HashMap<>();

    static {
        // Electrónica
        TITLE_TRANSLATIONS.put("Fjallraven Foldsack No. 1 Backpack, Fits 15 Laptops", "Mochila Fjallraven Foldsack No. 1, Compatible con Portátiles de 15 pulgadas");
        DESCRIPTION_TRANSLATIONS.put("Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday", "Tu mochila perfecta para el uso diario y paseos por el bosque. Guarda tu portátil (hasta 15 pulgadas) en el compartimento acolchado, ideal para tu día a día.");

        TITLE_TRANSLATIONS.put("Mens Casual Premium Slim Fit T-Shirts ", "Camisetas Casual Premium Slim Fit para Hombre");
        DESCRIPTION_TRANSLATIONS.put("Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline Includes a three-button placket.", "Estilo ajustado, manga larga raglán contrastante, solapa Henley de tres botones, tela ligera y suave para un uso transpirable y cómodo. Y camisas cosidas sólidas con cuello redondo hechas para durabilidad y un gran ajuste para ropa de moda casual y para aficionados al béisbol. El cuello redondo estilo Henley incluye una solapa de tres botones.");

        TITLE_TRANSLATIONS.put("Mens Cotton Jacket", "Chaqueta de Algodón para Hombre");
        DESCRIPTION_TRANSLATIONS.put("Great outerwear jackets for Spring/Autumn/Winter, suitable for casual wear, business, dates, parties and outdoor sports. There are 4 colors for your choose.", "Excelentes chaquetas para Primavera/Otoño/Invierno, adecuadas para uso casual, negocios, citas, fiestas y deportes al aire libre. Hay 4 colores para elegir.");

        TITLE_TRANSLATIONS.put("Pierced Owl Rose Gold Plated Stainless Steel Double", "Doble Barra de Acero Inoxidable con Baño de Oro Rosa de Búho Perforado");
        DESCRIPTION_TRANSLATIONS.put("Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel", "Pendientes de túnel acampanados dobles con baño de oro rosa. Hechos de Acero Inoxidable 316L.");

        TITLE_TRANSLATIONS.put("Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5", "SSD Silicon Power 256GB 3D NAND A55 SLC Cache Rendimiento Mejorado SATA III 2.5");
        DESCRIPTION_TRANSLATIONS.put("Superior performance 3D NAND flash and SATA III 6Gb/s interface; Sequential Read/Write speeds up to 550/450 MB/s; SLC Cache technology for performance boost and longer lifespan; Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correcting) to provide the optimized performance and enhanced reliability.", "Flash 3D NAND de rendimiento superior e interfaz SATA III de 6 Gb/s; Velocidades de lectura/escritura secuencial de hasta 550/450 MB/s; Tecnología de caché SLC para mejorar el rendimiento y prolongar la vida útil; Soporta comando TRIM, tecnología de recolección de basura, RAID y ECC (comprobación y corrección de errores) para proporcionar un rendimiento optimizado y una fiabilidad mejorada.");

        TITLE_TRANSLATIONS.put("WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive", "Disco Duro Externo Portátil WD Gaming Drive de 4TB Compatible con Playstation 4");
        DESCRIPTION_TRANSLATIONS.put("Expand your PS4 gaming experience, Play anywhere, Store more games, system-level performance, Game drive, The slim and travel-friendly form factor allows you to take your games wherever you go, It's simple to set up, just plug it into your PS4 and go.", "Expande tu experiencia de juego en PS4, Juega en cualquier lugar, Almacena más juegos, rendimiento a nivel de sistema, Unidad de juego, El factor de forma delgado y fácil de transportar te permite llevar tus juegos donde quiera que vayas, Es fácil de configurar, solo conéctalo a tu PS4 y listo.");
       
        TITLE_TRANSLATIONS.put("John Hardy Womens Legends Naga Gold & Silver Dragon Station Chain Bracelet", "Pulsera de Cadena de Estación de Dragón de Oro y Plata Naga de John Hardy para Mujer");
        DESCRIPTION_TRANSLATIONS.put("From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to absorb love and abundance, or outward for protection.", "De nuestra Colección Legends, el Naga se inspiró en el mítico dragón de agua que protege la perla del océano. Llévalo hacia adentro para absorber amor y abundancia, o hacia afuera para protección.");


    }

    @Autowired
    public ProductoHogarService(ProductoHogarRepository productoHogarRepository, RestTemplate restTemplate) {
        this.productoHogarRepository = productoHogarRepository;
        this.restTemplate = restTemplate;
        this.mapper = new ObjectMapper();
    }

    /**
     * Consume la FakeStoreAPI, filtra productos por categorías "para el hogar",
     * simula la traducción de títulos y descripciones, y los guarda/actualiza en la DB.
     * @return Una lista de productos del hogar guardados/actualizados.
     */
    public List<ProductoHogar> obtenerYGuardarProductosHogar() {
        List<ProductoHogar> productosGuardados = new ArrayList<>();
        try {
            String apiResponse = restTemplate.getForObject(FAKESTORE_API_URL, String.class);
            JsonNode productsArray = mapper.readTree(apiResponse);

            if (productsArray.isArray()) {
                for (JsonNode productNode : productsArray) {
                    String category = productNode.has("category") ? productNode.get("category").asText() : "";
                    String originalTitle = productNode.get("title").asText();
                    String originalDescription = productNode.get("description").asText();

                    // Filtrar por categorías que podrían ser "para el hogar" y que tenemos traducidas
                    if (CATEGORY_TRANSLATIONS.containsKey(category.toLowerCase())) {
                        ProductoHogar producto = new ProductoHogar();
                        
                        // Aplicar la simulación de traducción de títulos y descripciones
                        producto.setTitulo(TITLE_TRANSLATIONS.getOrDefault(originalTitle, originalTitle));
                        producto.setDescripcion(DESCRIPTION_TRANSLATIONS.getOrDefault(originalDescription, originalDescription));
                        
                        producto.setPrecio(productNode.get("price").asDouble());
                        producto.setCategoria(CATEGORY_TRANSLATIONS.get(category.toLowerCase())); // Categoría ya traducida
                        producto.setImagenUrl(productNode.get("image").asText());

                        // 3. Guardar/Actualizar en la base de datos
                        // Busca por el título YA TRADUCIDO para evitar duplicados si el título original ya fue procesado
                        Optional<ProductoHogar> existingProduct = productoHogarRepository.findByTitulo(producto.getTitulo());
                        if (existingProduct.isPresent()) {
                            // Si el producto ya existe, actualiza sus datos
                            ProductoHogar p = existingProduct.get();
                            p.setDescripcion(producto.getDescripcion());
                            p.setPrecio(producto.getPrecio());
                            p.setCategoria(producto.getCategoria());
                            p.setImagenUrl(producto.getImagenUrl());
                            productosGuardados.add(productoHogarRepository.save(p));
                        } else {
                            // Si es un producto nuevo, lo guarda
                            productosGuardados.add(productoHogarRepository.save(producto));
                        }
                    }
                }
            }
        } catch (Exception e) {
            // Mensaje de error en español
            System.err.println("Error al obtener o guardar productos: " + e.getMessage());
            throw new RuntimeException("Error al procesar productos del hogar desde la API externa: " + e.getMessage(), e);
        }
        return productosGuardados;
    }

    // Métodos para obtener productos directamente de la DB
    public List<ProductoHogar> obtenerTodosLosProductosGuardados() {
        return productoHogarRepository.findAll();
    }

    public Optional<ProductoHogar> obtenerProductoPorId(Long id) {
        return productoHogarRepository.findById(id);
    }

    public Optional<ProductoHogar> obtenerProductoPorTitulo(String titulo) {
        return productoHogarRepository.findByTitulo(titulo);
    }
}