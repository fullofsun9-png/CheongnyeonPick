import React from 'react';
import { Policy, RouteKey, UserProfile } from '../types';

interface DetailViewProps {
  policy: Policy;
  profile: UserProfile;
  onNavigate: (route: RouteKey) => void;
  onPreparePolicy: (id: number) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  policy,
  profile,
  onNavigate,
  onPreparePolicy,
}) => {
  return (
    <>
      <button
        type="button"
        className="text-button back-button"
        onClick={() => onNavigate('policies')}
      >
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 12H5m5-5-5 5 5 5" />
        </svg>{' '}
        정책 목록
      </button>

      {/* Hero card */}
      <section className="surface detail-head">
        <div className="policy-meta">
          <span className="category-label">{policy.cat}</span>
          <span className="meta-dot"></span>
          <span className="category-label">{policy.org}</span>
          <span className="badge neutral">시연용</span>
        </div>

        <h1>{policy.title}</h1>
        <p>{policy.desc}</p>

        <div className="detail-meta">
          <span>
            신청 기간<strong>{policy.deadline}</strong>
          </span>
          <span>
            내 정보
            <strong>
              만 {profile.age}세 · {profile.status}
            </strong>
          </span>
        </div>
      </section>

      {/* Two-column Content */}
      <div className="content-two detail-grid">
        <section>
          {/* Eligibility Panel */}
          <div className="surface panel">
            <div className="panel-heading">
              <h2>내 조건과 비교했어요</h2>
              <span className="badge check">추가 확인 필요</span>
            </div>

            <p className="panel-description">
              아직 확인할 항목이 있어요.
              <br />
              아래 조건을 공고 원문과 함께 살펴봐 주세요.
            </p>

            <div className="checks">
              <div className="check-row">
                <div>
                  <strong>연령</strong>
                  <p>만 {profile.age}세 · 공고의 연령 범위와 기준일 확인</p>
                </div>
                <span className="badge check">추가 확인</span>
              </div>

              <div className="check-row">
                <div>
                  <strong>거주·생활권</strong>
                  <p>
                    주민등록지 {profile.residence} / 학교 {profile.school || '미입력'}
                    {profile.workRegion ? ` / 근무 ${profile.workRegion}` : ''}
                    <br />
                    공고의 지역 인정 범위 확인
                  </p>
                </div>
                <span className="badge check">추가 확인</span>
              </div>

              <div className="check-row">
                <div>
                  <strong>소득·참여 이력</strong>
                  <p>소득 기준과 과거 수혜 여부 미확인</p>
                </div>
                <span className="badge check">추가 확인</span>
              </div>
            </div>

            <details className="source-detail">
              <summary>어떤 근거로 확인하나요?</summary>
              <p>
                실제 서비스에서는 공식 공고의 원문, 기준일, 시행기관 링크를 함께 제공할 예정이에요.
                이 프로토타입은 공고 데이터와 연결되어 있지 않아 자격을 확정하지 않아요.
              </p>
            </details>
          </div>

          {/* Nuance explanation panel */}
          <div className="surface panel">
            <h2>이 부분을 먼저 확인해 보세요</h2>
            <div className="explanation">
              <p>{policy.explanation}</p>
            </div>
          </div>
        </section>

        {/* Action Sidebar */}
        <aside>
          <section className="surface side-panel action-panel">
            <h2>신청 전, 하나씩 준비해요</h2>
            <p>
              공고 확인부터 서류 점검까지
              <br />
              내 준비 목록에서 이어갈 수 있어요.
            </p>
            <button
              type="button"
              className="button primary full"
              onClick={() => onPreparePolicy(policy.id)}
            >
              신청 준비하기{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 12h15m-5-5 5 5-5 5" />
              </svg>
            </button>
            <button
              type="button"
              className="button full"
              onClick={() => onNavigate('switch')}
              style={{ marginTop: 8 }}
            >
              생활변화 비교하기
            </button>
          </section>

          <p className="quiet-note">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v6m0-10v.1" />
            </svg>
            <span>
              자격 충족이나 최종 선정을 보장하지 않아요. 신청 전 시행기관의 최신 공고를 확인해 주세요.
            </span>
          </p>
        </aside>
      </div>

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
