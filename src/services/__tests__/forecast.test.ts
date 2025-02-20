import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponseFixture from '../../clients/__tests__/fixtures/stormglass_normalized_response_3_hours.json';
import { Forecast, Beach, BeachPosition, ForecastProcessingInternalError } from '../forecast';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;
  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    );

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id'
      },
    ];
    
    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 64.26,
            swellHeight: 64.26,
            swellPeriod: 64.26,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 64.26,
            waveHeight: 64.26,
            windDirection: 64.26,
            windSpeed: 64.26,
          },
        ],
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 123.41,
            swellHeight: 123.41,
            swellPeriod: 123.41,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 123.41,
            waveHeight: 123.41,
            windDirection: 123.41,
            windSpeed: 123.41,
          },
        ],
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 182.56,
            swellHeight: 182.56,
            swellPeriod: 182.56,
            time: '2020-04-26T02:00:00+00:00',
            waveDirection: 182.56,
            waveHeight: 182.56,
            windDirection: 182.56,
            windSpeed: 182.56,
          },
        ],
      },
    ];

    const forecast = new Forecast(mockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('should return an empty list when the beaches array is empty', async() => {
    const forecast = new Forecast;
    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });
  
  it('should throw internal processing error when something goes wrong during the rating proccess', async() => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id'
      },
    ];

    mockedStormGlassService.fetchPoints.mockRejectedValue(
      'Error fetching data'
    );
    
    const forecast = new Forecast(mockedStormGlassService);
    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    );
  });
});