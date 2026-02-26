/**
 * Bumpp 发布流程配置
 * @see https://github.com/antfu-collective/bumpp
 *
 * 脚本:
 * - pnpm run release        递归 bump 所有 workspace 包 → commit → tag → push
 * - pnpm run release:rich   同上，且在 commit 前执行 build:rich + publish:rich（发布 @haklex/*）
 * - pnpm run release:dry    bump 所有包，不 commit/tag/push（仅看版本变化）
 *
 * 基准版本以 packages/rich-editor 的 version 为准。
 */
import { defineConfig } from 'bumpp'

import richEditorPkg from './packages/rich-editor/package.json'

export default defineConfig({
  /** 基准版本：与 packages/rich-editor 保持一致 */
  currentVersion: (richEditorPkg as { version: string }).version,
  commit: 'chore(rich-editor): bump version v%s',
  tag: false,
  push: true,
  /** 允许有未提交改动时 bump（CI 或本地试跑时有用） */
  noGitCheck: true,
  /** commit 时包含所有已改文件（含 lockfile） */
  all: true,
  /** 交互确认，看清将要 bump 的版本再继续 */
  confirm: true,
  /** 只 bump 根与 packages/*，不 bump apps（含 @shiro/web） */
  files: ['package.json', 'pnpm-lock.yaml', 'packages/**/package.json'],
})
