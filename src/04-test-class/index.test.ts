// Uncomment the code below and write your tests
import { random } from 'lodash';
import { getBankAccount, SynchronizationFailedError } from '.';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(10000);
    expect(bankAccount.getBalance()).toBe(10000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(10000);
    expect(() => bankAccount.withdraw(11000)).toThrowError(
      'Insufficient funds: cannot withdraw more than 10000',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount = getBankAccount(10000);
    const secondBankAccount = getBankAccount(10000);
    expect(() => bankAccount.transfer(11000, secondBankAccount)).toThrowError(
      'Insufficient funds: cannot withdraw more than 10000',
    );
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(10000);
    expect(() => bankAccount.transfer(11000, bankAccount)).toThrowError(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(10000);
    bankAccount.deposit(10000);
    expect(bankAccount.getBalance()).toBe(20000);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(10000);
    bankAccount.withdraw(10000);
    expect(bankAccount.getBalance()).toBe(0);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(10000);
    const secondBankAccount = getBankAccount(10000);
    secondBankAccount.transfer(10000, bankAccount);
    expect(secondBankAccount.getBalance()).toBe(0);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount = getBankAccount(10000);

    (random as jest.Mock).mockReturnValue(1_000);

    const result = random(1, 1_000);

    const fetchedBalance: number | null = await bankAccount.fetchBalance();

    expect(fetchedBalance).not.toBeNull();
    expect(result).toBe(1_000);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(10000);
    const mockBalance = 50_000;

    const fetchBalanceMock = jest
      .spyOn(bankAccount, 'fetchBalance')
      .mockResolvedValue(mockBalance);

    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toStrictEqual(mockBalance);
    fetchBalanceMock.mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(10000);
    const fetchBalanceMock = jest
      .spyOn(bankAccount, 'fetchBalance')
      .mockResolvedValue(null);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
    fetchBalanceMock.mockRestore();
  });
});
