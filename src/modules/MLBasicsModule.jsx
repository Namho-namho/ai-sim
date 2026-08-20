import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
// 모듈 1: 머신러닝 기초 (분류)
// 뼈대: 데이터 → 모델 → 손실 → 학습
// 이 4단계 뼈대는 이후 딥러닝/강화학습 모듈에서도 재사용
// ─────────────────────────────────────────────

const FEATURES = ["뾰족한 귀", "긴 수염", "긴 꼬리", "작은 몸집", "동그란 얼굴"];

// 예제 데이터셋: 고양이 분류 (feats: 각 특징의 뚜렷함 0~1)
const DATA = [
  { name: "고양이", emoji: "🐱", feats: [1.0, 1.0, 1.0, 1.0, 1.0], label: 1 },
  { name: "검은 고양이", emoji: "🐈‍⬛", feats: [1.0, 1.0, 1.0, 1.0, 0.9], label: 1 },
  { name: "아기 고양이", emoji: "🐈", feats: [1.0, 0.8, 0.9, 1.0, 1.0], label: 1 },
  { name: "강아지", emoji: "🐶", feats: [0.4, 0.3, 0.8, 0.7, 0.8], label: 0 },
  { name: "여우", emoji: "🦊", feats: [1.0, 0.4, 1.0, 0.5, 0.5], label: 0 },
  { name: "토끼", emoji: "🐰", feats: [0.8, 0.9, 0.1, 1.0, 0.9], label: 0 },
  { name: "호랑이", emoji: "🐯", feats: [1.0, 1.0, 1.0, 0.0, 0.6], label: 0 },
  { name: "쥐", emoji: "🐭", feats: [0.5, 1.0, 0.9, 1.0, 0.7], label: 0 },
  { name: "곰", emoji: "🐻", feats: [0.6, 0.0, 0.2, 0.0, 1.0], label: 0 },
  { name: "개구리", emoji: "🐸", feats: [0.0, 0.0, 0.0, 1.0, 0.7], label: 0 },
];

const score = (w, x) => w.reduce((s, wi, i) => s + wi * x[i], 0);
const predict = (w, thr, x) => (score(w, x) >= thr ? 1 : 0);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// 손실 함수: 맞으면 벌점 0, 틀리면 벌점 = |점수 - 합격선|
// (perceptron criterion — 3단계 학습 규칙은 이 손실의 경사하강과 일치)
const penalty = (w, thr, d) => {
  const s = score(w, d.feats);
  const pred = s >= thr ? 1 : 0;
  return pred === d.label ? 0 : Math.abs(s - thr);
};
const totalLoss = (w, thr) => DATA.reduce((s, d) => s + penalty(w, thr, d), 0);
const wrongCount = (w, thr) =>
  DATA.filter((d) => predict(w, thr, d.feats) !== d.label).length;

// ── 스타일 (담백하게) ─────────────────────────

const ink = "#1c2536";
const sub = "#69758c";
const line = "#dde3ee";
const bg = "#f5f7fb";
const blue = "#3563e9";
const red = "#d64560";
const green = "#1f9d6b";

const card = {
  background: "#fff",
  border: `1px solid ${line}`,
  borderRadius: 10,
  padding: 18,
};
const h2 = { fontSize: 17, fontWeight: 700, color: ink, margin: "0 0 6px" };
const desc = { fontSize: 13.5, color: sub, lineHeight: 1.7, margin: "0 0 14px" };
const btn = (active) => ({
  padding: "7px 14px",
  borderRadius: 8,
  border: `1px solid ${active ? blue : line}`,
  background: active ? blue : "#fff",
  color: active ? "#fff" : ink,
  fontSize: 13.5,
  cursor: "pointer",
});

// ── 공용 컴포넌트 ─────────────────────────────

