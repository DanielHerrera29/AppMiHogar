using System;

namespace AppHogarFront.Models
{
    public class FacturaServicio
    {
        public long Id { get; set; }
        public double Monto { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public bool Pagado { get; set; }
        public Proveedor Proveedor { get; set; }
    }
}
