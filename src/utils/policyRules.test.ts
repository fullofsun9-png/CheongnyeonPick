import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDiff, calculateProgress, filterPolicies, generateDownloadContent, getProfileStates } from './policyRules';
import { DEFAULT_PROFILE, POLICIES, TASK_LIST } from '../data/mockData';

test('getProfileStates generates valid states for default profile', () => {
  const states = getProfileStates(DEFAULT_PROFILE);
  assert.equal(states.current.residence, '경기도');
  assert.equal(states.current.work, '대학 재학');
  assert.ok(states.current.study.includes('천안시'));

  assert.equal(states.move.residence, '천안시');
  assert.equal(states.graduate.work, '구직 중');
  assert.equal(states.graduateMove.residence, '천안시');
});

test('calculateDiff detects correct changes between current and graduateMove', () => {
  const states = getProfileStates(DEFAULT_PROFILE);
  const diffs = calculateDiff(states.current, states.graduateMove);

  assert.equal(diffs.length, 3);
  const residenceDiff = diffs.find((d) => d.key === 'residence');
  assert.ok(residenceDiff);
  assert.equal(residenceDiff.changed, true);
  assert.equal(residenceDiff.before, '경기도');
  assert.equal(residenceDiff.after, '천안시');

  const workDiff = diffs.find((d) => d.key === 'work');
  assert.ok(workDiff);
  assert.equal(workDiff.changed, true);
  assert.equal(workDiff.before, '대학 재학');
  assert.equal(workDiff.after, '구직 중');
});

test('filterPolicies handles category filtering and search term', () => {
  const all = filterPolicies(POLICIES, '전체', '', 'all', 'related');
  assert.equal(all.length, 3);

  const housing = filterPolicies(POLICIES, '주거', '', 'all', 'related');
  assert.equal(housing.length, 1);
  assert.equal(housing[0].title, '청년 주거 지원 정책');

  const searched = filterPolicies(POLICIES, '전체', '취업', 'all', 'related');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].title, '청년 취업 지원 프로그램');

  const statusFiltered = filterPolicies(POLICIES, '전체', '', 'check', 'related');
  assert.equal(statusFiltered.length, 2);
});

test('calculateProgress returns accurate progress counts and percentages', () => {
  const p0 = calculateProgress(0, 5);
  assert.equal(p0.percentage, 0);

  const p2 = calculateProgress(2, 5);
  assert.equal(p2.percentage, 40);

  const p5 = calculateProgress(5, 5);
  assert.equal(p5.percentage, 100);
});

test('generateDownloadContent includes policy title and instructions', () => {
  const content = generateDownloadContent('청년 주거 지원 정책', TASK_LIST[0]);
  assert.ok(content.includes('준비 중인 정책: 청년 주거 지원 정책'));
  assert.ok(content.includes('공고 확인 기록표'));
});
