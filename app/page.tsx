"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

type Result =
  | null
  | { won: false }
  | { won: true; nameMasked: string; phoneMasked: string; amount: string };

export default function Home() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkWinner = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "조회 중 오류가 발생했습니다.");
      return;
    }

    setResult(data);

    if (data.won) {
      confetti({ particleCount: 180, spread: 90, origin: { y: 0.15 } });
    }
  };

  return (
    <main className="page">
      <section className="wrap">
        <div className="topBadge">2026 경정 왕중왕전</div>

        <h1>
          매일 만원 챌린지
          <br />
          쿠폰 당첨자 조회
        </h1>

        <p className="desc">
          휴대전화번호 전체를 입력하시면 쿠폰 당첨 여부를 확인하실 수 있습니다.
        </p>

        <div className="searchCard">
          <label>휴대전화번호</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01012341234"
            inputMode="numeric"
          />
          <button onClick={checkWinner} disabled={loading}>
            {loading ? "조회 중입니다..." : "당첨 여부 조회하기"}
          </button>
          {error && <p className="error">{error}</p>}
        </div>

        {result?.won && (
          <div className="resultCard win">
            <h2>🎊 축하합니다!</h2>
            <p className="sub">쿠폰에 당첨되셨습니다.</p>

            <div className="info">
              <p><span>성명</span> <strong>{result.nameMasked}</strong></p>
              <p><span>연락처</span> <strong>{result.phoneMasked}</strong></p>
              <p><span>쿠폰 당첨 금액</span> <strong className="amount">{result.amount}</strong></p>
            </div>

            <div className="notice">
              쿠폰은 6월 24일(수)에 지급해드릴 예정입니다.<br />
              쿠폰의 유효기간은 7월 2일(목)까지이니 늦지 않게 사용해주세요.<br />
              매일 만원 챌린지는 6월 26일(금)부터 6월 28일(일)까지<br />
              경륜 왕중왕전에서 계속됩니다!
            </div>
          </div>
        )}

        {result && !result.won && (
          <div className="resultCard lose">
            <h2>🙇 아쉽지만 이번에는 당첨되시지 않았습니다.</h2>
            <p>
              매일 만원 챌린지는 6월 26일(금)부터 6월 28일(일)까지<br />
              경륜 왕중왕전에서 계속됩니다!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}