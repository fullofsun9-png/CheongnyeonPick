import React from 'react';
import { Policy } from '../types';

interface PolicyCardProps {
  policy: Policy;
  onSelectPolicy: (id: number) => void;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onSelectPolicy }) => {
  const codeMap: Record<string, string> = {
    주거: 'HOUSING',
    일자리: 'WORK',
    교육: 'LEARNING',
    창업: 'STARTUP',
  };

  const code = codeMap[policy.cat] || 'POLICY';

  return (
    <article className="policy-card" data-category={policy.cat}>
      <div className="ticket-band">
        <span className="ticket-category">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {policy.cat === '주거' && (
              <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
            )}
            {policy.cat === '일자리' && (
              <>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
              </>
            )}
            {policy.cat === '교육' && (
              <>
                <path d="m3 9 9-5 9 5-9 5Z" />
                <path d="m7 12v5c3 2 7 2 10 0v-5m4-3v7" />
              </>
            )}
            {policy.cat === '창업' && (
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            )}
          </svg>
          {policy.cat}
        </span>
        <span className="ticket-number">
          {code} / 0{policy.id}
        </span>
      </div>

      <div className="ticket-content">
        <div className="policy-meta">
          <span className={`badge ${policy.state}`}>{policy.stateText}</span>
          <span className="category-label">정책 예시</span>
        </div>

        <h3>
          <button
            type="button"
            className="policy-title-button"
            onClick={() => onSelectPolicy(policy.id)}
          >
            {policy.title}
          </button>
        </h3>

        <p className="policy-description">{policy.desc}</p>

        <p className="policy-hint">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6m0-10v.1" />
          </svg>
          <span>{policy.reason}</span>
        </p>
      </div>

      <div className="policy-foot">
        <span>{policy.deadline}</span>
        <button
          type="button"
          className="text-button"
          onClick={() => onSelectPolicy(policy.id)}
          aria-label={`${policy.title} 조건 확인`}
        >
          조건 확인{' '}
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 12h15m-5-5 5 5-5 5" />
          </svg>
        </button>
      </div>
    </article>
  );
};