function Bar({ value, max = 1, color = blue }) {
  return (
    <div style={{ height: 8, background: bg, borderRadius: 4, overflow: "hidden" }}>
      <div
        style={{
          width: `${clamp((value / max) * 100, 0, 100)}%`,
          height: "100%",
          background: color,
          transition: "width .3s",
        }}
      />
    </div>
  );
}

function DataPicker({ idx, setIdx }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {DATA.map((d, i) => (
        <button key={d.name} onClick={() => setIdx(i)} style={btn(i === idx)} title={d.name}>
          {d.emoji} {d.name}
        </button>
      ))}
    </div>
  );
}

function WeightSliders({ w, thr, setW, setThr, locked, deltas }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {FEATURES.map((name, i) => (
        <div
          key={name}
          style={{ display: "grid", gridTemplateColumns: "110px 1fr 64px", gap: 10, alignItems: "center" }}
        >
          <span style={{ fontSize: 13, color: ink }}>{name}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={w[i]}
            disabled={locked}
            onChange={(e) => setW && setW(i, parseFloat(e.target.value))}
            style={{ accentColor: blue }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, textAlign: "right", color: ink }}>
            {w[i].toFixed(1)}
            {deltas && deltas[i] !== 0 && (
              <span style={{ color: deltas[i] > 0 ? green : red, marginLeft: 3 }}>
                {deltas[i] > 0 ? "▲" : "▼"}
              </span>
            )}
          </span>
        </div>
      ))}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "110px 1fr 64px",
          gap: 10,
          alignItems: "center",
          borderTop: `1px dashed ${line}`,
          paddingTop: 10,
        }}
      >
        <span style={{ fontSize: 13, color: red, fontWeight: 600 }}>합격선</span>
        <input
          type="range"
          min={1}
          max={40}
          step={0.5}
          value={thr}
          disabled={locked}
          onChange={(e) => setThr && setThr(parseFloat(e.target.value))}
          style={{ accentColor: red }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, textAlign: "right", color: red }}>{thr.toFixed(1)}</span>
      </div>
    </div>
  );
}

