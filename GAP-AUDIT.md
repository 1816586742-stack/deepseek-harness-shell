# DSH Shell — 中文翻译缺口审计(初版)

> 来源: dsh 仓库 locale 系统快速扫描 (2026-08-14)
> 状态: 初版,agent 详细审计完成后更新

## 1. Locale 系统概况

- **packages/client/locale**: 核心 locale 插件,`zh.ts` (30 行) + `en.ts` (29 行) 常用字典接近对齐
- **packages/client/ui-*/src/client/locales.ts**: 23 个 UI 包各自维护自己的中英字典
- 语言偏好存储: `$DSH_HOME/settings.yaml` 的 `locale.preference`
- 无偏好时跟随浏览器 `navigator.language`,无语言时默认 `zh`

## 2. 官方已知缺口(来自 packages/client/locale/README.md)

- **部分界面仍为硬编码英文**:Settings rows、sidebar、question composer、model select 已接入 locale 座位;其他包仍有静态文本
- **注册时快照**:命令注册表中的文本在注册时读取一次,语言切换后不会更新(slot 渲染的文本会实时切换)

## 3. 需要人工确认的缺口(待 agent 详细审计)

- [ ] 检查 23 个 locales.ts 文件中哪些缺少 zh 条目
- [ ] 检查 en.ts 中有但 zh.ts 中无的翻译条目
- [ ] 检查 React 组件中的硬编码英文字符串(绕过 locale 系统)

## 4. 壳层中文保障(已实现)

- Shell 设置面板提供"跟随系统 / 强制中文 / 强制英文"三选一
- 强制选择时写入 `$DSH_HOME/settings.yaml` 的 `locale.preference`
- 无偏好时 dsh 自动跟随系统语言(中文系统 → 中文界面)

## 5. 上游贡献计划

- 按详细审计结果逐包提 PR 补全缺失翻译
- 遵循上游双语文档约定(每个 README 都有 .zh.md)
- PR 描述引用本审计结果,附前后对比截图
