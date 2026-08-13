# Chinese Translation Gap Audit for DeepSeek Harness Web UI

**Audit Date:** 2026-08-14
**Audited Repository:** `C:\Users\User\.zcode\workspace\default\deepseek-harness`
**Scope:** `packages/client/` — Web UI locale system and hardcoded strings

---

## Section 1: Locale System Status

### 1.1 Core Locale Package (`packages/client/locale/`)

| File | Status | Notes |
|------|--------|-------|
| `src/locales/zh.ts` | Complete | 25 common keys defined |
| `src/locales/en.ts` | Complete | All 25 keys match zh.ts (enforced via `satisfies Record<CommonKey, string>`) |

**Key finding:** The core locale system is fully synchronized between zh and en.

### 1.2 UI Package Locale Files (`packages/client/ui-*/src/client/locales.ts`)

**Total UI packages with locales.ts:** 23

All 23 packages have both `zh` and `en` dictionaries with synchronized keys:
- ui-agent-preset, ui-commands, ui-conversation, ui-deliverables, ui-goal, ui-input-trigger, ui-jobs, ui-message-feedback, ui-model-selection, ui-permission-presets, ui-plan, ui-settings-general, ui-settings-models, ui-settings-plugin-inventory, ui-settings-plugins, ui-sidebar, ui-skill, ui-subagent, ui-theme, ui-trajectory, ui-user-questions, ui-workflow-run, ui-workspace

### 1.3 Critical: Untranslated Strings in zh Dictionary

**File:** `packages/client/ui-trajectory/src/client/locales.ts`

The trajectory package `zh` dictionary contains **9 English strings** that are NOT translated to Chinese:

```
Line 34: 'toolbar.duration': 'Duration'           (should be: '时长')
Line 35: 'toolbar.useActualDuration': 'Use actual duration'  (should be: '使用实际时长')
Line 36: 'toolbar.useEqualWidth': 'Use equal-width operations' (should be: '使用等宽操作')
Line 38: 'toolbar.turns': 'Turns'                (should be: '轮次')
Line 39: 'toolbar.expandTurns': 'Expand turns'   (should be: '展开轮次')
Line 40: 'toolbar.collapseTurns': 'Collapse turns' (should be: '收起轮次')
Line 41: 'toolbar.calls': 'Calls'                (should be: '调用')
Line 42: 'toolbar.expandCalls': 'Expand calls'   (should be: '展开调用')
Line 43: 'toolbar.collapseCalls': 'Collapse calls' (should be: '收起调用')
```

**Severity:** HIGH — These strings appear in the trajectory toolbar UI and will display English text to Chinese users.

---

## Section 2: Missing Translations

**Status:** No key mismatches found between zh and en dictionaries.

All 23 UI package locale files have perfect key synchronization. However, the trajectory package zh dictionary contains English values instead of Chinese translations (see Section 1.3).

---

## Section 3: Hardcoded English in Components

### 3.1 ui-trajectory (Highest Impact)

**File:** `packages/client/ui-trajectory/src/client/TrajectoryTable.tsx`

Timing metrics labels (lines 337-341):
- Line 337: `>Started<`
- Line 338: `>Total duration<`
- Line 339: `>TTFT<`
- Line 340: `>Generation<`
- Line 341: `>Throughput<`

Token usage labels (lines 690-758):
- Line 690: `>Tokens<`
- Line 695: `>Reasoning<`
- Line 701: `>Content<`
- Line 727: `>Input<`
- Line 731: `>Cached<`
- Line 737: `>Cache created<`
- Line 743: `>Other<`
- Line 748: `>Output<`

Timing source labels (lines 1455-1493):
- Line 1455: `>Started<`
- Line 1456: `>Duration<`
- Line 1457: `>Timing source<` with hardcoded `'Not available'` and `'Session timestamps'`
- Line 1478: `>Started<`
- Line 1479: `>Duration<`
- Line 1481: `>Timing source<`
- Line 1490: `>Started<`
- Line 1493: `>Duration<`

Tab labels (lines 211-221):
- Line 211: `{ id: 'tools', label: 'Tools' }`
- Line 214: `{ id: 'diff', label: 'Diff' }`
- Line 218: `{ id: 'overview', label: 'Summary' }`
- Line 219: `{ id: 'options', label: 'Options' }`
- Line 220: `{ id: 'usage', label: 'Usage' }`
- Line 221: `{ id: 'timing', label: 'Timing' }`

Request metadata labels (lines 2705-2771):
- Line 2705: `>Status<`
- Line 2712: `>Purpose<`
- Line 2713: `>Compaction<`
- Line 2719: `>Provider<`
- Line 2729: `>Model<`
- Line 2737: `>Tool calls<`
- Line 2742: `>Subtool calls<`
- Line 2748: `>Error<`
- Line 2754: `>Retry<`
- Line 2765: `>Retry delay<`
- Line 2771: `>Result<`

Section headings:
- Line 776: `>This request<`
- Line 780: `>Session cumulative<`
- Line 1602: `>Parameters<`

Hardcoded string constants:
- Line 266: `'Not available'`
- Line 326: `'Output tokens unavailable'`
- Line 964: `'Tool call only'`
- Line 1428: `'Tool call only'`
- Line 1575: `'No output'`
- Line 2501: `'No output'`

Tab labels (lines 902-921):
- Line 903: `{ id: 'raw', label: 'Raw Output' }`
- Line 909: `{ id: 'rendered', label: 'Preview' }`
- Line 910: `{ id: 'raw', label: 'Raw' }`
- Line 913: `{ id: 'source', label: 'Source' }`
- Line 918: `{ id: 'input', label: 'Payload' }`
- Line 919: `{ id: 'output', label: 'Result' }`
- Line 920: `{ id: 'schema', label: 'Schema' }`

