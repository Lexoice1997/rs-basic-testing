// Uncomment the code below and write your tests
import axios, { AxiosResponse } from 'axios';
import { THROTTLE_TIME, throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.mock('axios');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(
      Promise.resolve({ data: { message: 'success' } } as AxiosResponse<{
        message: string;
      }>),
    );

    const result = throttledGetDataFromApi('/test');
    jest.advanceTimersByTime(THROTTLE_TIME);

    await expect(result).resolves.toEqual({ message: 'success' });
    expect(axios.get).toHaveBeenCalledWith('/test', expect.any(Object));
  });

  test('should perform request to correct provided url', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(
      Promise.resolve({ data: { data: 'test' } } as AxiosResponse<{
        data: string;
      }>),
    );

    const result = throttledGetDataFromApi('/test-endpoint');
    jest.advanceTimersByTime(THROTTLE_TIME);

    await expect(result).resolves.toEqual({ data: 'test' });
    expect(axios.get).toHaveBeenCalledWith(
      '/test-endpoint',
      expect.any(Object),
    );
  });

  test('should return response data', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(
      Promise.resolve({ data: { key: 'value' } } as AxiosResponse<{
        key: string;
      }>),
    );

    const result = throttledGetDataFromApi('/data');
    jest.advanceTimersByTime(THROTTLE_TIME);

    await expect(result).resolves.toEqual({ key: 'value' });
  });
});
