# 桃花源記 — Phaser 封面

用 `TFY_Game_images` 官方封面素材砌出的主畫面。

## 啟動

```bash
cd game
python3 -m http.server 5173
```

瀏覽器打開：http://127.0.0.1:5173/

## 素材來源

| 元素 | 來源 |
| --- | --- |
| 背景＋中間標題＋右上機構 logo | `GameStart/cover.mp4` 靜幀（另存 `cover_still.png`） |
| 左上三掣 | `setting_button` / `game_description_button` / `program_information_button` |
| 遊戲說明／開始 | `cover_game_description_button` / `cover_game_start` |

左上按鈕位置對齊官方專案：`(100,100)`、`(250,100)`、`(400,100)`，scale `1.05`。
