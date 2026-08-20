import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages는 https://<계정>.github.io/ai-sim/ 처럼 하위 경로로 서비스됨.
// 그래서 "빌드(배포)" 때만 base 를 "/ai-sim/" 로 두고,
// 로컬 개발 서버(npm run dev, command === "serve")에는 영향이 없도록 "/" 를 유지한다.
// 저장소 이름이 바뀌면 아래 "/ai-sim/" 만 그에 맞게 고치면 됨.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/ai-sim/" : "/",
}));
