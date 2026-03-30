# CLAUDE.md — 萬華世界の維醺志士

> Last updated: 2026-03-30

## Project Overview

「萬華世界の維醺志士」是一系列傳統土佐（高知）座敷飲酒遊戲的手機 Web App，部署在 Vercel。在萬華世界居酒屋裡，客人圍著同一台手機（或 iPad）玩。環境昏暗、吵雜，玩家可能已經醉了。

**品牌梗**：維醺志士 = 維新志士的諧音（醉醺醺的志士）

## Tech Stack

- 單一 HTML 檔案架構（inline CSS + JS，無 build 工具）
- PWA（manifest.json + sw.js，可加入主畫面、離線使用）
- Google Fonts：Noto Serif JP（標題/杯名）+ Noto Sans JP（UI）+ Inter（數字）
- Web Speech API（SpeechSynthesis）— 雙語語音 ja-JP / zh-TW
- Web Audio API — SFX 音效合成（click / spin / flip / drink / win）
- HTML Audio — MP3 BGM（健身操 + 月夜思鄉 + 夏日廟會 + 祭典夜晚）
- Umami Cloud 數據分析（自訂事件追蹤遊玩行為）
- CSS Custom Properties 居酒屋深色主題
- GitHub repo → Vercel 自動部署

## 檔案結構

```
kochi-games/
├── index.html          # 首頁（遊戲選單）
├── bekuhai.html        # 可杯（獨樂酒杯遊戲）— 已完成大量 UI 優化 + 自訂頭像
├── kikuhai.html        # 菊之花（清酒版俄羅斯輪盤）— 基礎版完成
├── hashiken.html       # 箸拳（1v1 AI 對戰）— 已完成大改版（教學+AI角色+MP3 BGM）
├── bgm-kenshinso.mp3   # 健身操 BGM（3MB）— 可杯專用
├── 月夜思鄉.mp3        # 月夜思鄉 BGM（3.4MB）— 兩遊戲共用
├── 夏日廟會.mp3        # 夏日廟會 BGM（3.1MB）— 兩遊戲共用
├── 祭典夜晚.mp3        # 祭典夜晚 BGM（3.0MB）— 兩遊戲共用
├── manifest.json       # PWA manifest（app name: 乾杯！維醺志士）
├── sw.js               # Service Worker（離線快取）
├── icon-192.png        # PWA icon 192x192（天狗杯派對圖）
├── icon-512.png        # PWA icon 512x512
├── cup-tengu-clear.png # 天狗杯（乾淨去背版，目前使用）
├── cup-hyottoko-clear.png # 火男杯（乾淨去背版）
├── cup-okame-clear.png # 阿龜杯（乾淨去背版）
├── cup-tengu-splash.png # 天狗杯（GameOver 用）
├── koma-1.png          # 六角陀螺角度 1
├── koma-2.png          # 六角陀螺角度 2
├── koma-3.png          # 六角陀螺角度 3
├── 你-head.png         # 舊頭像（已不使用）
├── 政道-head.png       # 政道 Q版頭像
├── fish-head.png       # Fish Q版頭像
├── winnie-head.png     # Winnie Q版頭像
├── 蔡旻辰-head.png     # 蔡旻辰 Q版頭像
├── 小光頭-head.png     # 小光頭 Q版頭像
├── 琬蒨-head.png       # 琬蒨 Q版頭像
├── yy-head.png         # YY Q版頭像
├── kaya-head.png       # Kaya Q版頭像
├── analytics-intro.html # 數據追蹤方案說明頁（團隊分享用，noindex）
├── table-tent.html     # 沙龍分享用地牌（A5，含 QR code，noindex）
├── table-tent-red.html # 地牌朱紅配色版
├── table-tent-blue.html# 地牌藏藍配色版
```

## 三個遊戲的使用模式

| 遊戲 | 人數 | 手機使用方式 | 狀態 |
|------|------|------------|------|
| **可杯** bekuhai | 4～8 人 | 手機平放桌上，大家圍著看 | ✅ UI 優化 + 自訂頭像 |
| **菊之花** kikuhai | 不限（不輸入名字）| 手機放桌上，推到不同人面前翻杯 | ⚠️ 基礎版完成，需要 UI 優化 |
| **箸拳** hashiken | 1 人 vs AI | 一人手持手機對戰 AI（大將） | ✅ 大改版完成 |

## Conventions

### I18N 系統
- `I18N` 物件 + `t(key, params)` + `data-i18n` 屬性
- 語言切換只在首頁（Welcome），遊戲中不能切換（會 hang）
- VoiceManager 支援 jaVoice + zhVoice

