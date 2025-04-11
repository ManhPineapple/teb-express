import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (development or production)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Pass environment variables to the client
      "process.env": env,
    },
    build: {
      outDir: mode === "production" ? "dist/prod" : "dist/dev", // Separate output folders
    },
  };
});