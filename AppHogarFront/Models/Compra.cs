using System;

namespace AppHogarFront.Models
{
    public class Compra
    {
        public long Id { get; set; }
        public DateTime Fecha { get; set; }
        public Producto Producto { get; set; }
    }
}
