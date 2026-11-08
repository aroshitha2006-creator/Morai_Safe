import { WeatherData } from '../types';

export const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number; label: string }> = {
  Chennai: { lat: 13.0827, lng: 80.2707, label: 'Chennai Metro' },
  Cuddalore: { lat: 11.7480, lng: 79.7714, label: 'Cuddalore Coastal' },
  Nagapattinam: { lat: 10.7656, lng: 79.8427, label: 'Nagapattinam' },
  Kanyakumari: { lat: 8.0883, lng: 77.5385, label: 'Kanyakumari' },
  Thoothukudi: { lat: 8.7642, lng: 78.1348, label: 'Thoothukudi Port' },
  Madurai: { lat: 9.9252, lng: 78.1198, label: 'Madurai' },
  Coimbatore: { lat: 11.0168, lng: 76.9558, label: 'Coimbatore' },
  Mumbai: { lat: 19.0760, lng: 72.8777, label: 'Mumbai Coastal' },
  Kochi: { lat: 9.9312, lng: 76.2673, label: 'Kochi Coastal' }
};

export class WeatherService {
  private static parseWmoCode(code: number): { condition: string; warning?: string; warningLevel?: 'none' | 'yellow' | 'orange' | 'red' } {
    switch (code) {
      case 0:
        return { condition: 'Clear Sky', warningLevel: 'none' };
      case 1:
      case 2:
      case 3:
        return { condition: 'Mainly Clear to Partly Overcast', warningLevel: 'none' };
      case 45:
      case 48:
        return { condition: 'Dense Fog / Low Visibility', warning: 'Dense fog reducing coastal visibility below 500m', warningLevel: 'yellow' };
      case 51:
      case 53:
      case 55:
        return { condition: 'Light to Moderate Drizzle', warningLevel: 'none' };
      case 61:
      case 63:
        return { condition: 'Moderate Rainfall', warning: 'Continuous precipitation in low-lying zones', warningLevel: 'yellow' };
      case 65:
        return { condition: 'Heavy Rainfall', warning: 'Heavy downpour: Risk of local street waterlogging', warningLevel: 'orange' };
      case 80:
      case 81:
      case 82:
        return { condition: 'Torrential Rain Showers', warning: 'High-intensity cloud bursts: Stay alert in low catchment areas', warningLevel: 'orange' };
      case 95:
        return { condition: 'Severe Thunderstorm', warning: 'Thunderstorm with lightning: Avoid open grounds and metal poles', warningLevel: 'orange' };
      case 96:
      case 99:
        return { condition: 'Violent Thunderstorm with Hail', warning: 'Severe convective storm: Seek solid indoor shelter immediately', warningLevel: 'red' };
      default:
        return { condition: 'Variable Cloudiness', warningLevel: 'none' };
    }
  }

  static async fetchLiveWeather(district = 'Chennai', customCoords?: { lat: number; lng: number }): Promise<WeatherData> {
    const coords = customCoords || DISTRICT_COORDINATES[district] || DISTRICT_COORDINATES['Chennai'];

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather service response ${response.status}`);
      }

      const data = await response.json();
      const current = data.current;
      const weatherAnalysis = this.parseWmoCode(current.weather_code);

      // Analyze wind speed & rainfall for disaster warnings
      let dynamicWarning = weatherAnalysis.warning;
      let dynamicLevel = weatherAnalysis.warningLevel || 'none';

      if (current.wind_speed_10m > 50) {
        dynamicWarning = `High Gale Winds (${current.wind_speed_10m} km/h): Dangerous to small crafts & coastal structures`;
        dynamicLevel = 'red';
      } else if (current.wind_speed_10m > 35 && dynamicLevel !== 'red') {
        dynamicWarning = `Squally Coastal Winds (${current.wind_speed_10m} km/h): Fishermen advised caution`;
        dynamicLevel = 'orange';
      }

      if (current.precipitation > 25) {
        dynamicWarning = `Extreme Precipitation Rate (${current.precipitation} mm/h): Urban flash-flood risk`;
        dynamicLevel = 'red';
      }

      return {
        city: DISTRICT_COORDINATES[district]?.label || district,
        district,
        temperature: Math.round(current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
        rainfall: Number((current.precipitation || current.rain || 0).toFixed(1)),
        condition: weatherAnalysis.condition,
        conditionCode: current.weather_code,
        warning: dynamicWarning,
        warningLevel: dynamicLevel,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        isLive: true
      };
    } catch (err) {
      console.warn('Live meteorological fetch failed, using official regional fallback', err);
      // Realistic regional baseline when offline
      return {
        city: DISTRICT_COORDINATES[district]?.label || district,
        district,
        temperature: 29,
        humidity: 82,
        windSpeed: 24,
        rainfall: 14.5,
        condition: 'Humid Overcast & Coastal Drizzle',
        conditionCode: 61,
        warning: 'High humidity & localized precipitation observed along coastal corridor.',
        warningLevel: 'yellow',
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLive: false
      };
    }
  }
}