**File:** `packages/client/ui-trajectory/src/client/TrajectoryTurnHeader.tsx`
- Line 5: `const COLUMN_LABELS = ['Input', 'Output', 'Think', 'Time'] as const`
- Line 21: `>Turn {turn}<`

**File:** `packages/client/ui-trajectory/src/client/TrajectoryTimeline.tsx`
- Line 117: `'Started ${formatRecordedTime(detail.startedAt)}'`
- Line 191: `>Input<`
- Line 192: `>Model<`
- Line 193: `>Tools<`
- Line 387: `>No timing data<`

### 3.2 ui-conversation

**File:** `packages/client/ui-conversation/src/client/chat/ReasoningRow.tsx`
- Line 49: `title="Think"`

### 3.3 ui-tool

**File:** `packages/client/ui-tool/src/client/tool/components/ToolRow.tsx`
- Line 274: `>IN<`
- Line 283: `>OUT<`

**File:** `packages/client/ui-tool/src/client/tool/toolviews/bash-sample.tsx`
- Line 137: `>IN<`
- Line 146: `>OUT<`

### 3.4 ui-skill

**File:** `packages/client/ui-skill/src/client/SkillRow.tsx`
- Line 149: `>Skill<`

### 3.5 ui-primitives

**File:** `packages/client/ui-primitives/src/markdown/render.tsx`
- Line 579: `>Footnotes<`

**File:** `packages/client/ui-primitives/src/WebBlock.tsx`
- Line 188: `>HTTP {statusCode}<`

### 3.6 ui-settings-models

**File:** `packages/client/ui-settings-models/src/client/CustomProviderCard.tsx`
- Line 201: `placeholder="acme-gateway"`
- Line 230: `placeholder="https://gateway.example/v1"`

---

## Section 4: Known Limitations from Official Documentation

**Source:** `packages/client/locale/README.md` — "Known Limitations and Deferred Work"

1. **Some surfaces keep inline copy** — Settings rows, the sidebar, question composer, and model select use locale seats; other packages still own static text directly.

2. **Registry-held text reads its translation once** — Copy captured at registration time outside the slot render path (e.g. the `/model` command description in the command registry) keeps the language it was registered under until re-registration; slot-rendered copy follows switches live.

### Official Documentation vs Audit Findings

The official documentation acknowledges that "other packages still own static text directly." Our audit confirms this is a significant issue, particularly in:
- `ui-trajectory` — Most severely affected with 50+ hardcoded English strings
- `ui-conversation` — Hardcoded "Think" title
- `ui-tool` — Hardcoded "IN"/"OUT" labels
- `ui-skill` — Hardcoded "Skill" label
- `ui-primitives` — Hardcoded "Footnotes" and "HTTP" labels

---

## Section 5: Summary and Prioritized Recommendations

### Critical Issues (Immediate Fix Required)

1. **Trajectory toolbar zh dictionary** — 9 keys in `packages/client/ui-trajectory/src/client/locales.ts` need Chinese translations
2. **TrajectoryTable.tsx hardcoded strings** — 50+ dt/dd labels and status messages need locale keys
3. **Hardcoded "Think" title** — `packages/client/ui-conversation/src/client/chat/ReasoningRow.tsx:49`

### High-Priority Issues

1. **IN/OUT labels** — `packages/client/ui-tool/src/client/tool/components/ToolRow.tsx` lines 274, 283 and `bash-sample.tsx` lines 137, 146
2. **Skill label** — `packages/client/ui-skill/src/client/SkillRow.
tsx:149`
3. **Turn label** — `packages/client/ui-trajectory/src/client/TrajectoryTurnHeader.tsx:21`
4. **Column labels** — `packages/client/ui-trajectory/src/client/TrajectoryTurnHeader.tsx:5`

### Medium-Priority Issues

1. **Technical labels** — Column headers, section titles, and status messages in trajectory package
2. **Placeholder text** — `packages/client/ui-settings-models/src/client/CustomProviderCard.tsx`
3. **Accessibility labels** — `packages/client/ui-primitives/src/markdown/render.tsx:579`

### Estimated Translation Work

| Category | String Count | Effort |
|----------|--------------|--------|
| Trajectory toolbar (zh dictionary) | 9 strings | Low |
| TrajectoryTable.tsx hardcoded | ~50 strings | High |
| TrajectoryTurnHeader.tsx | 5 strings | Low |
| TrajectoryTimeline.tsx | 4 strings | Low |
| Other packages (tool, skill, conversation, primitives) | ~10 strings | Medium |
| **Total** | **~78 strings** | **Medium-High** |

---

## Appendix A: File Reference

### Core Locale Files
- `packages/client/locale/src/locales/zh.ts` — Common Chinese dictionary
- `packages/client/locale/src/locales/en.ts` — Common English dictionary
- `packages/client/locale/README.md` — Official documentation

### Critical Files Requiring Changes
- `packages/client/ui-trajectory/src/client/locales.ts` — Untranslated zh dictionary values
- `packages/client/ui-trajectory/src/client/TrajectoryTable.tsx` — 50+ hardcoded strings
- `packages/client/ui-trajectory/src/client/TrajectoryTurnHeader.tsx` — Hardcoded labels
- `packages/client/ui-trajectory/src/client/TrajectoryTimeline.tsx` — Hardcoded labels
- `packages/client/ui-conversation/src/client/chat/ReasoningRow.tsx:49` — Hardcoded "Think"
- `packages/client/ui-tool/src/client/tool/components/ToolRow.tsx:274,283` — IN/OUT labels
- `packages/client/ui-skill/src/client/SkillRow.tsx:149` — Hardcoded "Skill"

---

**Audit Completed:** 2026-08-14
**Auditor:** ZCode Explore (automated analysis)
