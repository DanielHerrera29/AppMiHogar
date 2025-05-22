using AppHogarFront.Models;
using AppHogarFront.Services;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace AppHogarFront.ViewModels
{
    public class UsuarioViewModel : INotifyPropertyChanged
    {
        private readonly ApiService _apiService = new();

        public ObservableCollection<Usuario> Usuarios { get; set; } = new();

        private string _nombre;
        public string Nombre
        {
            get => _nombre;
            set => SetProperty(ref _nombre, value);
        }

        private string _clave;
        public string Clave
        {
            get => _clave;
            set => SetProperty(ref _clave, value);
        }

        private string _correo;
        public string Correo
        {
            get => _correo;
            set => SetProperty(ref _correo, value);
        }

        public async Task<bool> LoginAsync()
        {
            var usuarios = await _apiService.GetUsuariosAsync();
            var user = usuarios.FirstOrDefault(u => u.Nombre == Nombre && u.Clave == Clave);
            return user != null;
        }

        public async Task<bool> CrearUsuarioAsync()
        {
            var nuevo = new Usuario { Nombre = Nombre, Clave = Clave, Correo = Correo };
            return await _apiService.CreateUsuarioAsync(nuevo);
        }

        public async Task<bool> ActualizarClaveAsync(string correoBuscado, string nuevaClave)
        {
            var usuarios = await _apiService.GetUsuariosAsync();
            var user = usuarios.FirstOrDefault(u => u.Correo == correoBuscado);
            if (user != null)
            {
                user.Clave = nuevaClave;
                return await _apiService.UpdateUsuarioAsync(user);
            }
            return false;
        }

        public event PropertyChangedEventHandler PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string propertyName = "")
        => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));

        protected bool SetProperty<T>(ref T storage, T value, [CallerMemberName] string propertyName = "")
        {
            if (Equals(storage, value))
                return false;
            storage = value;
            OnPropertyChanged(propertyName);
            return true;
        }
    }
}
