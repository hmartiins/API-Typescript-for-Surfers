import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HouresFixture from '../__tests__/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HouresFixture from '../__tests__/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it('should return the normalized forecast from the Storm service', async () => {
    const lat = -33.792726;
    const lon = 151.289824;

    mockedAxios.get.mockResolvedValue({
        data: stormGlassWeather3HouresFixture
      });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lon);
    expect(response).toEqual(stormGlassNormalized3HouresFixture);
  });

  it('should wxclude incomplete data points', async () => {
    const lat = -33.792726;
    const lon = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00'
        },
      ],
    };
    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lon);

    expect(response).toEqual([]);
  });

  it(
    'should get a generic error from StormGlass service when the request fail before reaching the serive',
    async () => {
      const lat = -33.792726;
      const lon = 151.289824;

      mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

      const stormGlass = new StormGlass(mockedAxios);

      await expect(stormGlass.fetchPoints(lat, lon)).rejects.toThrow(
        'Unexpectede error when trying to communicate to StormGlass: Network Error'
      );
    }
  );
});
