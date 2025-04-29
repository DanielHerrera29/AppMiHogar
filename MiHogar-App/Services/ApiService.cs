using System.Net.Http.Json;
namespace MiHogar_App.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;

        public ApiService()
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("http://localhost:8080/")
            };
        }

        public async Task<List<Usuario>> GetUsuariosAsync()
        {
            var usuarios = await _httpClient.GetFromJsonAsync<List<Usuario>>("api/usuarios");
            return usuarios ?? new List<Usuario>();
        }
    }
}
