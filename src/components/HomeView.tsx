import React, { useState } from 'react';
import { CategoryType, Policy, RouteKey, TaskItem, UserProfile } from '../types';
import { PolicyCard } from './PolicyCard';
import { PolicyPass } from './PolicyPass';

interface HomeViewProps {
  profile: UserProfile;
  policies: Policy[];
  preparedPolicy: Policy;
  completedTasks: Set<number>;
  tasks: TaskItem[];
  onNavigate: (route: RouteKey) => void;
  onSelectPolicy: (id: number) => void;
  onSearch: (term: string) => void;
  onSelectCategory: (cat: CategoryType) => void;
  onSelectStatusFilter: (status: 'all' | 'check' | 'good') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  policies,
  preparedPolicy,
  completedTasks,
  tasks,
  onNavigate,
  onSelectPolicy,
  onSearch,
  onSelectCategory,
  onSelectStatusFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const done = completedTasks.size;
  const progressPercent = Math.round((done / tasks.length) * 100);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    onNavigate('policies');
  };

  const checkPoliciesCount = policies.filter((p) => p.state === 'check').length;

  return (
    <>
      {/* Hero Section */}
      <section className="board-hero">
        <div className="hero-copy">
          <div className="mono-kicker">
            <span className="kicker-dot"></span>
            MY NEXT / 내 정책 보드
          </div>

          <h1>
            내 다음을,
            <br />
            <span className="highlight-word">가볍게 픽!</span>
            <span className="hero-sticker">나에게 맞게</span>
          </h1>

          <p>
            어디에 살든, 무엇을 준비하든.
            <br />
            지금의 나와 연결되는 정책을 찾아요.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="button primary"
              onClick={() => {
                onSelectCategory('전체');
                onSelectStatusFilter('all');
                onNavigate('policies');
              }}
            >
              내게 맞는 정책 찾기{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 12h15m-5-5 5 5-5 5" />
              </svg>
            </button>
            <span className="hero-caption">
              조건 확인부터 신청 준비까지,
              <br />
              한 번에 이어가요.
            </span>
          </div>

          <span className="hero-spark" aria-hidden="true">
            <svg viewBox="0 0 70 70" fill="none">
              <path
                d="M35 3c0 20-12 32-32 32 20 0 32 12 32 32 0-20 12-32 32-32C47 35 35 23 35 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path d="m53 4 2 8 8 2-8 2-2 8-2-8-8-2 8-2Z" fill="currentColor" />
            </svg>
          </span>
        </div>

        <div className="hero-pass">
          <PolicyPass profile={profile} onEditProfile={() => onNavigate('profile')} />
        </div>
      </section>

      {/* 3 Overview Stat Cards */}
      <section className="overview" aria-label="내 정책 현황">
        <button
          type="button"
          className="overview-item"
          onClick={() => {
            onSelectCategory('전체');
            onSelectStatusFilter('all');
            onNavigate('policies');
          }}
          aria-label={`검토할 정책 ${policies.length}건`}
        >
          <span className="overview-copy">
            <span className="overview-code">TO EXPLORE</span>
            <span className="overview-label">검토할 정책</span>
          </span>
          <span className="overview-value">
            {String(policies.length).padStart(2, '0')}
            <em>건</em>
          </span>
          <span className="overview-arrow">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h15m-5-5 5 5-5 5" />
            </svg>
          </span>
        </button>

        <button
          type="button"
          className="overview-item"
          onClick={() => {
            onSelectCategory('전체');
            onSelectStatusFilter('check');
            onNavigate('policies');
          }}
          aria-label={`추가 확인 필요 ${checkPoliciesCount}건`}
        >
          <span className="overview-copy">
            <span className="overview-code">TO CHECK</span>
            <span className="overview-label">추가 확인 필요</span>
          </span>
          <span className="overview-value">
            {String(checkPoliciesCount).padStart(2, '0')}
            <em>건</em>
          </span>
          <span className="overview-arrow">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h15m-5-5 5 5-5 5" />
            </svg>
          </span>
        </button>

        <button
          type="button"
          className="overview-item"
          onClick={() => onNavigate('apply')}
          aria-label={`${done === tasks.length ? '준비 완료' : '신청 준비 중'} 1건`}
        >
          <span className="overview-copy">
            <span className="overview-code">TO GET READY</span>
            <span className="overview-label">
              {done === tasks.length ? '준비 완료' : '신청 준비 중'}
            </span>
          </span>
          <span className="overview-value">
            01<em>건</em>
          </span>
          <span className="overview-arrow">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h15m-5-5 5 5-5 5" />
            </svg>
          </span>
        </button>
      </section>

      {/* 01 오늘의 정책 픽 */}
      <section className="pick-section">
        <div className="section-heading">
          <div className="section-title-group">
            <span className="section-index" aria-hidden="true">
              01
            </span>
            <h2>오늘의 정책 픽</h2>
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              onSelectCategory('전체');
              onSelectStatusFilter('all');
              onNavigate('policies');
            }}
          >
            전체 보기{' '}
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h15m-5-5 5 5-5 5" />
            </svg>
          </button>
        </div>

        <div className="discovery-tools">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <svg className="icon search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              name="search"
              type="search"
              aria-label="정책명 또는 관심 분야 검색"
              placeholder="어떤 지원을 찾고 있나요?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">검색</button>
          </form>

          <div className="category-tabs" role="group" aria-label="정책 분야">
            {(['전체', '일자리', '주거', '교육', '창업'] as CategoryType[]).map((c) => (
              <button
                key={c}
                type="button"
                className={`category-tab ${c === '전체' ? 'active' : ''}`}
                onClick={() => {
                  onSelectCategory(c);
                  onNavigate('policies');
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="home-policy-grid">
          {policies.map((p) => (
            <PolicyCard key={p.id} policy={p} onSelectPolicy={onSelectPolicy} />
          ))}
        </div>

        <p className="quiet-note">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6m0-10v.1" />
          </svg>
          <span>
            시연용 정책 예시예요. 실제 모집 여부와 자격은 시행기관의 공식 공고에서 확인해 주세요.
          </span>
        </p>
      </section>

      {/* 다음 준비와 생활변화 (Check note & Life Switch preview) */}
      <section className="next-section" aria-label="다음 준비와 생활변화">
        {/* Card 1: 02 / MY CHECK NOTE */}
        <div className="prep-note">
          <div className="prep-note-copy">
            <p className="eyebrow">02 / MY CHECK NOTE</p>
            <h2>준비는 한 칸씩.</h2>
            <p className="prep-policy">{preparedPolicy.title}</p>
            <button
              type="button"
              className="button"
              onClick={() => onNavigate('apply')}
            >
              준비 이어가기{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 12h15m-5-5 5 5-5 5" />
              </svg>
            </button>
          </div>

          <div className="prep-note-detail">
            <div className="prep-note-progress">
              <strong>
                {done}/{tasks.length}
              </strong>
              <span>
                {done === tasks.length ? '모두 완료' : '준비 완료'} · {progressPercent}%
              </span>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-label="신청 준비 진행률"
              aria-valuenow={done}
              aria-valuemin={0}
              aria-valuemax={tasks.length}
            >
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className="progress-steps">
              {tasks.slice(0, 3).map((t, idx) => (
                <div key={idx} className="progress-step-item">
                  <span className={`step-dot ${completedTasks.has(idx) ? 'done' : ''}`}></span>
                  <span>{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: 03 / LIFE SWITCH */}
        <button
          type="button"
          className="switch-link"
          onClick={() => onNavigate('switch')}
          aria-label="03 / LIFE SWITCH 내 상황이 달라지면, 다음 픽도 달라질까? 생활변화 전후의 조건을 비교해 봐요."
        >
          <div className="switch-link-head">
            <span className="eyebrow">03 / LIFE SWITCH</span>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" />
            </svg>
          </div>

          <strong>
            내 상황이 달라지면,
            <br />
            다음 픽도 달라질까?
          </strong>

          <p>생활변화 전후의 조건을 비교해 봐요.</p>

          <div className="change-route" aria-hidden="true">
            <span>재학</span>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h15m-5-5 5 5-5 5" />
            </svg>
            <span>졸업·구직</span>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h15m-5-5 5 5-5 5" />
            </svg>
            <span>전입</span>
          </div>
        </button>
      </section>

      {/* Footer */}
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
