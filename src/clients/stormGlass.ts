import { AxiosStatic } from 'axios';

export interface StormGlassSource {
  [key: string]: number;
}

export interface StormGlassPoint{
  readonly time: string;
  readonly waveHeight: StormGlassSource;
  readonly waveDirection: StormGlassSource;
  readonly swellDirection: StormGlassSource;
  readonly swellHeight: StormGlassSource;
  readonly swellPeriod: StormGlassSource;
  readonly windDirection: StormGlassSource;
  readonly windSpeed: StormGlassSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
} 

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 
    'noaa';
    
  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lon: number): Promise<ForecastPoint[]> {
    const response = await this.request.get<StormGlassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&end=1592113802`
    );
    
    return this.normalizeResponse(response.data);
  } 

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.
      filter(this.isValidPoint.bind(this))
      .map((point) => ({
        swellDirection: point.swellDirection[this.stormGlassAPISource],
        swellHeight: point.swellDirection[this.stormGlassAPISource],
        swellPeriod: point.swellDirection[this.stormGlassAPISource],
        time: point.time,
        waveDirection: point.swellDirection[this.stormGlassAPISource],
        waveHeight: point.swellDirection[this.stormGlassAPISource],
        windDirection: point.swellDirection[this.stormGlassAPISource],
        windSpeed: point.swellDirection[this.stormGlassAPISource],
      }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}