function ResultGrid({ w, thr, highlightIdx = -1, showPenalty = false }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: 6 }}>
      {DATA.map((d, i) => {
        const pred = predict(w, thr, d.feats);
        const ok = pred === d.label;
        const pen = penalty(w, thr, d);
        return (
          <div
            key={d.name}
            style={{
              textAlign: "center",
              padding: "8px 4px",
              borderRadius: 8,
              border: `2px solid ${i === highlightIdx ? ink : ok ? "#cdeadd" : "#f2c4cd"}`,
              background: ok ? "#effaf4" : "#fdf0f2",
            }}
          >
            <div style={{ fontSize: 22 }}>{d.emoji}</div>
            <div style={{ fontSize: 11, color: ink }}>{d.name}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: ok ? green : red }}>
              {pred ? "고양이" : "아님"} {ok ? "○" : "✕"}
            </div>
            {showPenalty && (
              <div style={{ fontSize: 11, color: pen > 0 ? red : sub }}>벌점 {pen.toFixed(1)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── 1단계: 데이터 ─────────────────────────────

function StepData() {
  const [idx, setIdx] = useState(0);
  const d = DATA[idx];
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <h2 style={h2}>1. 데이터 — 컴퓨터는 숫자만 볼 수 있어요</h2>
        <p style={desc}>
          컴퓨터는 그림을 우리처럼 보지 못해요. 그래서 각 데이터의 특징을 숫자로 잰 <b>숫자 목록(벡터)</b>으로
          바꿔서 넣어줘요. 아래에서 데이터를 하나씩 눌러 확인해 보세요. 여기서는 "고양이인지 맞히기"를 예제로 써요.
        </p>
        <DataPicker idx={idx} setIdx={setIdx} />
      </div>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 40 }}>{d.emoji}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: ink }}>{d.name}</div>
            <div style={{ fontSize: 12, color: sub }}>정답 라벨: {d.label ? "고양이 (1)" : "고양이 아님 (0)"}</div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {FEATURES.map((name, i) => (
            <div key={name} style={{ display: "grid", gridTemplateColumns: "110px 1fr 40px", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: ink }}>{name}</span>
              <Bar value={d.feats[i]} />
              <span style={{ fontSize: 13, color: blue, fontWeight: 600, textAlign: "right" }}>{d.feats[i].toFixed(1)}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: bg,
            borderRadius: 8,
            fontFamily: "monospace",
            fontSize: 14,
            color: ink,
          }}
        >
          입력 x = [ {d.feats.map((v) => v.toFixed(1)).join(", ")} ] , 정답 y = {d.label}
        </div>
        <p style={{ ...desc, margin: "10px 0 0" }}>
          이렇게 (입력 x, 정답 y) 쌍이 여러 개 모인 것이 <b>학습 데이터</b>예요. 정답이 함께 있으니
          이런 방식을 <b>지도학습</b>이라고 불러요. 진짜 AI는 특징 5개가 아니라 픽셀 수백만 개를 숫자로 받아요.
        </p>
      </div>
    </div>
  );
}

// ── 2단계: 모델 ───────────────────────────────

function StepModel({ w, thr, setW, setThr }) {
  const [idx, setIdx] = useState(0);
  const d = DATA[idx];
  const s = score(w, d.feats);
  const pred = s >= thr ? 1 : 0;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <h2 style={h2}>2. 모델 — 숫자를 받아서 답을 내는 계산 규칙</h2>
        <p style={desc}>
          가장 단순한 모델은 이렇게 계산해요: <b>각 특징 × 중요도(가중치)를 전부 더한 점수</b>가 합격선을 넘으면
          "고양이"라고 답해요. 아직 학습 전이니, 중요도와 합격선을 직접 움직여서 모델이 어떻게 변하는지 보세요.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 18 }}>
          <WeightSliders w={w} thr={thr} setW={setW} setThr={setThr} />
          <div>
            <DataPicker idx={idx} setIdx={setIdx} />
            <div style={{ marginTop: 12, display: "grid", gap: 4, fontSize: 13, color: ink }}>
              {FEATURES.map((name, i) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "3px 8px", background: i % 2 ? "#fff" : bg, borderRadius: 4 }}>
                  <span>
                    {name} {d.feats[i].toFixed(1)} × 중요도 {w[i].toFixed(1)}
                  </span>
                  <b>{(d.feats[i] * w[i]).toFixed(1)}</b>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", borderTop: `1px solid ${line}`, fontWeight: 700 }}>
                <span>점수 합계</span>
                <span style={{ color: blue }}>{s.toFixed(1)}</span>
              </div>
              <div style={{ padding: "6px 8px", fontSize: 13 }}>
                점수 {s.toFixed(1)} {s >= thr ? "≥" : "<"} 합격선 {thr.toFixed(1)} →{" "}
                <b style={{ color: pred ? blue : sub }}>{pred ? "고양이!" : "고양이 아님"}</b>{" "}
                <span style={{ color: pred === d.label ? green : red, fontWeight: 700 }}>
                  ({pred === d.label ? "정답" : "오답"})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: ink, marginBottom: 10 }}>
          지금 모델의 판정 결과 (틀린 데이터 {wrongCount(w, thr)}개)
        </div>
        <ResultGrid w={w} thr={thr} />
        <p style={{ ...desc, margin: "10px 0 0" }}>
          모델 = 계산 규칙 + <b>조절 가능한 숫자들(가중치, 합격선)</b>. 이 조절 가능한 숫자들을{" "}
          <b>파라미터</b>라고 해요. 학습이란 결국 이 파라미터를 좋은 값으로 맞추는 일이에요.
        </p>
      </div>
    </div>
  );
}

// ── 3단계: 손실 함수 ──────────────────────────

