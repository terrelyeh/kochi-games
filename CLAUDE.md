# CLAUDE.md — 萬華世界の維醺志士

> Last updated: 2026-03-20

## Project Overview

「萬華世界の維醺志士」是一系列傳統土佐（高知）座敷飲酒遊戲的手機 Web App，部署在 Vercel。在萬華世界居酒屋裡，客人圍著同一台手機（或 iPad）玩。環境昏暗、吵雜，玩家可能已經醉了。

**品牌梗**：維醺志士 = 維新志士的諧音（醉醺醺的志士）

## Tech Stack

- 單一 HTML 檔案架構（inline CSS + JS，無 build 工具）
- PWA（manifest.json + sw.js，可加入主畫面、離線使用）
- Google Fonts：Noto Serif JP（標題/杯名）+ Noto Sans JP（UI）+ Inter（數字）
- Web Speech API（SpeechSynthesis）— 雙語語音 ja-JP / zh-TW
- Web Audio API — 合成 BGM（shamisen / matsuri）+ MP3 BGM（健身操）
- CSS Custom Properties 居酒屋深色主題
- GitHub repo → Vercel 自動部署

## 檔案結構

```
kochi-games/
├── index.html          # 首頁（遊戲選單）
├── bekuhai.html        # 可杯（獨樂酒杯遊戲）— 82KB, 已完成大量 UI 優化
├── kikuhai.html        # 菊花杯（清酒版俄羅斯輪盤）— 56KB, 剛完成基礎版
├── hashiken.html       # 箸拳（猜拳對戰）— 54KB, 功能完成但 UI 未優化
├── bgm-kenshinso.mp3   # 健身操 BGM（3MB）
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
├── cup-*.png (舊版)    # 舊的去背圖（有白邊，已不使用）
├── export*.svg         # 高品質 SVG（400-600KB，未使用）
```

## 三個遊戲的使用模式

| 遊戲 | 人數 | 手機使用方式 | 狀態 |
|------|------|------------|------|
| **可杯** bekuhai | 4～6 人 | 手機平放桌上，大家圍著看 | ✅ UI 大幅優化完成 |
| **菊花杯** kikuhai | 不限（不輸入名字）| 手機放桌上，推到不同人面前翻杯 | ⚠️ 基礎版完成，需要 UI 優化 |
| **箸拳** hashiken | 1 人 vs AI | 一人手持手機對戰電腦 | ⚠️ 功能完成，UI 未優化，index 設為 coming soon |

## Conventions

### I18N 系統
- `I18N` 物件 + `t(key, params)` + `data-i18n` 屬性
- 語言切換只在首頁（Welcome），遊戲中不能切換（會 hang）
- VoiceManager 支援 jaVoice + zhVoice

### 音頻規則
- BGM 壓低（musicGain 0.25-0.6），SFX 較大（0.5）
- Voice volume = 1.0（要切過環境噪音）
- 語音播放時 BGM 自動 duck（降低音量）
- MP3 BGM 靜音用 pause/play，不用 volume=0
- 所有音頻需要使用者首次互動才能啟動（瀏覽器限制）

### 設計規範
- Safe area: `env(safe-area-inset-*)` 處理瀏海/Dynamic Island
- 橫屏遮罩：📱 旋轉動畫提示
- 控制按鈕 48px（小螢幕 44px）
- CTA 按鈕 min-height 56px
- `--cream-dim: #c4b496`（提升對比度）
- 字體載入用 `<link>` preconnect，不用 `@import`
- 木紋背景桌面風格（bekuhai table-screen）

### 可杯預設玩家名
1=你, 2=政道, 3=Fish, 4=Winnie, 5=蔡旻誠, 6=小光頭

## Current Status

### ✅ Completed

- **可杯 UI 大改版**：木紋圓桌俯瞰、真實杯子/陀螺 PNG、座墊式座位、全螢幕 Overlay 優化
- **可杯語音系統**：每種杯型 4 句隨機語音（含維醺志士梗）、中日雙語
- **菊花杯基礎版**：6/9/12/15 杯模式、翻杯動畫、緊張感語音、iPad RWD
- **手機優先框架**：Safe area、橫屏遮罩、觸控優化、字體載入優化
- **首頁**：可杯（萬華獨家）→ 菊花杯 → 箸拳（coming soon）
- **自製確認彈窗**：取代原生 confirm()
- **PWA 支援**：manifest + service worker + 自訂 icon（乾杯！維醺志士）
- **杯子圖片換乾淨去背版**：cup-*-clear.png（使用者重新去背提供）
- **菊花杯語音節奏修復**：翻杯後加「下面一位〜」按鈕，語音不再被截斷
- **聲音提醒 toast**：進入設定頁時提示開啟手機聲音

### ⚠️ Pending / Known Issues

- **菊花杯 UI 優化**：需要像可杯一樣做畫面逐頁微調（UX 細節）
- **可杯真人頭像**：使用者將提供 6 張夥伴的 cute 版頭像替換 emoji
- **iPad pixel perfection**：兩個遊戲都需要更精緻的 iPad 排版調整
- **箸拳 UI 優化**：目前設為 coming soon，等菊花杯完成後再做
- **遊戲中切換語言會 hang**：已移除遊戲中的語言切換按鈕作為 workaround
- **export*.svg 未使用**：高品質但太大（400-600KB），目前用 PNG

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
- **MP3 BGM 與合成 BGM 音量差異大**：MP3 走 Audio 元素（volume 0.08），合成走 AudioContext（gain 0.6）
- **手機語音 unlock**：必須在使用者首次 touchstart/click 時呼叫 unlockSpeech()
- **SVG 檔案太大無法直接 Read**：需要用 offset/limit 分段讀
- **改完檔案要記得 push**：之前多次改了本地但忘記 push，使用者在線上看不到更新
- **PWA icon 不會自動更新**：改了 icon 後使用者需要刪除主畫面捷徑重新加入
- **safe-overlay 的 pointer-events**：之前設了 pointer-events:none 導致按鈕無法點擊，已修復
- **菊花杯翻杯間語音重疊**：需要 await speakAsync 等語音講完，加按鈕讓玩家控制節奏
