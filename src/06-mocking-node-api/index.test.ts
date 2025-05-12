// Uncomment the code below and write your tests
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

const callback = (): null => null;
let interval: number;
const timeout = (interval = 1000);

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  let spyTimeout: jest.SpyInstance;

  beforeAll(() => jest.useFakeTimers());
  beforeEach(() => (spyTimeout = jest.spyOn(global, 'setTimeout')));
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.useRealTimers());

  test('should set timeout with provided callback and timeout', () => {
    doStuffByTimeout(callback, timeout);
    expect(spyTimeout).toBeCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const mockCallback: jest.Mock = jest.fn(callback);

    doStuffByTimeout(mockCallback, timeout);
    expect(mockCallback).not.toBeCalled();

    jest.advanceTimersByTime(timeout);
    expect(mockCallback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let spyInterval: jest.SpyInstance;

  beforeAll(() => jest.useFakeTimers());
  beforeEach(() => (spyInterval = jest.spyOn(global, 'setInterval')));
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.useRealTimers());

  test('should set interval with provided callback and timeout', () => {
    doStuffByInterval(callback, interval);
    expect(spyInterval).toBeCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCallback: jest.Mock = jest.fn(callback);

    doStuffByInterval(mockCallback, timeout);
    expect(mockCallback).not.toBeCalled();

    jest.advanceTimersByTime(timeout);
    expect(mockCallback).toBeCalledTimes(1);
  });
});

describe('readFileAsynchronously', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const joinMock = jest
      .spyOn(path, 'join')
      .mockReturnValue('/mocked/full/path');
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await readFileAsynchronously('test.txt');

    expect(joinMock).toHaveBeenCalledWith(__dirname, 'test.txt');
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(path, 'join').mockReturnValue('/mocked/path.txt');
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const result = await readFileAsynchronously('non-existent.txt');

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(path, 'join').mockReturnValue('/mocked/path.txt');
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest
      .spyOn(fsPromises, 'readFile')
      .mockResolvedValue(Buffer.from('mock file content'));

    const result = await readFileAsynchronously('file.txt');

    expect(result).toBe('mock file content');
  });
});
