# 기여 가이드

이 문서는 팀 협업 규칙을 정리합니다. 프로젝트 **설계 원칙과 제약**은 [CLAUDE.md](CLAUDE.md),
실행·구조는 [README.md](README.md)를 참고하세요.

## 커밋 메시지 컨벤션

`<타입>: <한 줄 요약>` 형식으로, **요약은 영어 현재형**으로 씁니다.

```
feat: add reinforcement learning module
fix: correct loss curve scaling on retina screens
docs: update deployment steps in README
```

### 타입

| 타입 | 쓰는 경우 |
|------|-----------|
| `feat` | 새 기능 · 새 모듈 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서만 변경 (README, CONTRIBUTING, 주석 등) |
| `style` | 동작 변화 없는 포맷팅 (들여쓰기, 세미콜론 등) |
| `refactor` | 동작 변화 없는 코드 구조 개선 |
| `chore` | 빌드 설정·의존성·기타 잡무 |

### 규칙

- 한 커밋은 한 가지 논리적 변경만 담습니다.
- 요약은 50자 이내, 마침표 없이. 자세한 설명이 필요하면 본문에 빈 줄 뒤 작성합니다.
- 학습 알고리즘을 바꾸는 커밋은 반드시 본문에 **왜 바꿨는지**를 적습니다.
  (CLAUDE.md: 학습 알고리즘 변경은 사전 논의 필요)