### 音頻規則
- **所有 BGM 皆為 MP3**（已移除所有合成 BGM oscillator 代碼）
- **兩段音量控制**：🔇 靜音 ↔ 🔊 有聲，`localStorage 'kochi-vol'` 跨遊戲共用（太大聲調手機音量）
- `VOL_PRESETS` 陣列只有 2 段：`[{靜音}, {bgm:0.5, sfx:1.0, voice:1.0}]`
- Voice volume = 1.0（要切過環境噪音）
- MP3 BGM 靜音用 pause/play，不用 volume=0
- `_bgmCache` 物件快取 Audio 元素，避免重複建立
- 所有音頻需要使用者首次互動才能啟動（瀏覽器限制）
- CTA 按鈕點擊時播放 click SFX（所有遊戲 + 首頁卡片）

### 設計規範
- Safe area: `env(safe-area-inset-*)` 處理瀏海/Dynamic Island
- 橫屏遮罩：📱 旋轉動畫提示
- 控制按鈕 48px（小螢幕 44px）
- CTA 按鈕 min-height 56px
- `--cream-dim: #c4b496`（提升對比度）
- 字體載入用 `<link>` preconnect，不用 `@import`
- 木紋背景桌面風格（bekuhai table-screen）

### 可杯玩家系統
- 預設玩家名：1=政道, 2=Fish, 3=Winnie, 4=蔡旻辰, 5=小光頭, 6=琬蒨, 7=YY, 8=Kaya（預設 5 人，支援 4～8 人）
- **自訂頭像**：座席安排頁點頭像 → 放大預覽 + 「更換頭像」按鈕 → 從相簿選照片
  - Canvas API 壓縮至 200×200px JPEG（quality 0.7，~20KB）
  - 存 `localStorage 'kochi-avatar-{playerIndex}'`，跨 session 保留
  - 「重設」按鈕恢復預設 Q 版頭像
  - 遊戲桌面、排行榜也會顯示自訂頭像

### 數據分析（Umami Cloud）
- **Website ID**: `6de48909-2353-4e99-87fa-854079eba9f8`
- 四個 HTML 頁面（index/bekuhai/kikuhai/hashiken）皆有 Umami script tag
- 自訂事件定義：
  - `bekuhai-start` → {players, lang}
  - `bekuhai-complete` → {players, rounds, duration, lang}
  - `kikuhai-start` → {cups, lang}
  - `kikuhai-complete` → {cups, penalty, flipped, duration, lang}
  - `hashiken-start` → {lang, tutorialSkipped}
  - `hashiken-complete` → {winner, playerScore, aiScore, rounds, duration, lang}
  - `bgm-switch` → {game, to}
- Dashboard: [cloud.umami.is](https://cloud.umami.is)
- 說明頁面: `analytics-intro.html`（noindex，團隊分享用）
- ⚠️ **新增遊戲或事件時，記得更新 Umami 事件埋設 + analytics-intro.html**

## Current Status

功能清單詳見 [README.md](README.md)。三個遊戲皆已上線，首頁統一標「萬華獨家」。

### 🔜 Next Steps / Known Issues

- **菊之花 UI 優化**：需要像可杯一樣做畫面逐頁微調（UX 細節）
- **iPad pixel perfection**：三個遊戲都需要更精緻的 iPad 排版調整
- **遊戲中切換語言會 hang**：已移除遊戲中的語言切換按鈕作為 workaround

## Deployment

```bash
# 開發：直接瀏覽器開啟 HTML
open bekuhai.html

# 部署：push 到 GitHub，Vercel 自動部署
git add <files> && git commit -m "message" && git push

# 線上網址
# https://kochi-games.vercel.app/
```

## Common Pitfalls

- **Edit tool "not unique" 錯誤**：bekuhai.html 有 ja/zh 兩段 I18N，改字串時要提供足夠上下文區分
- **Edit tool "file not read" 錯誤**：長檔案在多次編輯後需要重新 read 才能繼續 edit
- **遊戲中切換語言會 hang**：根本原因未修，目前用隱藏語言按鈕 workaround
- **手機語音 unlock**：必須在使用者首次 touchstart/click 時呼叫 unlockSpeech()
- **改完檔案要記得 push**：之前多次改了本地但忘記 push，使用者在線上看不到更新
- **PWA icon 不會自動更新**：改了 icon 後使用者需要刪除主畫面捷徑重新加入
- **菊之花翻杯間語音重疊**：需要 await speakAsync 等語音講完，加按鈕讓玩家控制節奏
- **菊之花 renderCups 閃爍**：`renderCups()` 只在開局/新一輪呼叫，`startTurn()` 不重建 DOM（已修）
- **next-round 按鈕 z-index**：不要把按鈕放在 `.seat` 元素內，應 append 到 `table-layout` 並用 z-index:50
- **自訂頭像 localStorage 容量**：200×200 JPEG ~20KB × 8 人 = ~160KB，遠低於 5MB 上限
- **自訂頭像按 playerIndex 存**：key 是 `kochi-avatar-{index}`（不是 name），改名不影響頭像
