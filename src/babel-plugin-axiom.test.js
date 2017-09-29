import path from 'path';
import fs from 'fs';
import { transformFileSync } from 'babel-core';
import babelPluginAxiom from './babel-plugin-axiom';

const getFile = (test, type) => path.resolve(__dirname, `../test_fixtures/${test}_${type}.js`);
const getActualFile = (test) => getFile(test, 'actual');
const getExpectedFile = (test) => fs.readFileSync(getFile(test, 'expected')).toString().trim();

describe('babelPluginAxiom', () => {
  test('aliased imports', () => {
    expect(transformFileSync(getActualFile('alias'), {
      plugins: [babelPluginAxiom],
    }).code).toBe(getExpectedFile('alias'));
  });

  test('destructured imports', () => {
    expect(transformFileSync(getActualFile('destructure'), {
      plugins: [babelPluginAxiom],
    }).code).toBe(getExpectedFile('destructure'));
  });

  test('scoped imports', () => {
    expect(transformFileSync(getActualFile('scoped'), {
      plugins: [babelPluginAxiom],
    }).code).toBe(getExpectedFile('scoped'));
  });
});
