import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  target: "es2018",
  external: ["react", "react-dom"],
});

