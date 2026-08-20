import { MODULES, getModule } from "./modules/index.js";
import { useHashRoute } from "./useHashRoute.js";

const ink = "#1c2536";
const sub = "#69758c";
const line = "#dde3ee";
const blue = "#3563e9";

function Home({ navigate }) {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 16px 80px" }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: ink }}>
          직접 만져보며 배우는 AI
        </h1>
        <p style={{ fontSize: 15, color: sub, lineHeight: 1.8, margin: 0, maxWidth: 620 }}>
          설명을 읽는 대신 직접 값을 바꿔보고, 결과가 어떻게 달라지는지 눈으로 확인하는 방식으로
          AI의 개념을 배웁니다. 수학을 몰라도 괜찮아요.
        </p>
      </header>

      <div
        style={{
          padding: "16px 18px",
          background: "#fff",
          border: `1px solid ${line}`,
          borderRadius: 10,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: ink, marginBottom: 6 }}>
          모든 모듈이 공유하는 뼈대
        </div>
        <div style={{ fontSize: 13.5, color: sub, lineHeight: 1.8 }}>
          데이터 → 모델 → 손실(또는 보상) → 학습. 딥러닝은 <b>모델</b>이 커진 것이고, 강화학습은{" "}
          <b>손실</b>이 보상으로 바뀐 것일 뿐, 뼈대는 같습니다.
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {[...MODULES].sort((a, b) => a.order - b.order).map((m) => {
          const ready = m.status === "ready";
          return (
            <button
              key={m.id}
              onClick={() => ready && navigate(`/module/${m.id}`)}
              disabled={!ready}
              style={{
                textAlign: "left",
                background: "#fff",
                border: `1px solid ${line}`,
                borderRadius: 10,
                padding: 18,
                cursor: ready ? "pointer" : "default",
                opacity: ready ? 1 : 0.55,
                font: "inherit",
                display: "block",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: sub }}>모듈 {m.order}</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: ink }}>{m.title}</span>
                <span style={{ fontSize: 13, color: sub }}>{m.subtitle}</span>
                {!ready && (
                  <span
                    style={{
                      fontSize: 11,
                      color: sub,
                      border: `1px solid ${line}`,
                      borderRadius: 99,
                      padding: "2px 8px",
                    }}
                  >
                    준비 중
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13.5, color: sub, lineHeight: 1.7, margin: "8px 0 10px" }}>
                {m.summary}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {m.concepts.map((c) => (
                  <span
                    key={c}
                    style={{
                      fontSize: 11.5,
                      color: ink,
                      background: "#f5f7fb",
                      borderRadius: 6,
                      padding: "3px 8px",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ModulePage({ id, navigate }) {
  const m = getModule(id);
  if (!m || !m.component) {
    return (
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "60px 16px" }}>
        <p style={{ fontSize: 15, color: ink }}>아직 준비되지 않은 모듈입니다.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 12,
            padding: "8px 16px",
            borderRadius: 8,
            border: `1px solid ${line}`,
            background: "#fff",
            cursor: "pointer",
            fontSize: 13.5,
          }}
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }
  const Comp = m.component;
  return (
    <div>
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "16px 16px 0",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: `1px solid ${line}`,
            background: "#fff",
            cursor: "pointer",
            fontSize: 13,
            color: blue,
          }}
        >
          ← 모듈 목록
        </button>
      </div>
      <Comp />
    </div>
  );
}

export default function App() {
  const { path, navigate } = useHashRoute();
  const match = path.match(/^module\/(.+)$/);
  if (match) return <ModulePage id={match[1]} navigate={navigate} />;
  return <Home navigate={navigate} />;
}
