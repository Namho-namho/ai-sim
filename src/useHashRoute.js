import { useEffect, useState } from "react";

// 정적 배포(서버 없음)에서도 새로고침이 깨지지 않도록 해시 라우팅 사용
// "#/" → 홈, "#/module/ml-basics" → 모듈 상세
export function useHashRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, "");
  const [path, setPath] = useState(read);

  useEffect(() => {
    const onChange = () => {
      setPath(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = (to) => {
    window.location.hash = to.startsWith("/") ? to : `/${to}`;
  };

  return { path, navigate };
}
