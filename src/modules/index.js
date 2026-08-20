import MLBasicsModule from "./MLBasicsModule.jsx";

// ─────────────────────────────────────────────
// 모듈 레지스트리
// 새 모듈을 추가하려면:
//  1) ./새모듈.jsx 파일을 만들고 default export 컴포넌트를 작성
//  2) 위에 import 추가
//  3) 아래 배열에 항목 추가 (status: "ready" | "planned")
// 나머지(홈 목록, 라우팅)는 자동으로 반영됨
// ─────────────────────────────────────────────

export const MODULES = [
  {
    id: "ml-basics",
    order: 1,
    title: "머신러닝 기초",
    subtitle: "데이터 · 모델 · 손실 · 학습",
    summary:
      "컴퓨터가 데이터를 숫자로 받아, 틀린 정도(손실)를 줄여가며 스스로 규칙을 찾는 과정을 직접 조작하며 확인합니다.",
    concepts: ["특징 벡터", "가중치", "손실 함수", "학습 반복"],
    status: "ready",
    component: MLBasicsModule,
  },
  {
    id: "supervised",
    order: 2,
    title: "지도학습 더 알아보기",
    subtitle: "정답이 있는 학습 · 일반화 · 편향",
    summary:
      "학습 데이터에만 잘 맞고 새 데이터에서 틀리는 현상(과적합)과, 편향된 데이터가 만드는 문제를 실험합니다.",
    concepts: ["학습/시험 데이터", "과적합", "데이터 편향"],
    status: "planned",
    component: null,
  },
  {
    id: "deep-learning",
    order: 3,
    title: "딥러닝",
    subtitle: "모델을 여러 층으로 쌓기",
    summary:
      "모듈 1의 계산 규칙을 여러 층으로 쌓으면 무엇이 달라지는지, 층이 늘어날수록 어떤 패턴까지 구분할 수 있는지 봅니다.",
    concepts: ["뉴런", "은닉층", "비선형", "역전파(개념)"],
    status: "planned",
    component: null,
  },
  {
    id: "reinforcement",
    order: 4,
    title: "강화학습",
    subtitle: "손실 대신 보상 최대화",
    summary:
      "정답을 알려주는 대신 잘하면 상, 못하면 벌을 주는 방식. 에이전트가 시행착오로 길을 찾아가는 과정을 관찰합니다.",
    concepts: ["상태", "행동", "보상", "시행착오"],
    status: "planned",
    component: null,
  },
];

export const getModule = (id) => MODULES.find((m) => m.id === id) || null;
