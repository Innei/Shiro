# Shiro Monorepo Migration & Feature Stripping Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reset Shiro OSS to mirror Shiroi's monorepo structure, then remove all Shiroi-exclusive premium features.

**Architecture:** Copy Shiroi's full monorepo layout (apps/web + packages/types) into Shiro, excluding rich-* packages. Then systematically strip 12 categories of premium features: i18n, AI, visual effects, presence, thinking enhancements, categories/tags, home enhancements, passkey auth, comment enhancements, dashboard, analytics, and translation.

**Tech Stack:** Next.js 16, pnpm + Turborepo monorepo, Tailwind CSS v4, Jotai, TanStack Query, React 19

---

### Task 1: Clear Shiro Source Files

**Files:**
- Remove: All source files except `.git/`, `README.md`, `LICENSE`, `ADDITIONAL_TERMS.md`, `CHANGELOG.md`

**Step 1: Remove existing source**

```bash
# Keep .git, README, LICENSE, ADDITIONAL_TERMS, CHANGELOG
cd /Users/innei/git/innei-repo/Shiro
# Remove all tracked source files/configs
rm -rf src/ public/ .github/ scripts/
rm -f next.config.mjs tsconfig.json tailwind.config.ts postcss.config.cjs
rm -f eslint.config.mjs .prettierrc.mjs .prettierignore .npmrc
rm -f docker-compose.yml Dockerfile .dockerignore .drone.yml
rm -f vercel.json ecosystem.config.cjs ecosystem.standalone.config.cjs
rm -f renovate.json .gitmodules turbo.json pnpm-lock.yaml
rm -f package.json global.d.ts next-env.d.ts tsconfig.tsbuildinfo
rm -f NOTE.md TODO.md SAY.md setup-git.sh taze.config.js
rm -f .env.template app.config.ts
rm -rf reporter-assets/
```

**Step 2: Verify clean state**

Only `.git/`, `README.md`, `LICENSE`, `ADDITIONAL_TERMS.md`, `CHANGELOG.md`, `docs/` should remain.

---

### Task 2: Copy Shiroi Monorepo Root Structure

**Files:**
- Copy from Shiroi: Root config files

**Step 1: Copy root configs**

```bash
SHIROI=/Users/innei/git/innei-repo/Shiroi
SHIRO=/Users/innei/git/innei-repo/Shiro

cp "$SHIROI/package.json" "$SHIRO/"
cp "$SHIROI/turbo.json" "$SHIRO/"
cp "$SHIROI/pnpm-workspace.yaml" "$SHIRO/"
cp "$SHIROI/eslint.config.mjs" "$SHIRO/"
cp "$SHIROI/.prettierrc.mjs" "$SHIRO/"
cp "$SHIROI/.prettierignore" "$SHIRO/"
cp "$SHIROI/.npmrc" "$SHIRO/"
cp "$SHIROI/.gitignore" "$SHIRO/"
cp "$SHIROI/taze.config.js" "$SHIRO/"
cp "$SHIROI/renovate.json" "$SHIRO/"
cp "$SHIROI/docker-compose.yml" "$SHIRO/"
cp "$SHIROI/Dockerfile" "$SHIRO/"
cp "$SHIROI/.dockerignore" "$SHIRO/"
cp "$SHIROI/.drone.yml" "$SHIRO/"
cp "$SHIROI/NOTE.md" "$SHIRO/"
cp "$SHIROI/SAY.md" "$SHIRO/"
cp "$SHIROI/setup-git.sh" "$SHIRO/"
cp "$SHIROI/bump.config.ts" "$SHIRO/"
```

**Step 2: Copy .github directory**

```bash
cp -R "$SHIROI/.github" "$SHIRO/"
```

**Step 3: Copy .vscode directory**

```bash
cp -R "$SHIROI/.vscode" "$SHIRO/"
```

---

### Task 3: Copy apps/web from Shiroi

**Step 1: Copy entire apps/web**

```bash
mkdir -p "$SHIRO/apps"
cp -R "$SHIROI/apps/web" "$SHIRO/apps/"
```

---

### Task 4: Copy packages/types from Shiroi

**Step 1: Copy types package only**

```bash
mkdir -p "$SHIRO/packages"
cp -R "$SHIROI/packages/types" "$SHIRO/packages/"
```

---

### Task 5: Clean Root package.json

**Files:**
- Modify: `package.json`

**Step 1: Remove rich-* related scripts**

Remove `build:rich`, `publish:rich`, `release:rich` scripts from root package.json. Keep `build`, `dev`, `lint`, `prepare`, `release`, `release:dry`.

