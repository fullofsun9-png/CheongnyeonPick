import React from 'react';
import { UserProfile } from '../types';
import { calculateDiff, getProfileStates } from '../utils/policyRules';

interface LifeSwitchViewProps {
  profile: UserProfile;
  fromKey: string;
  toKey: string;
  onChangeFrom: (key: string) => void;
  onChangeTo: (key: string) => void;
  onSwap: () => void;
}

export const LifeSwitchView: React.FC<LifeSwitchViewProps> = ({
  profile,
  fromKey,
  toKey,
  onChangeFrom,
  onChangeTo,
  onSwap,
}) => {
  const states = getProfileStates(profile);
  const from = states[fromKey] || states.current;
  const to = states[toKey] || states.graduateMove;

  const diffs = calculateDiff(from, to);
  const changedCount = diffs.filter((d) => d.changed).length;

  const presets: { key: string; label: string }[] = [
    { key: 'graduate', label: '졸업 후 구직' },
    { key: 'move', label: '천안 전입' },
    { key: 'graduateMove', label: '졸업 + 천안 전입' },
  ];

  return (
    <>
      <div className="page-intro">
        <div>
          <p className="eyebrow">03 / LIFE SWITCH</p>
          <h1>바뀌는 내일, 미리 픽해봐요.</h1>
          <p className="page-description">
            졸업, 구직, 이사. 내 상황이 달라졌을 때 확인할 항목을 비교해요.
          </p>
        </div>
      </div>

      {/* Route setup panel */}
      <section className="surface panel scenario-setup" aria-label="생활변화 경로 설정">
        <div className="panel-heading">
          <h2>어떤 변화가 있나요?</h2>
          <span className="badge neutral">가정한 상황 비교</span>
        </div>

        <div className="route-editor">
          <div>
            <label className="route-label" htmlFor="fromSelect">
              <span className="route-dot" aria-hidden="true"></span>
              출발 상태
            </label>
            <select
              className="field"
              id="fromSelect"
              value={fromKey}
              onChange={(e) => onChangeFrom(e.target.value)}
            >
              {Object.entries(states).map(([k, s]) => (
                <option key={k} value={k}>
                  {s.title}
                </option>
              ))}
            </select>
            <p className="field-help">{from.detail}</p>
          </div>

          <button
            type="button"
            className="swap-button"
            onClick={onSwap}
            aria-label="출발 상태와 도착 상태 바꾸기"
            title="출발·도착 바꾸기"
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" />
            </svg>
          </button>

          <div>
            <label className="route-label" htmlFor="toSelect">
              <span className="route-dot destination" aria-hidden="true"></span>
              변화 후 상태
            </label>
            <select
              className="field"
              id="toSelect"
              value={toKey}
              onChange={(e) => onChangeTo(e.target.value)}
            >
              {Object.entries(states).map(([k, s]) => (
                <option key={k} value={k}>
                  {s.title}
                </option>
              ))}
            </select>
            <p className="field-help">{to.detail}</p>
          </div>
        </div>

        <div className="scenario-presets" role="group" aria-label="자주 비교하는 변화">
          {presets.map((p) => (
            <button
              key={p.key}
              type="button"
              className={`preset ${toKey === p.key ? 'active' : ''}`}
              onClick={() => onChangeTo(p.key)}
              aria-pressed={toKey === p.key}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* Result summary banner */}
      <div className="result-summary" aria-live="polite">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" />
        </svg>
        <div>
          <h2>
            {changedCount > 0 ? (
              <>
                생활 조건 <b>{changedCount}개</b>가 달라져요
              </>
            ) : (
              '선택한 두 상태의 생활 조건이 같아요'
            )}
          </h2>
          <p>변화 전후의 차이를 기준으로 다시 확인할 내용을 정리했어요.</p>
        </div>
      </div>

      {/* Comparison table */}
      <section className="surface panel" aria-label="생활 조건 비교">
        <table className="comparison">
          <thead>
            <tr>
              <th scope="col">비교 항목</th>
              <th scope="col">출발 상태</th>
              <th scope="col">변화 후</th>
            </tr>
          </thead>
          <tbody>
            {diffs.map((d) => (
              <tr key={d.key}>
                <td>{d.label}</td>
                <td>{d.before}</td>
                <td className={d.changed ? 'changed' : ''}>
                  {d.after}
                  <span className={`change-label ${d.changed ? 'badge' : ''}`}>
                    {d.changed ? '변경' : '동일'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Recheck guidelines panel */}
      <section className="surface panel">
        <h2>신청 전에 다시 확인해요</h2>
        <div className="checks">
          <div className="check-row">
            <div>
              <strong>지역 요건</strong>
              <p>
                {from.residence !== to.residence ? (
                  <>
                    {from.residence} → {to.residence}
                    <br />
                    공고의 거주 기준일과 전입일을 대조해 주세요.
                  </>
                ) : (
                  '주소지 변화는 없어요. 공고의 지역 인정 범위를 확인해 주세요.'
                )}
              </p>
            </div>
            <span className="badge check">공고별 확인</span>
          </div>

          <div className="check-row">
            <div>
              <strong>학적·취업 요건</strong>
              <p>
                {from.study !== to.study || from.work !== to.work
                  ? '재학생·졸업생 인정 범위와 구직 상태 조건을 다시 살펴보세요.'
                  : '학적과 활동 상태의 변화는 없어요.'}
              </p>
            </div>
            <span
              className={`badge ${
                from.study !== to.study || from.work !== to.work ? 'check' : 'neutral'
              }`}
            >
              {from.study !== to.study || from.work !== to.work ? '재확인 필요' : '변화 없음'}
            </span>
          </div>

          <div className="check-row">
            <div>
              <strong>신청 기준일</strong>
              <p>변화가 생긴 날짜와 공고의 자격 기준일을 함께 대조해야 해요.</p>
            </div>
            <span className="badge check">추가 확인</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>
          <span className="footer-brand">청년픽 NEXT</span>
          <span> &nbsp; 내 다음을, 가볍게 픽.</span>
        </div>
        <span>A NEXT:UP PROJECT</span>
      </footer>
    </>
  );
};
