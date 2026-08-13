# DSH Shell

English | [中文](README.zh.md)

> [!IMPORTANT]
> **Community project.** This project is maintained by the community and has **no affiliation with DeepSeek (deepseek-ai) or the official DeepSeek Harness team.** Issues and support are handled here, not in the official repositories.

DSH Shell is a cross-platform desktop shell for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`): it launches a local Harness instance, opens the official web UI in a desktop window, and lives in your tray — no Node.js, pnpm, or terminal required.

## Status

Early preview. Upstream `dsh` is itself in developer preview and iterates quickly with compatibility-breaking changes; this shell pins an exact `dsh` version and follows upstream releases.

## Features

- Double-click to launch — the shell manages the Harness process and an automatically assigned port
- Close-to-tray on Windows/Linux, Dock-resident on macOS
- Optional launch-at-login (off by default)
- UI language follows the system; zh/en can be forced in shell settings
- Automatic updates on Windows/Linux; manual updates on macOS until builds are signed
- All platforms: Windows (NSIS installer + portable), macOS (DMG), Linux (AppImage, deb)

## Install

Download the latest package for your platform from the [Releases](https://github.com/deepseek-harness-shell/deepseek-harness-shell/releases) page.

| Platform | Package |
| --- | --- |
| Windows x64 | `*-setup.exe` (installer) or `*-portable.exe` |
| macOS (Apple Silicon / Intel) | `*.dmg` |
| Linux | `*.AppImage` or `*.deb` |

## Update

- **Windows / Linux:** updates are delivered automatically from GitHub Releases.
- **macOS:** until builds are code-signed and notarized, download and replace the app manually from the Releases page.

## Uninstall

- Windows: Settings → Apps, or the uninstaller in the install directory.
- macOS: drag the app from Applications to Trash.
- Linux: AppImage is deleted directly; deb is removed with your package manager.

## Unsigned builds (SmartScreen / Gatekeeper)

Current builds are **not code-signed**:

- **Windows SmartScreen** ("Windows protected your PC"): click *More info* → *Run anyway*. Antivirus false positives on unsigned Electron apps are common; you can verify the file hash against the checksums published in each Release.
- **macOS Gatekeeper** ("app is damaged" or "unidentified developer"): run `xattr -cr /Applications/DSH\ Shell.app` in Terminal, or right-click the app → *Open*.

Signing/notarization is planned for a future release.

## Development

Requirements: Node.js ≥ 22.19 (≥ 24 recommended), npm.

```sh
npm install
npm run dev        # run in dev mode
npm run typecheck  # type checks
npm test           # unit tests
npm run build      # production build
```

## License

[MIT](LICENSE). Third-party dependencies and their licenses: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
