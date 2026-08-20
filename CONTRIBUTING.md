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

## 브랜치 전략

팀 규모가 작으므로 **main + feature 브랜치 + PR** 만 씁니다. (git-flow 같은 복잡한 전략은 쓰지 않습니다.)

- **`main`** — 항상 배포 가능한 상태를 유지합니다. `main`에 푸시되면 자동으로 GitHub Pages에 배포됩니다.
  `main`에 직접 커밋하지 말고, 반드시 PR을 통해 병합합니다.
- **feature 브랜치** — 모든 작업은 `main`에서 새 브랜치를 따서 진행합니다. 이름은 커밋 타입을 접두사로 씁니다.

  ```
  feat/reinforcement-module
  fix/loss-curve-scaling
  docs/readme-deploy
  ```

### 작업 흐름

```bash
# 1) main 최신화 후 브랜치 생성
git switch main
git pull
git switch -c feat/my-feature

# 2) 작업 → 커밋 (컨벤션 준수)
git add -A
git commit -m "feat: add my feature"

# 3) 원격에 푸시하고 PR 생성
git push -u origin feat/my-feature
gh pr create        # 또는 GitHub 웹에서 Pull Request 생성
```

## PR(Pull Request) 절차

1. PR을 열면 [PR 템플릿](.github/pull_request_template.md)이 자동으로 채워집니다. 항목을 채우고 체크리스트를 확인합니다.
2. 팀원 **1명 이상의 리뷰**를 받고 승인되면 병합합니다.
3. 병합 방식은 **Squash and merge**를 권장합니다 (feature 브랜치의 잡다한 커밋을 하나로 정리).
4. 병합 후 feature 브랜치는 삭제합니다.
5. `main`에 병합되면 GitHub Actions가 자동으로 빌드·배포합니다. (Actions 탭에서 진행 상황 확인)
