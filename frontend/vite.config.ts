import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  envDir: "../",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-router-dom")) return "router";
          if (id.includes("@azure/msal")) return "msal";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("react-hot-toast")) return "toast";
          if (id.includes("@hello-pangea/dnd")) return "dnd";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("axios")) return "axios";
          if (id.includes("zustand")) return "store";
          return "vendor";
        }
      }
    }
  },
  server: { port: 5173 },
  preview: { port: 4173 }
});
