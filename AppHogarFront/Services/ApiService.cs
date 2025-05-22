using System.Net.Http.Json;
using AppHogarFront.Models;

namespace AppHogarFront.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;

        public ApiService()
        {
            _httpClient = new HttpClient
            {
                //BaseAddress = new Uri("http://10.0.2.2:8080/") // o IP local si pruebas con Android físico
                BaseAddress = new Uri("http://192.168.1.52:8080/");
            };
        }

        public async Task<List<Usuario>> GetUsuariosAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<Usuario>>("usuarios");
        }

        public async Task<Usuario> GetUsuarioByIdAsync(long id)
        {
            return await _httpClient.GetFromJsonAsync<Usuario>($"usuarios/{id}");
        }

        public async Task<bool> CreateUsuarioAsync(Usuario usuario)
        {
            var response = await _httpClient.PostAsJsonAsync("usuarios", usuario);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateUsuarioAsync(Usuario usuario)
        {
            var response = await _httpClient.PutAsJsonAsync($"usuarios/{usuario.Id}", usuario);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteUsuarioAsync(long id)
        {
            var response = await _httpClient.DeleteAsync($"usuarios/{id}");
            return response.IsSuccessStatusCode;
        }
    }
}
