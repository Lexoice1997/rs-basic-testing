// Uncomment the code below and write your tests
import { mockOne, mockThree, mockTwo, unmockedFunction } from './index';

// jest.mock('./index', () => {
//   const originalModule =
//     jest.requireActual<typeof import('./index')>('./index');
// });

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const mockOneSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockTwoSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockThreeSpy = jest.spyOn(console, 'log').mockImplementation();

    expect(mockOneSpy).not.toHaveBeenCalled();
    expect(mockTwoSpy).not.toHaveBeenCalled();
    expect(mockThreeSpy).not.toHaveBeenCalled();

    mockOne();
    mockTwo();
    mockThree();

    expect(mockOneSpy).toHaveBeenCalledWith('foo');
    expect(mockTwoSpy).toHaveBeenCalledWith('bar');
    expect(mockThreeSpy).toHaveBeenCalledWith('baz');

    mockOneSpy.mockRestore();
    mockTwoSpy.mockRestore();
    mockThreeSpy.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const mockFunc = jest.spyOn(console, 'log');
    mockFunc.mockImplementation();
    unmockedFunction();

    expect(mockFunc).toHaveBeenCalledWith('I am not mocked');
  });
});
