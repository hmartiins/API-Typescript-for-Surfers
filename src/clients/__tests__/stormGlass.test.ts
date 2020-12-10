import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HouresFixture from '../__tests__/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HouresFixture from '../__tests__/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockerAxios = axios as jest.Mocked<typeof axios>;
  it('should return the normalized forecast from the Storm service', async () => {
    const lat = -33.792726;
    const lon = 151.289824;

    mockerAxios.get.mockResolvedValue({
        data: stormGlassWeather3HouresFixture
      });

    const stormGlass = new StormGlass(mockerAxios);
    const response = await stormGlass.fetchPoints(lat, lon);
    expect(response).toEqual(stormGlassNormalized3HouresFixture);
  });
});
