# DSH Shell

[English](README.md) | 中文

> [!IMPORTANT]
> **社区项目。** 本项目由社区维护,与 DeepSeek(deepseek-ai)及官方 DeepSeek Harness 团队**无隶属关系**。问题与支持请在本仓库提出,不要提交到官方仓库。

DSH Shell 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(`dsh`)的全平台桌面壳:启动本地 Harness 实例,在桌面窗口里打开官方 Web UI,并常驻托盘 —— 无需安装 Node.js、pnpm,也无需打开终端。

## 状态

早期预览版。上游 `dsh` 本身处于 developer preview,迭代迅速且存在破坏性变更;本壳锁定精确的 `dsh` 版本并跟随上游发布。

## 特性

- 双击即用 —— 壳自动管理 Harness 进程与自动分配的端口
- Windows/Linux 关窗驻留托盘,macOS 常驻 Dock
- 可选开机自启(默认关闭)
- 界面语言跟随系统,可在壳设置中强制中文/英文
- Windows/Linux 自动更新;macOS 在签名前手动更新
- 全平台:Windows(NSIS 安装包 + 便携版)、macOS(DMG)、Linux(AppImage、deb)

## 安装

从 [Releases](https://github.com/deepseek-harness-shell/deepseek-harness-shell/releases) 页面下载对应平台的安装包。

| 平台 | 安装包 |
| --- | --- |
| Windows x64 | `*-setup.exe`(安装包)或 `*-portable.exe`(便携版) |
| macOS(Apple Silicon / Intel) | `*.dmg` |
| Linux | `*.AppImage` 或 `*.deb` |

## 更新

- **Windows / Linux:** 自动从 GitHub Releases 获取更新。
- **macOS:** 在构建签名公证之前,请从 Releases 页面手动下载替换。

## 卸载

- Windows:设置 → 应用,或使用安装目录中的卸载程序。
- macOS:将应用从「应用程序」拖入废纸篓。
- Linux:AppImage 直接删除;deb 用包管理器移除。

## 未签名构建(SmartScreen / Gatekeeper)

当前构建**未做代码签名**:

- **Windows SmartScreen**(「Windows 已保护你的电脑」):点击 *更多信息* → *仍要运行*。未签名的 Electron 应用被杀软误报很常见,可对照每个 Release 发布的校验和核验文件哈希。
- **macOS Gatekeeper**(提示「应用已损坏」或「无法验证开发者」):在终端执行 `xattr -cr /Applications/DSH\ Shell.app`,或右键应用 → *打开*。

签名与公证已列入后续版本计划。

## 开发

要求:Node.js ≥ 22.19(推荐 ≥ 24)、npm。

```sh
npm install
npm run dev        # 开发模式运行
npm run typecheck  # 类型检查
npm test           # 单元测试
npm run build      # 生产构建
```

## 许可证

[MIT](LICENSE)。第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
