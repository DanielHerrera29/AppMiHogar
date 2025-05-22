namespace AppHogarFront.Models
{
    public class Producto
    {
        public long Id { get; set; }
        public string Nombre { get; set; }
        public double Precio { get; set; }
        public Categoria Categoria { get; set; }
    }
}
