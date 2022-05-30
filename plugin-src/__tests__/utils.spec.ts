import { convertNaming, color1To255, getRgbStringFromFigmaColor, getHexStringFromFigmaColor } from '../utils'

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

  test("prefix is inserted", () => {
    expect(convertNaming('RED / 100', 'foo-')).toEqual('--foo-red-100');
  })
})

describe("color1To255", () => {
  test('0 to 0', () => {
    expect(color1To255(0)).toEqual(0);
  })
  test('1 to 255', () => {
    expect(color1To255(1)).toEqual(255);
  })
})

describe('getRgbStringFromFigmaColor', () => {
  test('converts 0,0,0', () => {
    expect(getRgbStringFromFigmaColor({ r: 0, g: 0, b: 0 } as RGB)).toEqual('rgb(0, 0, 0)')
  })
  test('converts 0.5,0.5,0.5', () => {
    expect(getRgbStringFromFigmaColor({ r: 0.5, g: 0.5, b: 0.5 } as RGB)).toEqual('rgb(128, 128, 128)')
  })
})


describe('getHexStringFromFigmaColor', () => {
  test('converts 0,0,0', () => {
    expect(getHexStringFromFigmaColor({ r: 0, g: 0, b: 0 } as RGB)).toEqual('#000000')
  })
  test('converts 0.5,0.5,0.5', () => {
    expect(getHexStringFromFigmaColor({ r: 0.5, g: 0.5, b: 0.5 } as RGB)).toEqual('#808080')
  })
  test('converts 1,1,1', () => {
    expect(getHexStringFromFigmaColor({ r: 1, g: 1, b: 1 } as RGB)).toEqual('#FFFFFF')
  })
})
