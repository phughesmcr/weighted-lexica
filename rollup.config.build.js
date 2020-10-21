import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const name = "Lexica";

export default {
  input: './src/lexicon.ts',

  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    typescript({
      include: [ "*.ts+(|x)", "**/*.ts+(|x)", "*.js+(|x)", "**/*.js+(|x)" ],
      exclude: [ "node_modules" ],
      clean: true,
      typescript: require("typescript"),
      useTsconfigDeclarationDir: true,
    }),
  ],

  output: {
    file: "build/lexicon.js",
    format: "es",
    sourcemap: true,
  },
};
