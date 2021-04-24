import { handleFileFromDir } from '../../src/utils';

// const mock = require('mock-fs');

// jest.mock('fs', () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       readdirSync: jest.fn()
//     };
//   });
// });

jest.mock('fs');

describe('test util index', () => {
  const MOCK_FILE_INFO = {
    '/test': 'test'
  };

  beforeEach(() => {
    require('fs').__setMockFiles(MOCK_FILE_INFO);
    // mock({
    //   '/test': {}
    // });
  });

  it('test handleFileFromDir empty', () => {
    // mock({
    //   '/test': {}
    // });
    const result = handleFileFromDir('/test');
    // mock.restore();
    expect(result).toEqual([]);
  });
});
