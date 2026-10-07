import { defineConfig } from "vite";
import release from "./src/release.js";

export default defineConfig({
  plugins: [{
    name: "zoma-release-manifest",
    configureServer(server) {
      server.middlewares.use("/release.json", (_request, response) => {
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(JSON.stringify(release));
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "release.json",
        source: `${JSON.stringify(release, null, 2)}\n`,
      });
    },
  }],
  server: {
    host: true,
    allowedHosts: true,
  },
});
