<!-- 제목은 커밋 컨벤션과 동일하게: 예) feat: add reinforcement learning module -->

## 무엇을 바꿨나요?

<!-- 이 PR이 하는 일을 2~3줄로 요약하세요. 관련 이슈가 있으면 "Closes #번호" 로 연결. -->

## 어떻게 확인했나요?

<!-- 직접 확인한 방법을 적으세요. 예: npm run dev 로 해당 화면 조작, npm run build 통과 등 -->

- [ ] `npm run dev` 로 로컬에서 동작 확인
- [ ] `npm run build` 통과 (에러 없음)

## 스크린샷 (UI 변경 시 필수)

<!-- UI가 바뀌었다면 변경 전/후 스크린샷 또는 화면 녹화를 첨부하세요. UI 변경이 없으면 "해당 없음". -->

## 체크리스트

- [ ] 커밋 메시지가 컨벤션(`feat:`/`fix:`/`docs:` …)을 따름
- [ ] 콘솔에 새로운 경고/에러가 없음
- [ ] **모바일 레이아웃(700px 이하)** 에서 깨지지 않음
- [ ] 키보드 포커스가 보이고, `prefers-reduced-motion` 을 존중함
- [ ] 새 npm 의존성을 추가했다면 **이유를 PR 본문에 설명**했고 승인받음 (CLAUDE.md)
- [ ] `localStorage`/`sessionStorage` 를 쓰지 않음, 상태 관리 라이브러리를 추가하지 않음 (CLAUDE.md)

### 새 모듈을 추가하는 PR이라면 추가로

- [ ] `src/modules/<이름>Module.jsx` 를 만들고 default export 컴포넌트 작성
- [ ] `src/modules/index.js` 의 `MODULES` 에 등록하고 `status: "ready"` 로 설정
- [ ] 홈 목록 카드가 활성화되고, 클릭 시 `#/module/<id>` 로 진입되는지 확인
- [ ] **데이터 → 모델 → 손실(또는 보상) → 학습** 4단계 뼈대를 따름 (CLAUDE.md)
- [ ] 기존 모듈의 학습 알고리즘을 바꾸지 않았음 (바꿨다면 사전 논의 완료)