function StepLoss({ w, thr, setW, setThr }) {
  const loss = totalLoss(w, thr);
  const wrong = wrongCount(w, thr);
  const [best, setBest] = useState(null);
  useEffect(() => {
    setBest((b) => (b === null || loss < b ? loss : b));
  }, [loss]);
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <h2 style={h2}>3. 손실 함수 — "얼마나 틀렸는지"를 숫자 하나로 재기</h2>
        <p style={desc}>
          모델을 고치려면 먼저 <b>지금 얼마나 틀렸는지</b>를 잴 수 있어야 해요. 그 측정 기준이{" "}
          <b>손실 함수</b>예요. 여기서는 아주 단순하게 정했어요:
          맞힌 데이터는 <b>벌점 0</b>, 틀린 데이터는 <b>벌점 = 점수가 합격선에서 잘못 벗어난 거리</b>.
          모든 벌점을 더한 것이 <b>손실</b>이에요. 손실이 0이면 완벽, 클수록 나쁜 모델이에요.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
          <div style={{ flex: 1, minWidth: 200, padding: 14, background: bg, borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: sub }}>현재 손실 (벌점 총합)</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: loss === 0 ? green : red }}>{loss.toFixed(1)}</div>
            <Bar value={loss} max={40} color={loss === 0 ? green : red} />
          </div>
          <div style={{ flex: 1, minWidth: 160, padding: 14, background: bg, borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: sub }}>틀린 데이터 수</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: ink }}>{wrong} / 10</div>
          </div>
          <div style={{ flex: 1, minWidth: 160, padding: 14, background: bg, borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: sub }}>내 최고 기록 (최저 손실)</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: blue }}>{best === null ? "-" : best.toFixed(1)}</div>
          </div>
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: ink, marginBottom: 4 }}>
          도전: 슬라이더를 움직여서 손실을 0으로 만들어 보세요
        </div>
        <p style={desc}>
          슬라이더를 조금만 움직여도 손실이 실시간으로 변해요. 손실이 <b>줄어드는 방향</b>으로 조금씩 움직이는 게 요령이에요
          — 다음 단계에서 컴퓨터가 하는 일이 정확히 이거예요.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 18 }}>
          <WeightSliders w={w} thr={thr} setW={setW} setThr={setThr} />
          <ResultGrid w={w} thr={thr} showPenalty />
        </div>
        {loss === 0 && (
          <div style={{ marginTop: 12, padding: "10px 12px", background: "#effaf4", border: `1px solid ${green}`, borderRadius: 8, fontSize: 13.5, color: ink }}>
            손실 0 달성! 그런데 손으로 하니까 꽤 힘들죠? 특징이 5개가 아니라 수백만 개라면 사람은 절대 못 해요.
            그래서 다음 단계, <b>학습</b>이 필요해요.
          </div>
        )}
      </div>
    </div>
  );
}

// ── 4단계: 학습 ───────────────────────────────

const INIT = {
  w: [5, 5, 5, 5, 5],
  thr: 15,
  idx: 0,
  epoch: 1,
  deltas: [0, 0, 0, 0, 0],
  msg: "「학습 시작」을 누르면 데이터를 한 개씩 보며 파라미터를 고쳐요.",
  lossHist: [],
  done: false,
};

