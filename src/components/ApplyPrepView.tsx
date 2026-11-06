import React from 'react';
import { Policy, TaskItem } from '../types';
import { generateDownloadContent } from '../utils/policyRules';

interface ApplyPrepViewProps {
  policy: Policy;
  tasks: TaskItem[];
  completedTasks: Set<number>;
  walletSaved: Set<number>;
  onToggleTask: (index: number) => void;
  onSaveToWallet: (index: number) => void;
  onRemoveFromWallet: (index: number) => void;
  onSaveStatus: () => void;
  onToast: (msg: string) => void;
}

export const ApplyPrepView: React.FC<ApplyPrepViewProps> = ({
  policy,
  tasks,
  completedTasks,
  walletSaved,
  onToggleTask,
  onSaveToWallet,
  onRemoveFromWallet,
  onSaveStatus,
  onToast,
}) => {
  const done = completedTasks.size;
  const progressPercent = Math.round((done / tasks.length) * 100);
  const remaining = tasks.length - done;

  const handleDownload = (index: number) => {
    const task = tasks[index];
    if (!task) return;

    const fileContent = generateDownloadContent(policy.title, task);
    const blob = new Blob(['\ufeff' + fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = task.file;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    onToast('안내 파일을 다운로드했어요.');
  };

  const savedIndices = [...walletSaved].sort((a, b) => a - b);

  return (
    <>
      <div className="page-intro">
        <div>
          <p className="eyebrow">02 / 나의 체크 노트</p>
          <h1>준비는 한 칸씩, 확실하게.</h1>
          <p className="page-description">
            공고 확인부터 서류 점검까지, 완료한 항목에 표시해 주세요.
          </p>
        </div>
      </div>

      {/* Prep overview card */}
      <section className="surface prep-overview">
        <div>
          <span className="badge neutral">시연용 준비 목록</span>
          <h2>{policy.title}</h2>
        </div>

        <div className="prep-progress">
          <div className="progress-label">
            <span>
              {done} / {tasks.length} 단계 완료
            </span>
            <strong>{progressPercent}%</strong>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="준비 단계 완료"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={tasks.length}
          >
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </section>

      {/* Two-column layout */}
      <div className="content-two prep-grid">
        <section>
          <div className="surface panel">
            <div className="panel-heading">
              <h2>내 준비 체크리스트</h2>
              <span className="badge blue">
                {done === tasks.length ? '모두 완료' : `${remaining}개 남았어요`}
              </span>
            </div>

            {tasks.map((task, idx) => {
              const isDone = completedTasks.has(idx);
              const isSaved = walletSaved.has(idx);

              return (
                <div key={idx} className="task-row">
                  <div className="task-main">
                    <input
                      type="checkbox"
                      id={`task-${idx}`}
                      checked={isDone}
                      onChange={() => onToggleTask(idx)}
                    />
                    <label className="task-label" htmlFor={`task-${idx}`}>
                      <strong>{task.title}</strong>
                      <small>{task.desc}</small>
                    </label>
                    <span className={`badge ${isDone ? 'good' : 'neutral'}`}>
                      {isDone ? '완료' : '준비 전'}
                    </span>
                  </div>

                  <div className="task-document">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Zm0 0v6h5M9 13h6m-6 4h6" />
                    </svg>
                    <span>{task.file}</span>

                    <button
                      type="button"
                      className={`small-action ${isSaved ? 'saved' : ''}`}
                      onClick={() => onSaveToWallet(idx)}
                      disabled={isSaved}
                      aria-label={`${task.file} ${isSaved ? '보관됨' : '전자지갑에 보관'}`}
                    >
                      {isSaved ? '보관됨' : '지갑 보관'}
                    </button>

                    <button
                      type="button"
                      className="small-action"
                      onClick={() => handleDownload(idx)}
                      aria-label={`${task.file} 받기`}
                    >
                      받기
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="button primary"
            onClick={onSaveStatus}
            style={{ marginTop: 14 }}
          >
            준비 현황 저장{' '}
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m8 12 3 3 5-6" />
            </svg>
          </button>

          <p className="quiet-note">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v6m0-10v.1" />
            </svg>
            <span>
              다운로드 파일은 준비를 돕는 시연용 안내·점검 양식이에요. 실제 증명서나 신청서가 아니며,
              최종 신청은 시행기관의 공식 홈페이지에서 진행해 주세요.
            </span>
          </p>
        </section>

        {/* Sidebar: Electronic Wallet & Reminders */}
        <aside>
          {/* Electronic Wallet */}
          <section className="surface side-panel" aria-label="내 전자지갑">
            <div className="section-heading">
              <h2 className="wallet-heading">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="15" rx="2" />
                  <path d="M3 8V5a2 2 0 0 1 2-2h12M21 10h-6v5h6m-3-2.5h.1" />
                </svg>
                내 전자지갑
              </h2>
              <span className="badge blue">{savedIndices.length}개</span>
            </div>

            {savedIndices.length > 0 ? (
              <div className="wallet-list">
                {savedIndices.map((i) => {
                  const item = tasks[i];
                  if (!item) return null;
                  return (
                    <div key={i} className="wallet-file">
                      <div>
                        <strong>{item.file}</strong>
                        <small>준비 안내 · TXT</small>
                      </div>
                      <div className="wallet-actions">
                        <button type="button" onClick={() => handleDownload(i)}>
                          다운로드
                        </button>
                        <button type="button" onClick={() => onRemoveFromWallet(i)}>
                          보관 해제
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="empty-wallet" style={{ fontSize: 12, color: 'var(--muted)', padding: '12px 0' }}>
                아직 보관한 파일이 없어요.
                <br />
                체크리스트의 안내 파일을 전자지갑에 담아보세요.
              </p>
            )}

            <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 14, lineHeight: 1.6 }}>
              이 브라우저에 안내파일 목록을 보관해요. 실제 증빙서류는 업로드하지 않아요.
            </p>
          </section>

          {/* Reminder box */}
          <section className="surface side-panel" style={{ marginTop: 20 }}>
            <div className="section-heading">
              <h2>놓치지 말고 확인해요</h2>
            </div>
            <div className="reminder-row">
              <span>공고별 제출서류</span>
              <span>원문 대조</span>
            </div>
            <div className="reminder-row">
              <span>접수 마감 일정</span>
              <span>변경 여부 확인</span>
            </div>
            <div className="reminder-row">
              <span>다른 정책 참여 이력</span>
              <span>중복수혜 확인</span>
            </div>
          </section>
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
