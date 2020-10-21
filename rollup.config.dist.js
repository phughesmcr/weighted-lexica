import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const name = "Lexica";

export default {
  input: './src/lexicon.ts',

  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  treeshake: {
    moduleSideEffects: false,
  },

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({ include: 'node_modules/**' }),

    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ["src/**/*"],
      exclude: ["node_modules/**"],
    }),
  ],

  output: [{
    file: pkg.main,
    format: 'umd',
    name,
    sourcemap: 'inline'
  }, {
    file: pkg.module,
    format: 'es',
    sourcemap: 'inline',
  }, {
    file: pkg.browser,
    format: 'iife',
    name,
    sourcemap: 'inline',

    // https://rollupjs.org/guide/en#output-globals-g-globals
    globals: {},
  }],
};
