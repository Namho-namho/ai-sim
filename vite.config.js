import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 등 서브경로 배포 시 아래를 "/저장소이름/" 으로 변경
  base: "/",
});
