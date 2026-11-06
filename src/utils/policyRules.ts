import { CategoryType, LifeState, Policy, SortType, StatusFilterType, TaskItem, UserProfile } from '../types';

export function getProfileStates(p: UserProfile): Record<string, LifeState> {
  const study =
    p.status === '대학 재학'
      ? p.school
        ? `${p.school} 소재 대학 재학`
        : '재학 지역 미입력'
      : '졸업·재학 상태 확인';

  return {
    current: {
      label: '현재 내 정보',
      title: `${p.status} · ${p.residence}`,
      residence: p.residence,
      study,
      work: p.status,
      detail: '내 정보에 저장한 현재 생활 상태',
    },
    graduate: {
      label: '졸업 후 구직',
      title: `졸업·구직 중 · ${p.residence}`,
      residence: p.residence,
      study: '대학 졸업',
      work: '구직 중',
      detail: '졸업 후 구직 상태로 바뀐 상황',
    },
    move: {
      label: '천안 전입',
      title: `${p.status} · 천안시`,
      residence: '천안시',
      study,
      work: p.status,
      detail: '주민등록상 주소지를 천안시로 옮긴 상황',
    },
    graduateMove: {
      label: '졸업 + 천안 전입',
      title: '졸업·구직 중 · 천안시',
      residence: '천안시',
      study: '대학 졸업',
      work: '구직 중',
      detail: '졸업 후 천안시로 주소지를 옮기고 구직하는 상황',
    },
  };
}

export interface DiffItem {
  key: string;
  label: string;
  before: string;
  after: string;
  changed: boolean;
}

export function calculateDiff(from: LifeState, to: LifeState): DiffItem[] {
  return [
    {
      key: 'residence',
      label: '주민등록지',
      before: from.residence,
      after: to.residence,
      changed: from.residence !== to.residence,
    },
    {
      key: 'study',
      label: '학적 상태',
      before: from.study,
      after: to.study,
      changed: from.study !== to.study,
    },
    {
      key: 'work',
      label: '활동 상태',
      before: from.work,
      after: to.work,
      changed: from.work !== to.work,
    },
  ];
}

export function filterPolicies(
  policies: Policy[],
  category: CategoryType,
  searchTerm: string,
  statusFilter: StatusFilterType,
  sort: SortType
): Policy[] {
  const term = searchTerm.trim().toLowerCase();

  const filtered = policies.filter((p) => {
    if (category !== '전체' && p.cat !== category) return false;
    if (statusFilter !== 'all' && p.state !== statusFilter) return false;
    if (!term) return true;
    return (
      p.title.toLowerCase().includes(term) ||
      p.cat.toLowerCase().includes(term) ||
      p.desc.toLowerCase().includes(term) ||
      p.reason.toLowerCase().includes(term) ||
      p.org.toLowerCase().includes(term)
    );
  });

  if (sort === 'name') {
    return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  }

  // 'related' maintains original order or prioritization
  return filtered;
}

export function calculateProgress(completedCount: number, total: number): {
  count: number;
  total: number;
  percentage: number;
} {
  const safeTotal = total > 0 ? total : 1;
  const percentage = Math.round((completedCount / safeTotal) * 100);
  return {
    count: completedCount,
    total,
    percentage: Math.min(100, Math.max(0, percentage)),
  };
}

export function generateDownloadContent(policyTitle: string, task: TaskItem): string {
  return `준비 중인 정책: ${policyTitle}\n\n${task.content}`;
}
