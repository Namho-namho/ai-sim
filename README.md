# AI 학습 시뮬레이션 사이트

**직접 값을 바꿔보고 결과가 어떻게 달라지는지 눈으로 확인하며** AI 개념을 배우는
정적 웹사이트입니다. 설명을 읽기만 하는 대신, 슬라이더를 움직이고 학습이 돌아가는 과정을
관찰하면서 머신러닝 · 딥러닝 · 강화학습의 핵심 개념을 익힙니다.

- **대상**: 초중등 학생과 AI 비전공 성인. 수식을 쓰지 않고, 조작과 시각적 변화로 개념을 전달합니다.
- **왜 시뮬레이션인가**: PhET, TensorFlow Playground 같은
  *explorable explanation* 계열을 참고했습니다. 조작 → 숫자 변화 → 결과 변화가
  한 화면에서 동시에 보이도록 설계해, "만져보면서 이해"하는 학습을 목표로 합니다.
- 시뮬레이션은 미리 만든 애니메이션이 아니라 **실제 알고리즘**으로 동작합니다.
  (모듈 1의 학습은 실제 퍼셉트론 갱신식이며, 정의된 손실의 경사하강과 일치합니다.)

## 모든 모듈이 공유하는 뼈대

    데이터 → 모델 → 손실(또는 보상) → 학습

모든 모듈은 이 4단계 뼈대를 따릅니다.

| 단계 | 뜻 |
|------|-----|
| **데이터** | 특징을 잰 숫자 목록(벡터) + 정답 라벨 |
| **모델** | 파라미터(가중치·합격선)가 있는 계산 규칙 |
| **손실** | 지금 얼마나 틀렸는지를 숫자 하나로 잰 값 |
| **학습** | 손실이 줄어드는 방향으로 파라미터를 반복해서 고침 |

- **딥러닝**은 `모델` 단계가 커진 것(여러 층 쌓기)일 뿐, 나머지 단계는 그대로입니다.
- **강화학습**은 `손실`을 최소화하는 대신 `보상`을 최대화하는 것으로 바뀔 뿐, 뼈대는 같습니다.

> 자세한 설계 원칙(수식 금지, 함정 데이터 포함, 조작-결과 동시 노출 등)은
> [CLAUDE.md](CLAUDE.md)를 참고하세요.

## 시작하기

### 사전 요구사항

- **Node.js 18 이상** (Vite 5 요구 사항. 개발·검증은 Node 20에서 진행)
- npm (Node.js에 포함)
- 별도 서버·DB·환경변수 없음. 클론 후 아래 명령만 실행하면 됩니다.

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

실행 후 브라우저에서 **http://localhost:5173** 접속. 코드를 저장하면 자동으로 갱신(HMR)됩니다.

### 프로덕션 빌드

```bash
npm run build      # dist/ 에 정적 파일 생성
npm run preview    # 빌드 결과를 로컬에서 미리보기
```

### 배포

`dist/` 폴더 전체가 결과물입니다. 서버가 필요 없으므로 **Netlify · Vercel · GitHub Pages**
등 어떤 정적 호스팅에도 `dist/`를 올리면 됩니다.

- GitHub Pages처럼 **하위 경로**(`https://아이디.github.io/저장소이름/`)로 배포할 때는
  [vite.config.js](vite.config.js)의 `base` 값을 `"/저장소이름/"`으로 바꾼 뒤 다시 빌드하세요.
- 라우팅은 해시 방식(`#/module/ml-basics`)이라 새로고침해도 404가 나지 않습니다.

## 폴더 구조

```
ai-sim/
  index.html                진입 HTML. #root 에 앱을 마운트하고 src/main.jsx 로드
  vite.config.js            Vite 설정 (React 플러그인, 배포용 base 경로)
  package.json              스크립트(dev/build/preview)와 의존성
  CLAUDE.md                 설계 원칙 · 제약 (작업 전 필독)
  src/
    main.jsx                React 진입점. App 을 StrictMode 로 렌더
    App.jsx                 홈 화면(모듈 목록) + 해시 라우팅 분기
    index.css               전역 스타일 (색 변수, 포커스 표시, reduced-motion)
    useHashRoute.js         해시 라우팅 훅 (#/ → 홈, #/module/<id> → 모듈)
    modules/
      index.js              모듈 레지스트리. 새 모듈 등록 지점
      MLBasicsModule.jsx    모듈 1: 머신러닝 기초 (데이터·모델·손실·학습 4단계)
```

## 현재 구현 상태

