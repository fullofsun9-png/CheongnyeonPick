import React from 'react';
import { UserProfile } from '../types';

interface PolicyPassProps {
  profile: UserProfile;
  onEditProfile: () => void;
  className?: string;
}

export const PolicyPass: React.FC<PolicyPassProps> = ({ profile, onEditProfile, className = '' }) => {
  const destination = profile.school || profile.workRegion || '미입력';
  const destinationLabel = profile.school ? '학교 소재지' : profile.workRegion ? '근무 지역' : '재학·근무 지역';

  return (
    <section className={`policy-pass ${className}`} aria-label="내 생활권 패스">
      <div className="pass-header">
        <strong>MY POLICY PASS</strong>
        <span>나의 생활권</span>
      </div>

      <div className="pass-body">
        <div className="pass-greeting">
          <h2>나의 출발점</h2>
          <span>
            만 {profile.age}세 · {profile.status}
          </span>
        </div>

        <div className="pass-route">
          <div className="pass-stop">
            <small>주민등록지</small>
            <strong>{profile.residence}</strong>
          </div>

          <span className="pass-connector">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h15m-5-5 5 5-5 5" />
            </svg>
          </span>

          <div className="pass-stop">
            <small>{destinationLabel}</small>
            <strong>{destination}</strong>
          </div>
        </div>

        {profile.school && profile.workRegion && (
          <p className="pass-work">근무 지역 · {profile.workRegion}</p>
        )}
      </div>

      <div className="pass-bottom">
        <span className="pass-code">
          <span className="barcode" aria-hidden="true"></span>
          MY NEXT
        </span>
        <button
          type="button"
          className="text-button"
          onClick={onEditProfile}
          aria-label="생활권 정보 수정"
        >
          내 조건 수정{' '}
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};