**Step 2: Rename project**

Change `"name": "shiroi"` to `"name": "shiro"`.

---

### Task 6: Remove i18n System

This is the most complex removal. All routes live under `[locale]/`.

**Files:**
- Remove: `apps/web/src/i18n/` (entire directory)
- Remove: `apps/web/src/messages/` (entire directory)
- Remove: `apps/web/src/atoms/translation.ts`
- Remove: `apps/web/src/components/layout/footer/LocaleSwitcher.tsx`
- Remove: `apps/web/src/components/common/DayjsLocaleSync.tsx`
- Remove: `apps/web/src/providers/root/intl-provider.tsx`
- Remove: `apps/web/src/providers/root/lang-sync-provider.tsx`
- Modify: `apps/web/next.config.mjs` - remove next-intl plugin
- Modify: `apps/web/package.json` - remove `next-intl` dependency

**Step 1: Remove i18n directories**

```bash
rm -rf "$SHIRO/apps/web/src/i18n"
rm -rf "$SHIRO/apps/web/src/messages"
```

**Step 2: Flatten [locale] routes**

Move all contents from `apps/web/src/app/[locale]/` up to `apps/web/src/app/`:

```bash
# Move contents up, merging with existing app/ files
cp -R "$SHIRO/apps/web/src/app/[locale]/"* "$SHIRO/apps/web/src/app/"
rm -rf "$SHIRO/apps/web/src/app/[locale]"
```

**Step 3: Remove i18n components and providers**

```bash
rm -f "$SHIRO/apps/web/src/atoms/translation.ts"
rm -f "$SHIRO/apps/web/src/components/layout/footer/LocaleSwitcher.tsx"
rm -f "$SHIRO/apps/web/src/components/common/DayjsLocaleSync.tsx"
rm -f "$SHIRO/apps/web/src/providers/root/intl-provider.tsx"
rm -f "$SHIRO/apps/web/src/providers/root/lang-sync-provider.tsx"
```

**Step 4: Remove next-intl from next.config.mjs and package.json**

Remove `next-intl` plugin wrapping and dependency.

**Step 5: Search and replace all `useTranslations`/`getTranslations`/`useLocale` usages**

Replace i18n function calls with hardcoded Chinese strings or remove the translated text.

---

### Task 7: Remove AI Features

**Files:**
- Remove: `apps/web/src/components/modules/ai/` (entire directory)
- Remove: `apps/web/src/components/modules/shared/SummarySwitcher.tsx`
- Modify: Post/note pages to remove AI summary references

**Step 1: Delete AI module directory**

```bash
rm -rf "$SHIRO/apps/web/src/components/modules/ai"
rm -f "$SHIRO/apps/web/src/components/modules/shared/SummarySwitcher.tsx"
```

**Step 2: Remove AI imports from post/note pages**

Search for and remove AI-related imports and component usages.

---

### Task 8: Remove Visual Effects

**Files:**
- Remove: `apps/web/src/components/ui/background/` (entire directory)
- Remove: `apps/web/src/workers/` (if exists, for WebGPU workers)
- Remove: `apps/web/src/lib/noise.ts`
- Remove: `apps/web/src/types/webgpu-shim.d.ts`

```bash
rm -rf "$SHIRO/apps/web/src/components/ui/background"
rm -rf "$SHIRO/apps/web/src/workers"
rm -f "$SHIRO/apps/web/src/lib/noise.ts"
rm -f "$SHIRO/apps/web/src/types/webgpu-shim.d.ts"
```

---

### Task 9: Remove Presence/Activity System

**Files:**
- Remove: `apps/web/src/components/modules/activity/` (entire directory)
- Remove: `apps/web/src/atoms/activity.ts`
- Remove: `apps/web/src/atoms/hooks/activity.ts`
- Remove: `apps/web/src/models/activity.ts`
- Remove: `apps/web/src/queries/definition/activity.ts`
- Remove: `apps/web/src/socket/handlers/activity.ts`
- Remove: `apps/web/src/components/layout/header/internal/Activity.tsx`

```bash
rm -rf "$SHIRO/apps/web/src/components/modules/activity"
rm -f "$SHIRO/apps/web/src/atoms/activity.ts"
rm -f "$SHIRO/apps/web/src/atoms/hooks/activity.ts"
rm -f "$SHIRO/apps/web/src/models/activity.ts"
rm -f "$SHIRO/apps/web/src/queries/definition/activity.ts"
rm -f "$SHIRO/apps/web/src/socket/handlers/activity.ts"
rm -f "$SHIRO/apps/web/src/components/layout/header/internal/Activity.tsx"
```

