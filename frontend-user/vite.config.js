import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8081,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
});
