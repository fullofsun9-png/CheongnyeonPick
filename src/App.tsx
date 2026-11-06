import React, { useEffect, useState } from 'react';
import { CategoryType, Policy, RouteKey, SortType, StatusFilterType, UserProfile } from './types';
import { DEFAULT_PROFILE, POLICIES, TASK_LIST } from './data/mockData';
import { filterPolicies } from './utils/policyRules';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { PoliciesView } from './components/PoliciesView';
import { DetailView } from './components/DetailView';
import { LifeSwitchView } from './components/LifeSwitchView';
import { ApplyPrepView } from './components/ApplyPrepView';
import { ProfileView } from './components/ProfileView';
import { InfoModal } from './components/InfoModal';
import { Toast } from './components/Toast';

const STORAGE_KEY = 'cheongnyeonpick-next-clean-v1';

export default function App() {
  // Load persisted state if available
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) return parsed.profile;
      }
    } catch (_) {}
    return DEFAULT_PROFILE;
  });

  const [completedTasks, setCompletedTasks] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.completed)) return new Set(parsed.completed);
      }
    } catch (_) {}
    return new Set([0, 1]);
  });

  const [walletSaved, setWalletSaved] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.wallet)) return new Set(parsed.wallet);
      }
    } catch (_) {}
    return new Set([2]);
  });

  const [preparedPolicyId, setPreparedPolicyId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.preparedPolicy) return parsed.preparedPolicy;
      }
    } catch (_) {}
    return 1;
  });

  const [fromRoute, setFromRoute] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.from) return parsed.from;
      }
    } catch (_) {}
    return 'current';
  });

  const [toRoute, setToRoute] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.to) return parsed.to;
      }
    } catch (_) {}
    return 'graduateMove';
  });

  // Routing state
  const [currentRoute, setCurrentRoute] = useState<RouteKey>('home');
  const [detailPolicyId, setDetailPolicyId] = useState<number>(1);

  // Search & filter state
  const [category, setCategory] = useState<CategoryType>('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [sort, setSort] = useState<SortType>('related');

  // Modals & Toast
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Toast handler
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2400);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profile,
          completed: [...completedTasks],
          wallet: [...walletSaved],
          preparedPolicy: preparedPolicyId,
          from: fromRoute,
          to: toRoute,
        })
      );
    } catch (_) {}
  }, [profile, completedTasks, walletSaved, preparedPolicyId, fromRoute, toRoute]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('detail/')) {
        const id = Number(hash.split('/')[1]);
        if (id) {
          setDetailPolicyId(id);
          setCurrentRoute('detail');
        }
      } else if (['home', 'policies', 'switch', 'apply', 'profile'].includes(hash)) {
        setCurrentRoute(hash as RouteKey);
      } else {
        setCurrentRoute('home');
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: RouteKey, id?: number) => {
    if (route === 'detail' && id) {
      setDetailPolicyId(id);
      window.location.hash = `detail/${id}`;
    } else {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Sync page title
  useEffect(() => {
    const titles: Record<RouteKey, string> = {
      home: '내 정책 보드 · 청년픽 NEXT',
      policies: '정책 찾기 · 청년픽 NEXT',
      switch: '생활변화 비교 · 청년픽 NEXT',
      apply: '신청 준비 · 청년픽 NEXT',
      profile: '내 정보 · 청년픽 NEXT',
      detail: `${POLICIES.find((p) => p.id === detailPolicyId)?.title || '정책 상세'} · 청년픽 NEXT`,
    };
    document.title = titles[currentRoute] || '청년픽 NEXT';
  }, [currentRoute, detailPolicyId]);

  // Prepared policy object
  const preparedPolicy = POLICIES.find((p) => p.id === preparedPolicyId) || POLICIES[0];
  const activeDetailPolicy = POLICIES.find((p) => p.id === detailPolicyId) || POLICIES[0];

  // Filtered policies for PoliciesView
  const filteredPoliciesList = filterPolicies(POLICIES, category, searchTerm, statusFilter, sort);

  // Remaining tasks count
  const remainingPrepCount = TASK_LIST.length - completedTasks.size;

  return (
    <div className="app">
      <a href="#main" className="skip-link">
        본문으로 이동
      </a>

      {/* Top Header & Mobile Bottom Nav */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigate}
        prepCount={remainingPrepCount}
        residenceInfo={`${profile.school || profile.residence} 생활권`}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main" tabIndex={-1}>
        {currentRoute === 'home' && (
          <HomeView
            profile={profile}
            policies={POLICIES}
            preparedPolicy={preparedPolicy}
            completedTasks={completedTasks}
            tasks={TASK_LIST}
            onNavigate={navigate}
            onSelectPolicy={(id) => navigate('detail', id)}
            onSearch={(term) => setSearchTerm(term)}
            onSelectCategory={(cat) => setCategory(cat)}
            onSelectStatusFilter={(status) => setStatusFilter(status)}
          />
        )}

        {currentRoute === 'policies' && (
          <PoliciesView
            profile={profile}
            policies={filteredPoliciesList}
            category={category}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            sort={sort}
            onSelectCategory={setCategory}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onSortChange={setSort}
            onSelectPolicy={(id) => navigate('detail', id)}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'detail' && (
          <DetailView
            policy={activeDetailPolicy}
            profile={profile}
            onNavigate={navigate}
            onPreparePolicy={(id) => {
              if (id !== preparedPolicyId) {
                setCompletedTasks(new Set());
                setWalletSaved(new Set());
              }
              setPreparedPolicyId(id);
              navigate('apply');
              showToast('이 정책의 준비 목록을 열었어요.');
            }}
          />
        )}

        {currentRoute === 'switch' && (
          <LifeSwitchView
            profile={profile}
            fromKey={fromRoute}
            toKey={toRoute}
            onChangeFrom={setFromRoute}
            onChangeTo={setToRoute}
            onSwap={() => {
              const oldFrom = fromRoute;
              setFromRoute(toRoute);
              setToRoute(oldFrom);
            }}
          />
        )}

        {currentRoute === 'apply' && (
          <ApplyPrepView
            policy={preparedPolicy}
            tasks={TASK_LIST}
            completedTasks={completedTasks}
            walletSaved={walletSaved}
            onToggleTask={(idx) => {
              setCompletedTasks((prev) => {
                const next = new Set(prev);
                if (next.has(idx)) next.delete(idx);
                else next.add(idx);
                return next;
              });
            }}
            onSaveToWallet={(idx) => {
              setWalletSaved((prev) => new Set([...prev, idx]));
              showToast('전자지갑에 안내 파일을 보관했어요.');
            }}
            onRemoveFromWallet={(idx) => {
              setWalletSaved((prev) => {
                const next = new Set(prev);
                next.delete(idx);
                return next;
              });
              showToast('안내 파일의 보관을 해제했어요.');
            }}
            onSaveStatus={() => {
              showToast('준비 현황을 이 브라우저에 저장했어요.');
            }}
            onToast={showToast}
          />
        )}

        {currentRoute === 'profile' && (
          <ProfileView
            initialProfile={profile}
            onSaveProfile={(newProfile) => {
              setProfile(newProfile);
              navigate('home');
              showToast('내 정보를 저장했어요.');
            }}
            onCancel={() => navigate('home')}
          />
        )}
      </main>

      {/* Notifications Modal */}
      <InfoModal
        isOpen={isNotifOpen}
        title="알림"
        id="notifDialog"
        onClose={() => setIsNotifOpen(false)}
      >
        <p>새로운 알림이 없어요.</p>
        <p>준비할 내용은 ‘신청 준비’에서 확인할 수 있어요.</p>
        <button
          type="button"
          className="button primary full"
          onClick={() => {
            setIsNotifOpen(false);
            navigate('apply');
          }}
          style={{ marginTop: 20 }}
        >
          신청 준비 보기
        </button>
      </InfoModal>

      {/* About Prototype Modal */}
      <InfoModal
        isOpen={isAboutOpen}
        title="청년픽 NEXT 프로토타입"
        id="aboutDialog"
        onClose={() => setIsAboutOpen(false)}
      >
        <p>
          <strong>내게 맞는 정책을 찾고, 신청 준비까지 이어가는 서비스</strong>를 미리 체험하는
          화면이에요.
        </p>
        <p>
          정책 3건과 체크리스트는 모두 시연용 예시예요. 공식 정책 데이터, 실제 증명서 보관, 기관
          제출과는 연결되어 있지 않아요.
        </p>
        <p>
          검색, 생활변화 비교, 준비 체크, 안내 파일 보관·다운로드를 직접 이용할 수 있어요.
        </p>
      </InfoModal>

      {/* Toast Notification */}
      <Toast message={toastMessage} isVisible={isToastVisible} />
    </div>
  );
}
