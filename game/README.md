# 桃花源記 — Phaser 封面

用現有 `TFY_Game_images` 素材砌出的主畫面（參考同系列遊戲封面版面）。

## 啟動

```bash
cd game
python3 -m http.server 5173
```

瀏覽器打開：http://127.0.0.1:5173/

## 畫面內容

- 背景：`MainStreet/stage_stage1`（壓縮版 `assets-opt/cover_bg.jpg`）
- 標題／副標／作者：Phaser 文字
- 左上：設定、說明、計劃資訊按鈕（`GameStart`）
- 中央：遊戲說明、遊戲開始（`GameStart`）
- 點擊說明／資訊會延遲載入對應彈窗頁

## 備註

專案現有圖檔沒有《虞美人》那種整幅封面插畫（大角色＋場景＋標題合成圖），因此以桃花源村莊場景＋同系列 UI 按鈕還原版面。若之後有獨立封面角色圖，可再疊到左側。
