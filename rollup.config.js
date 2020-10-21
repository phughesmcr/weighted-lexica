import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import dts from "rollup-plugin-dts";
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const name = "Lexica";

export default [
  {
    input: './src/lexicon.ts',

    // https://rollupjs.org/guide/en#external-e-external
    external: [],
    // external: (id) => !/^[./]/.test(id),

    plugins: [
      // Allows node_modules resolution
      resolve({ extensions }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs({ include: 'node_modules/**' }),

      // Compile TypeScript/JavaScript files
      typescript({
        include: [ "*.ts+(|x)", "**/*.ts+(|x)", "*.js+(|x)", "**/*.js+(|x)" ],
        exclude: [ "node_modules" ],
        clean: true,
        typescript: require("typescript"),
        tslib: require('tslib')
      }),
    ],

    output: {
      file: pkg.jsnext,
      format: "es",
      sourcemap: true,
    },
  },
  {
    input: "./types/lexicon.d.ts",
    output: [{ file: "./build/lexicon.d.ts", format: "es" }],
    plugins: [dts()],
  },
  {
    input: './src/lexicon.ts',

    external: [],
    // external: (id) => !/^[./]/.test(id),

    treeshake: {
      moduleSideEffects: false,
    },

    plugins: [
      resolve({ extensions }),

      commonjs({ include: 'node_modules/**' }),

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

      globals: {},
    }],
  },
  {
    input: "build/lexicon.d.ts",
    output: [{ file: pkg.types, format: "es" }],
    plugins: [dts()],
  },
];