[src/modules/index.js](src/modules/index.js)의 `MODULES` 배열 기준입니다.

| 순서 | id | 제목 | 상태 |
|------|-----|------|------|
| 1 | `ml-basics` | 머신러닝 기초 | ✅ 완료 (`ready`) |
| 2 | `supervised` | 지도학습 더 알아보기 | 🕒 계획 중 (`planned`) |
| 3 | `deep-learning` | 딥러닝 | 🕒 계획 중 (`planned`) |
| 4 | `reinforcement` | 강화학습 | 🕒 계획 중 (`planned`) |

`planned` 모듈은 홈 화면에 "준비 중"으로 흐리게 표시되고 클릭이 비활성화됩니다.

## 새 모듈 추가하는 법

모듈은 **레지스트리 한 곳에만 등록**하면 홈 목록과 라우팅에 자동으로 반영됩니다.
`App.jsx`는 수정할 필요가 없습니다.

### 1단계 — 컴포넌트 파일 작성

`src/modules/` 에 `<이름>Module.jsx` 를 만들고 default export 컴포넌트를 작성합니다.
상태는 `useState` / `useRef` / `useEffect` 만 사용하고, 스타일은 인라인 방식으로 맞춥니다.

```jsx
// src/modules/SupervisedModule.jsx
export default function SupervisedModule() {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 14px 60px" }}>
      <h1>지도학습 더 알아보기</h1>
      {/* 데이터 → 모델 → 손실 → 학습 뼈대에 맞춰 구성 */}
    </div>
  );
}
```

### 2단계 — 레지스트리에 등록

[src/modules/index.js](src/modules/index.js)에서 컴포넌트를 import 하고, 해당 항목의
`component`를 연결한 뒤 `status`를 `"ready"`로 바꿉니다. (새 모듈이면 `MODULES` 배열에
항목을 추가합니다.)

```js
import SupervisedModule from "./SupervisedModule.jsx";

export const MODULES = [
  // ...
  {
    id: "supervised",        // URL 이 #/module/supervised 가 됨 (고유해야 함)
    order: 2,                // 홈 목록 정렬 순서
    title: "지도학습 더 알아보기",
    subtitle: "정답이 있는 학습 · 일반화 · 편향",
    summary: "한 줄 설명…",
    concepts: ["학습/시험 데이터", "과적합", "데이터 편향"],  // 카드 하단 태그
    status: "ready",         // "ready" 로 바꾸면 홈에서 활성화됨
    component: SupervisedModule,
  },
];
```

### 3단계 — 확인

`npm run dev` 상태에서 홈 카드가 활성화되고, 카드를 누르면 `#/module/<id>` 로 이동해
컴포넌트가 뜨는지 확인합니다. (홈 카드·라우팅·"모듈 목록" 뒤로가기 버튼은 모두
레지스트리 기반으로 자동 처리됩니다.)

## 기여 규칙

팀원이 반드시 알아야 할 제약입니다. (전체 원칙은 [CLAUDE.md](CLAUDE.md) 참고)

- **상태 관리 라이브러리 금지.** `useState` / `useRef` / `useEffect` 만 사용합니다.
  Redux, Zustand 등 도입하지 않습니다.
- **`localStorage` / `sessionStorage` 사용 금지.** 환경에 따라 동작하지 않으므로
  상태는 메모리(React state)에만 둡니다.
- **라우팅은 해시 방식 고정.** react-router를 도입하지 않습니다 (정적 호스팅 호환).
- **스타일은 현재 인라인 방식.** Tailwind, CSS-in-JS 등으로 바꾸려면 먼저 논의하세요.
- **새 npm 의존성 추가 전 반드시 이유를 설명하고 승인받기.**
- **기존 모듈의 학습 알고리즘을 사용자 확인 없이 바꾸지 않기.**
- 모듈 제목은 브랜딩성 이름이 아니라 **개념 이름**을 씁니다. (예: "딥러닝")

## 기술 스택

- **Vite 5** + **React 18** — 서버 없는 정적 빌드
- 상태 관리 라이브러리 · CSS 프레임워크 · 라우터 라이브러리 없음 (의도적으로 최소 구성)

> 참고: `npm audit`에 esbuild/Vite 관련 취약점 경고가 뜰 수 있으나,
> 이는 **개발 서버에만** 해당하며 배포되는 정적 결과물에는 영향이 없습니다.
> 해결하려면 Vite 메이저 업그레이드(브레이킹 체인지)가 필요하므로 팀 논의 후 진행하세요.
