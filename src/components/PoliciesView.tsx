import React from 'react';
import { CategoryType, Policy, RouteKey, SortType, StatusFilterType, UserProfile } from '../types';
import { PolicyCard } from './PolicyCard';
import { PolicyPass } from './PolicyPass';

interface PoliciesViewProps {
  profile: UserProfile;
  policies: Policy[];
  category: CategoryType;
  searchTerm: string;
  statusFilter: StatusFilterType;
  sort: SortType;
  onSelectCategory: (cat: CategoryType) => void;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: StatusFilterType) => void;
  onSortChange: (sort: SortType) => void;
  onSelectPolicy: (id: number) => void;
  onNavigate: (route: RouteKey) => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({
  profile,
  policies,
  category,
  searchTerm,
  statusFilter,
  sort,
  onSelectCategory,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  onSelectPolicy,
  onNavigate,
}) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleResetAllFilters = () => {
    onSearchChange('');
    onSelectCategory('전체');
    onStatusFilterChange('all');
    onSortChange('related');
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <p className="eyebrow">01 / 정책 픽 리스트</p>
          <h1>나의 조건, 나의 정책 픽.</h1>
          <p className="page-description">
            생활권과 관심 분야를 기준으로 확인할 정책을 모았어요.
          </p>
        </div>
      </div>

      <div className="content-two">
        <section>
          {/* Search form */}
          <form
            className="search-form"
            onSubmit={(e) => e.preventDefault()}
            style={{ maxWidth: 'none', marginBottom: 14 }}
          >
            <svg className="icon search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              type="search"
              aria-label="정책명 또는 관심 분야 검색"
              placeholder="어떤 지원을 찾고 있나요?"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear"
                onClick={handleClearSearch}
                aria-label="검색어 지우기"
              >
                ✕
              </button>
            )}
            <button type="submit">검색</button>
          </form>

          {/* Category tabs */}
          <div className="category-tabs" role="group" aria-label="정책 분야">
            {(['전체', '일자리', '주거', '교육', '창업'] as CategoryType[]).map((c) => (
              <button
                key={c}
                type="button"
                className={`category-tab ${category === c ? 'active' : ''}`}
                onClick={() => onSelectCategory(c)}
                aria-pressed={category === c}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Status filter active pill */}
          {statusFilter !== 'all' && (
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="preset active"
                onClick={() => onStatusFilterChange('all')}
                aria-label="추가 확인 필터 해제"
              >
                추가 확인 필요 ×
              </button>
            </div>
          )}

          {/* Filters head */}
          <div className="filters-head">
            <span>
              시연용 정책 <b id="resultCount">{policies.length}</b>건
            </span>
            <select
              className="filter-sort"
              id="sortSelect"
              aria-label="정렬 기준"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortType)}
            >
              <option value="related">관련도순</option>
              <option value="name">정책명순</option>
            </select>
          </div>

          {/* Policy list or empty state */}
          <div className="policy-list" id="policyResults">
            {policies.length > 0 ? (
              policies.map((p) => (
                <PolicyCard key={p.id} policy={p} onSelectPolicy={onSelectPolicy} />
              ))
            ) : (
              <div className="surface empty-state" style={{ padding: '36px 20px', textAlign: 'center' }}>
                <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                  조건에 맞는 정책 예시가 없어요.
                </p>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
                  다른 검색어를 입력하거나 분야를 변경해 보세요.
                </p>
                <button
                  type="button"
                  className="button"
                  onClick={handleResetAllFilters}
                >
                  필터 초기화
                </button>
              </div>
            )}
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

        {/* Sidebar */}
        <aside className="policy-aside">
          <PolicyPass profile={profile} onEditProfile={() => onNavigate('profile')} />

          <div className="surface filter-summary" style={{ marginTop: 20 }}>
            <strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
              이렇게 확인해 보세요
            </strong>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--sub)' }}>
              정책의 이름보다 나의 조건이 더 중요해요. 각 정책의 ‘조건 확인’에서 연령·지역·이력
              항목을 살펴보세요.
            </p>
          </div>
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