function StepTrain() {
  const [t, setT] = useState(INIT);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(600);
  const timer = useRef(null);
  const LR = 1.2;

  const tick = () =>
    setT((prev) => {
      if (prev.done) return prev;
      const d = DATA[prev.idx];
      const s = score(prev.w, d.feats);
      const pred = s >= prev.thr ? 1 : 0;
      let { w, thr } = prev;
      let deltas = [0, 0, 0, 0, 0];
      let msg;
      if (pred === d.label) {
        msg = `${d.emoji} ${d.name}: 정답 → 벌점 0, 파라미터 그대로.`;
      } else {
        const err = d.label - pred; // +1: 고양이를 놓침 / -1: 잘못 고양이라 함
        deltas = d.feats.map((x) => LR * err * x);
        w = w.map((wi, i) => clamp(wi + deltas[i], 0, 10));
        thr = clamp(thr - err * LR, 1, 40);
        msg =
          err > 0
            ? `${d.emoji} ${d.name}: 고양이를 놓쳤어요(벌점 ${Math.abs(s - prev.thr).toFixed(1)}) → 이 데이터가 가진 특징의 중요도를 올림(▲).`
            : `${d.emoji} ${d.name}: 고양이가 아닌데 고양이라고 했어요(벌점 ${Math.abs(s - prev.thr).toFixed(1)}) → 이 데이터가 가진 특징의 중요도를 내림(▼).`;
      }
      const nextIdx = (prev.idx + 1) % DATA.length;
      const epochEnd = nextIdx === 0;
      const lossNow = totalLoss(w, thr);
      const lossHist = epochEnd ? [...prev.lossHist, lossNow] : prev.lossHist;
      const done = epochEnd && lossNow === 0;
      return {
        w,
        thr,
        idx: nextIdx,
        epoch: prev.epoch + (epochEnd ? 1 : 0),
        deltas,
        msg: done ? "손실 0 도달. 컴퓨터가 스스로 파라미터를 찾았어요 — 이것이 학습입니다." : msg,
        lossHist,
        done,
      };
    });

  useEffect(() => {
    if (running) {
      timer.current = setInterval(tick, speed);
      return () => clearInterval(timer.current);
    }
  }, [running, speed]);

  useEffect(() => {
    if (t.done) setRunning(false);
  }, [t.done]);

  const cur = DATA[t.idx];
  const loss = totalLoss(t.w, t.thr);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <h2 style={h2}>4. 학습 — 손실이 줄어드는 방향으로 파라미터를 스스로 고치기</h2>
        <p style={desc}>
          규칙은 단 하나: <b>데이터를 하나 보고, 틀렸으면(벌점이 생겼으면) 벌점이 줄어드는 방향으로 가중치를 조금 고친다.</b>{" "}
          이걸 데이터 전체에 반복하면 손실이 점점 내려가요. 3단계에서 여러분이 손으로 하던 일을 컴퓨터가 자동으로
          하는 것 — 이게 머신러닝의 학습이에요.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={t.done}
            style={{ ...btn(true), background: t.done ? line : running ? red : green, border: "none", fontSize: 14 }}
          >
            {running ? "일시정지" : "학습 시작"}
          </button>
          <button onClick={() => tick()} disabled={running || t.done} style={btn(false)}>
            한 개만 보기 (한 스텝)
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setT(INIT);
            }}
            style={btn(false)}
          >
            초기화
          </button>
          <span style={{ fontSize: 12.5, color: sub, marginLeft: 4 }}>속도:</span>
          {[["느림", 1000], ["보통", 600], ["빠름", 150]].map(([label, ms]) => (
            <button key={ms} onClick={() => setSpeed(ms)} style={btn(speed === ms)}>
              {label}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: sub }}>
            {t.epoch}바퀴째 · 현재 손실 <b style={{ color: loss === 0 ? green : red }}>{loss.toFixed(1)}</b>
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={card}>
          <div style={{ fontSize: 13, color: sub, marginBottom: 8 }}>지금 보는 데이터</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 36 }}>{cur.emoji}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: ink }}>{cur.name}</div>
              <div style={{ fontSize: 12.5, color: sub }}>
                점수 {score(t.w, cur.feats).toFixed(1)} / 합격선 {t.thr.toFixed(1)}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: t.done ? "#effaf4" : bg,
              border: `1px solid ${t.done ? green : line}`,
              fontSize: 13.5,
              color: ink,
              lineHeight: 1.7,
              minHeight: 66,
            }}
          >
            {t.msg}
          </div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, color: sub, marginBottom: 8 }}>컴퓨터가 고치는 파라미터 (▲올림 ▼내림)</div>
          <WeightSliders w={t.w} thr={t.thr} locked deltas={t.deltas} />
        </div>
      </div>

      <div style={card}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: sub, marginBottom: 8 }}>판정 결과</div>
            <ResultGrid w={t.w} thr={t.thr} highlightIdx={t.idx} showPenalty />
          </div>
          <div>
            <div style={{ fontSize: 13, color: sub, marginBottom: 8 }}>손실 곡선 (바퀴마다 기록) — 내려가면 배우고 있는 것</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 120, borderBottom: `1px solid ${line}`, padding: "0 2px" }}>
              {t.lossHist.length === 0 ? (
                <span style={{ fontSize: 12, color: sub }}>아직 기록 없음</span>
              ) : (
                t.lossHist.map((v, i) => (
                  <div key={i} style={{ flex: 1, maxWidth: 30, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: ink }}>{v.toFixed(0)}</div>
                    <div
                      style={{
                        height: `${clamp((v / 40) * 100, 2, 100)}px`,
                        background: v === 0 ? green : red,
                        borderRadius: "3px 3px 0 0",
                        transition: "height .3s",
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {t.done && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: bg, borderRadius: 8, fontSize: 13.5, color: ink, lineHeight: 1.8 }}>
            <b>정리 — 머신러닝의 4요소</b>: ① <b>데이터</b>(숫자 목록 + 정답) ② <b>모델</b>(파라미터가 있는 계산 규칙)
            ③ <b>손실 함수</b>(얼마나 틀렸는지 재는 숫자) ④ <b>학습</b>(손실이 줄어드는 방향으로 파라미터를 반복해서 고침).
            딥러닝은 ②의 모델이 훨씬 커진 것이고, 강화학습은 ③에서 손실 대신 <b>보상</b>을 최대로 만드는 것이에요.
            뼈대는 전부 같아요.
          </div>
        )}
      </div>
    </div>
  );
}

// ── 메인 ───────────────────────────────────────

const STEPS = [
  { n: 1, label: "데이터" },
  { n: 2, label: "모델" },
  { n: 3, label: "손실 함수" },
  { n: 4, label: "학습" },
];

export default function MLBasicsModule() {
  const [step, setStep] = useState(1);
  // 2·3단계가 공유하는 모델 파라미터
  const [w, setWArr] = useState([5, 5, 5, 5, 5]);
  const [thr, setThr] = useState(20);
  const setW = (i, v) => setWArr((p) => p.map((x, j) => (j === i ? v : x)));

  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "24px 14px 60px", fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; } body { margin: 0; }
        @media (max-width: 700px) { div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; } }
      `}</style>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <header style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: sub, letterSpacing: 1 }}>모듈 1 · 머신러닝 기초</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: ink, margin: "4px 0 6px" }}>
            컴퓨터는 어떻게 배울까? — 데이터 · 모델 · 손실 · 학습
          </h1>
          <p style={{ fontSize: 13.5, color: sub, margin: 0 }}>
            이 네 가지 뼈대는 머신러닝뿐 아니라 딥러닝, 강화학습에서도 똑같이 쓰여요.
          </p>
        </header>

        <nav style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {STEPS.map((s) => (
            <button key={s.n} onClick={() => setStep(s.n)} style={btn(step === s.n)}>
              {s.n}. {s.label}
            </button>
          ))}
        </nav>

        {step === 1 && <StepData />}
        {step === 2 && <StepModel w={w} thr={thr} setW={setW} setThr={setThr} />}
        {step === 3 && <StepLoss w={w} thr={thr} setW={setW} setThr={setThr} />}
        {step === 4 && <StepTrain />}

        {step < 4 && (
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setStep(step + 1)} style={{ ...btn(true), fontSize: 14, padding: "9px 20px" }}>
              다음: {STEPS[step].label} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
