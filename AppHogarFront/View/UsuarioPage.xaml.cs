using AppHogarFront.ViewModels;

namespace AppHogarFront.Views;

public partial class UsuarioPage : ContentPage
{
    private UsuarioViewModel ViewModel => BindingContext as UsuarioViewModel;

    public UsuarioPage()
    {
        InitializeComponent();
    }

    private async void OnLoginClicked(object sender, EventArgs e)
    {
        bool success = await ViewModel.LoginAsync();
        await DisplayAlert("Login", success ? "Inicio de sesión exitoso" : "Credenciales incorrectas", "OK");
    }

    private async void OnCrearUsuarioClicked(object sender, EventArgs e)
    {
        bool created = await ViewModel.CrearUsuarioAsync();
        await DisplayAlert("Registro", created ? "Usuario creado" : "Error al crear usuario", "OK");
    }

    private async void OnForgotPasswordClicked(object sender, EventArgs e)
    {
        string correo = await DisplayPromptAsync("Recuperar contraseña", "Ingrese su correo:");
        if (!string.IsNullOrEmpty(correo))
        {
            string nuevaClave = await DisplayPromptAsync("Nueva contraseña", "Ingrese la nueva contraseña:");
            if (!string.IsNullOrEmpty(nuevaClave))
            {
                bool updated = await ViewModel.ActualizarClaveAsync(correo, nuevaClave);
                await DisplayAlert("Contraseña", updated ? "Contraseña actualizada" : "Correo no encontrado", "OK");
            }
        }
    }
}
