import React from 'react';
import { RouteKey } from '../types';

interface HeaderProps {
  currentRoute: RouteKey;
  onNavigate: (route: RouteKey) => void;
  prepCount: number;
  residenceInfo: string;
  onOpenNotifications: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  prepCount,
  onOpenNotifications,
  onOpenAbout,
}) => {
  const navItems: { key: RouteKey; label: string; mobileLabel: string }[] = [
    { key: 'home', label: '나의 보드', mobileLabel: '홈' },
    { key: 'policies', label: '정책 찾기', mobileLabel: '정책 찾기' },
    { key: 'switch', label: '생활변화 비교', mobileLabel: '생활변화' },
    { key: 'apply', label: '신청 준비', mobileLabel: '신청 준비' },
    { key: 'profile', label: '내 정보', mobileLabel: '내 정보' },
  ];

  return (
    <>
      <header className="topbar">
        {/* Brand */}
        <button
          className="brand"
          onClick={() => onNavigate('home')}
          aria-label="청년픽 NEXT 홈"
          style={{ border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18V6l16 12V6" />
            </svg>
          </span>
          <span>청년픽</span>
          <span className="brand-next">NEXT</span>
        </button>

        {/* Desktop Nav */}
        <nav className="desktop-nav" aria-label="주 메뉴">
          {navItems.map((item) => {
            const isActive =
              currentRoute === item.key || (item.key === 'policies' && currentRoute === 'detail');
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{item.label}</span>
                {item.key === 'apply' && prepCount > 0 && (
                  <span className="nav-count" aria-label={`남은 준비 항목 ${prepCount}개`}>
                    {prepCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Top Actions */}
        <div className="top-actions">
          <button
            type="button"
            className="demo-button"
            onClick={onOpenAbout}
            title="프로토타입 안내"
          >
            프로토타입
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onOpenNotifications}
            aria-label="알림 확인"
            title="알림 확인"
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button
            type="button"
            className="profile-button"
            onClick={() => onNavigate('profile')}
            aria-label="내 정보 열기"
            title="내 정보 열기"
          >
            내
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav" aria-label="하단 모바일 메뉴">
        {navItems.map((item) => {
          const isActive =
            currentRoute === item.key || (item.key === 'policies' && currentRoute === 'detail');
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`bottom-link ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {item.key === 'home' && (
                  <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
                )}
                {item.key === 'policies' && (
                  <>
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m16 16 4.5 4.5" />
                  </>
                )}
                {item.key === 'switch' && (
                  <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" />
                )}
                {item.key === 'apply' && (
                  <>
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <path d="m8 12 3 3 5-6M9 3v2h6V3" />
                  </>
                )}
                {item.key === 'profile' && (
                  <>
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                  </>
                )}
              </svg>
              <span>{item.mobileLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
