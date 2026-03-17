// Matthew Andrus IS415 Mission 11
// This file serves as the default sample weather model created by the ASP.NET template.
namespace Mission11_Andrus.API;

public class WeatherForecast
{
    // Keep the sample properties used by the starter template.
    public DateOnly Date { get; set; }

    public int TemperatureC { get; set; }

    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

    public string? Summary { get; set; }
}
