export type CategoryType = '전체' | '일자리' | '주거' | '교육' | '창업';
export type StatusFilterType = 'all' | 'check' | 'good';
export type SortType = 'related' | 'name';
export type RouteKey = 'home' | 'policies' | 'switch' | 'apply' | 'profile' | 'detail';

export interface UserProfile {
  age: number;
  residence: string;
  school: string;
  workRegion: string;
  status: '대학 재학' | '졸업' | '구직 중' | '재직 중' | '창업';
  interests: string[];
}

export interface Policy {
  id: number;
  title: string;
  cat: '주거' | '일자리' | '교육' | '창업';
  state: 'check' | 'good' | 'no';
  stateText: string;
  org: string;
  desc: string;
  reason: string;
  deadline: string;
  explanation: string;
}

export interface LifeState {
  label: string;
  title: string;
  residence: string;
  study: string;
  work: string;
  detail: string;
}

export interface TaskItem {
  title: string;
  desc: string;
  file: string;
  content: string;
}

export interface AppState {
  profile: UserProfile;
  completed: number[];
  wallet: number[];
  preparedPolicy: number;
  from: string;
  to: string;
}