---

### Task 10: Remove Thinking System Enhancements

**Files:**
- Remove: `apps/web/src/app/thinking/` (flattened from [locale]) - detail page, feed, comments
- Remove: `apps/web/src/socket/handlers/recently.ts`

```bash
rm -rf "$SHIRO/apps/web/src/app/thinking"
rm -f "$SHIRO/apps/web/src/socket/handlers/recently.ts"
```

---

### Task 11: Remove Categories & Tags Pages

**Files:**
- Remove: `apps/web/src/app/categories/` (flattened from [locale])
- Remove: `apps/web/src/app/posts/tag/`

```bash
rm -rf "$SHIRO/apps/web/src/app/categories"
rm -rf "$SHIRO/apps/web/src/app/posts/tag"
```

---

### Task 12: Remove Home Page Enhancements

**Files:**
- Remove/simplify: `apps/web/src/app/(home)/` - strip Hero, Windsock, Timeline, ActivityScreen etc.

Remove enhanced home components (Hero, Windsock, HomePageTimeLine, ActivityCard, ActivityScreen, ActivityRecent, ActivityPostList, TwoColumnLayout).

---

### Task 13: Remove Timeline

**Files:**
- Remove: `apps/web/src/app/timeline/` (flattened)
- Remove: `apps/web/src/components/modules/timeline/`

```bash
rm -rf "$SHIRO/apps/web/src/app/timeline"
rm -rf "$SHIRO/apps/web/src/components/modules/timeline"
```

---

### Task 14: Remove Passkey Auth

**Files:**
- Remove: `apps/web/src/routes/passkey/`
- Remove: `apps/web/src/lib/authn.ts`

```bash
rm -rf "$SHIRO/apps/web/src/routes/passkey"
rm -f "$SHIRO/apps/web/src/lib/authn.ts"
```

---

### Task 15: Remove Comment Enhancements

**Files:**
- Modify: `apps/web/src/components/modules/comment/` - remove inline editing, action button group enhancements

Remove `CommentActionButtonGroup.tsx` enhanced features (edit functionality). Keep basic comment display and reply.

---

### Task 16: Remove Dashboard

**Files:**
- Remove: `apps/web/src/app/(dashboard)/` (entire directory)
- Remove: `apps/web/src/components/modules/dashboard/` (entire directory)

```bash
rm -rf "$SHIRO/apps/web/src/app/(dashboard)"
rm -rf "$SHIRO/apps/web/src/components/modules/dashboard"
```

---

### Task 17: Remove OpenPanel Analytics

**Files:**
- Remove: `apps/web/src/lib/openpanel.ts`
- Remove: `apps/web/src/components/common/OpenPanelInit.tsx`
- Remove: `apps/web/src/app/analyze.tsx` (flattened)

```bash
rm -f "$SHIRO/apps/web/src/lib/openpanel.ts"
rm -f "$SHIRO/apps/web/src/components/common/OpenPanelInit.tsx"
rm -f "$SHIRO/apps/web/src/app/analyze.tsx"
```

---

### Task 18: Remove Translation System

**Files:**
- Remove: `apps/web/src/components/modules/translation/` (entire directory)
- Remove: `apps/web/src/socket/handlers/translation.ts`

```bash
rm -rf "$SHIRO/apps/web/src/components/modules/translation"
rm -f "$SHIRO/apps/web/src/socket/handlers/translation.ts"
```

---

### Task 19: Cleanup Dependencies

**Files:**
- Modify: `apps/web/package.json`

Remove unused dependencies:
- `next-intl` (i18n)
- `@openpanel/nextjs` (analytics)
- `@simplewebauthn/browser` (passkey)
- `@lexical/*` (dashboard rich editor)
- Any other deps only used by removed features

---

### Task 20: Fix Broken Imports & Build

**Step 1: Search for broken imports**

Grep for imports referencing removed modules and fix them.

**Step 2: Remove references to removed components from layout files, providers, etc.**

**Step 3: Attempt build**

```bash
cd "$SHIRO" && pnpm install && pnpm build
```

Fix any build errors iteratively.

---

### Task 21: Final Cleanup

- Remove `apps/web/src/app/(dashboard)/` references from any navigation
- Remove Shiroi-specific branding (if any)
- Ensure all `useTranslations` calls are replaced
- Remove unused provider wrappers
- Clean up socket handler registrations
