// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  interface User {
    id: number;
    name: string;
  }

  const firstClass: User[] = [
    { id: 1, name: 'Azamat' },
    { id: 2, name: 'Dawlet' },
  ];
  const secondClass: User[] = [
    { id: 3, name: 'Begis' },
    { id: 4, name: 'Islam' },
  ];

  const expectedLinkedList = {
    value: { id: 1, name: 'Azamat' },
    next: {
      value: { id: 2, name: 'Dawlet' },
      next: {
        value: null,
        next: null,
      },
    },
  };
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList(firstClass)).toStrictEqual(expectedLinkedList);
  });

  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(secondClass)).toMatchSnapshot();
  });
});
