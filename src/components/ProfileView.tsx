import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  initialProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  initialProfile,
  onSaveProfile,
  onCancel,
}) => {
  const [age, setAge] = useState(initialProfile.age);
  const [status, setStatus] = useState(initialProfile.status);
  const [residence, setResidence] = useState(initialProfile.residence);
  const [school, setSchool] = useState(initialProfile.school);
  const [workRegion, setWorkRegion] = useState(initialProfile.workRegion);
  const [interests, setInterests] = useState<string[]>(initialProfile.interests);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanResidence = residence.trim();
    if (!cleanResidence) {
      setErrorMsg('주민등록상 주소지를 입력해 주세요.');
      return;
    }

    onSaveProfile({
      age: Number(age) || 23,
      status,
      residence: cleanResidence,
      school: school.trim(),
      workRegion: workRegion.trim(),
      interests,
    });
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <p className="eyebrow">MY POLICY PASS / 내 정보</p>
          <h1>나를 알아야, 픽도 정확하게.</h1>
          <p className="page-description">정책을 살펴보는 데 필요한 정보만 입력해요.</p>
        </div>
      </div>

      <div className="content-two profile-grid">
        <form onSubmit={handleSubmit} id="profileForm">
          {/* Basic Info Panel */}
          <section className="surface panel">
            <div className="panel-heading">
              <h2>기본 정보</h2>
              <span className="badge neutral">입력 예시</span>
            </div>
            <p className="panel-description">거주지와 재학·근무 지역을 나누어 확인해요.</p>

            <div className="form-grid">
              {/* Age */}
              <div>
                <label className="field-label" htmlFor="profileAge">
                  연령
                </label>
                <div className="field-unit">
                  <input
                    className="field"
                    type="number"
                    id="profileAge"
                    name="age"
                    min="15"
                    max="100"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    inputMode="numeric"
                  />
                  <span>만 나이</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="field-label" htmlFor="profileStatus">
                  현재 상태
                </label>
                <select
                  className="field"
                  id="profileStatus"
                  name="status"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as '대학 재학' | '졸업' | '구직 중' | '재직 중' | '창업'
                    )
                  }
                >
                  {(['대학 재학', '졸업', '구직 중', '재직 중', '창업'] as const).map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Residence */}
              <div>
                <label className="field-label" htmlFor="profileResidence">
                  주민등록상 주소지
                </label>
                <input
                  className="field"
                  id="profileResidence"
                  name="residence"
                  maxLength={50}
                  value={residence}
                  onChange={(e) => {
                    setResidence(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="예: 경기도"
                  required
                />
                <p className="field-help">시·도 또는 시·군·구까지만 입력해요.</p>
                {errorMsg && (
                  <p style={{ color: '#c53929', fontSize: 11, marginTop: 4 }}>{errorMsg}</p>
                )}
              </div>

              {/* School */}
              <div>
                <label className="field-label" htmlFor="profileSchool">
                  학교 소재지
                </label>
                <input
                  className="field"
                  id="profileSchool"
                  name="school"
                  maxLength={50}
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="예: 천안시"
                />
                <p className="field-help">학교에 다니고 있다면 입력해 주세요.</p>
              </div>

              {/* Work Region */}
              <div>
                <label className="field-label" htmlFor="profileWork">
                  근무 지역 <span className="subtle">(선택)</span>
                </label>
                <input
                  className="field"
                  id="profileWork"
                  name="workRegion"
                  maxLength={50}
                  value={workRegion}
                  onChange={(e) => setWorkRegion(e.target.value)}
                  placeholder="예: 천안시"
                />
              </div>
            </div>
          </section>

          {/* Interests Panel */}
          <section className="surface panel">
            <h2>관심 분야</h2>
            <p className="section-caption">관심 있는 지원을 여러 개 선택할 수 있어요.</p>
            <div className="interest-options">
              {['일자리', '주거', '교육', '창업'].map((v) => (
                <label key={v} className="interest-option">
                  <input
                    type="checkbox"
                    name="interest"
                    value={v}
                    checked={interests.includes(v)}
                    onChange={() => toggleInterest(v)}
                  />
                  {v}
                </label>
              ))}
            </div>
          </section>

          {/* Form Actions */}
          <div className="form-actions">
            <button className="button" type="button" onClick={onCancel}>
              취소
            </button>
            <button className="button primary" type="submit">
              내 정보 저장
            </button>
          </div>
        </form>

        {/* Sidebar Info */}
        <aside>
          <section className="surface side-panel">
            <div className="section-heading">
              <h2>정보를 입력하기 전에</h2>
            </div>
            <ul className="profile-tips">
              <li>
                <strong>주소지는 서로 달라도 돼요</strong>
                실제 주민등록지와 학교·근무 지역을 구분하면 확인할 조건을 놓치지 않아요.
              </li>
              <li>
                <strong>민감한 정보는 입력하지 않아요</strong>
                주민등록번호, 상세 주소, 소득·재산 정보는 이 화면에서 받지 않아요.
              </li>
              <li>
                <strong>내 브라우저에만 반영해요</strong>
                입력 정보는 이 브라우저에 저장돼요. 시연용 정책 예시의 자격을 자동으로 확정하지 않아요.
              </li>
            </ul>
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
