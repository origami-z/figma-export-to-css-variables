import { convertNaming } from '../utils'

describe("fixNaming", () => {
  test('removes / from name', () => {
    expect(convertNaming('a/b/c')).toEqual('--a-b-c');
  });
  test('works when subsection contains space', () => {
    expect(convertNaming('a/ b /c')).toEqual('--a-b-c');
  });
  test('works with number', () => {
    expect(convertNaming('red / 100')).toEqual('--red-100');
  });
  test('converts to lower case', () => {
    expect(convertNaming('RED / 100')).toEqual('--red-100');
  });
})