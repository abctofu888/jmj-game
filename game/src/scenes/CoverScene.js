export class CoverScene extends Phaser.Scene {
  constructor() {
    super("CoverScene");
    this.overlay = null;
  }

  create() {
    const { width, height } = this.scale;

    // Official cover art (from GameStart/cover.mp4) already includes
    // the 桃花源記 title logo and top-right organizer/sponsor logos.
    this.add.image(width / 2, height / 2, "cover_bg").setDisplaySize(width, height);

    this.applySavedSettings();
    this.createTopLeftButtons();
    this.createMainButtons(width, height);

    this.overlayRoot = this.add.container(0, 0).setDepth(50).setVisible(false);
  }

  getSavedSettings() {
    try {
      const raw = localStorage.getItem("gameSettings");
      if (raw) return JSON.parse(raw);
    } catch (_) {
      /* ignore */
    }
    return { volume: 3, language: "HK" };
  }

  applySavedSettings() {
    const settings = this.getSavedSettings();
    this.sound.volume = settings.volume * 0.2;
  }

  createTopLeftButtons() {
    // Match official TFY GameStart layout; buttons are larger (native ~161px).
    const scale = 1.05;
    const y = 100;
    const xs = [100, 250, 400];

    this.makeImageButton(xs[0], y, "btn_setting", "btn_setting_hover", scale, () => {
      this.openLazyPopup("settings");
    });
    this.makeImageButton(xs[1], y, "btn_help", "btn_help_hover", scale, () => {
      this.openLazyPopup("desc");
    });
    this.makeImageButton(xs[2], y, "btn_info", "btn_info_hover", scale, () => {
      this.openLazyPopup("info");
    });
  }

  createMainButtons(width, height) {
    const cx = width / 2;
    const scale = 1.0;

    this.makeImageButton(cx, 800, "btn_desc", "btn_desc_hover", scale, () => {
      this.openLazyPopup("desc");
    });

    this.makeImageButton(cx, 900, "btn_start", "btn_start_hover", scale, () => {
      this.showToast("即將進入遊戲…（角色選擇頁待接）");
    });
  }

  makeImageButton(x, y, key, hoverKey, scale, onClick) {
    const btn = this.add
      .image(x, y, key)
      .setScale(scale)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => {
      btn.setTexture(hoverKey);
      btn.setScale(scale * 1.05);
    });
    btn.on("pointerout", () => {
      btn.setTexture(key);
      btn.setScale(scale);
    });
    btn.on("pointerdown", () => {
      btn.setScale(scale * 0.97);
    });
    btn.on("pointerup", () => {
      btn.setScale(scale * 1.05);
      onClick();
    });

    return btn;
  }

  clearOverlay() {
    this.overlayRoot.removeAll(true);
    this.overlayRoot.setVisible(false);
  }

  openLazyPopup(kind) {
    if (kind === "settings") {
      this.openSettings();
      return;
    }

    const needed =
      kind === "desc"
        ? ["popup_desc_1", "popup_desc_2"]
        : ["popup_info_1", "popup_info_2", "popup_info_3", "popup_info_4"];

    const missing = needed.filter((key) => !this.textures.exists(key));
    if (missing.length === 0) {
      this.openPagedPopup(needed);
      return;
    }

    this.showToast("載入內容中…");
    missing.forEach((key) => {
      const fileMap = {
        popup_desc_1: "assets/GameStart/game_description_p1.png",
        popup_desc_2: "assets/GameStart/game_description_p2.png",
        popup_info_1: "assets/GameStart/program_information_p1.png",
        popup_info_2: "assets/GameStart/program_information_p2.png",
        popup_info_3: "assets/GameStart/program_information_p3.png",
        popup_info_4: "assets/GameStart/program_information_p4.png",
      };
      this.load.image(key, fileMap[key]);
    });
    this.load.once("complete", () => this.openPagedPopup(needed));
    this.load.start();
  }

  openPagedPopup(pages) {
    this.clearOverlay();
    this.overlayRoot.setVisible(true);

    const { width, height } = this.scale;
    let pageIndex = 0;

    const dim = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.55)
      .setInteractive();
    this.overlayRoot.add(dim);

    const page = this.add.image(width / 2, height / 2, pages[0]).setDepth(1);
    const maxW = width * 0.86;
    const maxH = height * 0.86;
    const scale = Math.min(maxW / page.width, maxH / page.height, 1);
    page.setScale(scale);
    this.overlayRoot.add(page);

    const close = this.makeOverlayButton(
      width / 2 + page.displayWidth * 0.42,
      height / 2 - page.displayHeight * 0.35,
      "popup_close",
      "popup_close_hover",
      0.7,
      () => this.clearOverlay()
    );
    this.overlayRoot.add(close);

    // Place arrows inside the beige content (not on the ornate brown frame).
    const arrowY = height / 2 + page.displayHeight * 0.18;
    const arrowInsetX = page.displayWidth * 0.22;

    const left = this.makeOverlayButton(
      width / 2 - arrowInsetX,
      arrowY,
      "arrow_left",
      "arrow_left_hover",
      1,
      () => {
        pageIndex = (pageIndex - 1 + pages.length) % pages.length;
        page.setTexture(pages[pageIndex]);
      }
    );
    const right = this.makeOverlayButton(
      width / 2 + arrowInsetX,
      arrowY,
      "arrow_right",
      "arrow_right_hover",
      1,
      () => {
        pageIndex = (pageIndex + 1) % pages.length;
        page.setTexture(pages[pageIndex]);
      }
    );
    this.overlayRoot.add(left);
    this.overlayRoot.add(right);

    if (pages.length <= 1) {
      left.setVisible(false);
      right.setVisible(false);
    }
  }

  openSettings() {
    this.clearOverlay();
    this.overlayRoot.setVisible(true);

    const { width, height } = this.scale;
    const saved = this.getSavedSettings();
    let volume = Phaser.Math.Clamp(saved.volume ?? 3, 1, 5);
    let language = saved.language === "CN" ? "CN" : "HK";

    const dim = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.55)
      .setInteractive();
    this.overlayRoot.add(dim);

    // Panel root centered like official SettingPanel(scene, 960, 540)
    const root = this.add.container(width / 2, height / 2);
    this.overlayRoot.add(root);

    const bg = this.add.image(0, 0, "setting_bg");
    root.add(bg);

    const volBg = this.add.image(130, -100, "vol_bg");
    root.add(volBg);

    const volumeCells = [];
    const startX = -260;
    const cellGap = 130;
    for (let i = 1; i <= 5; i += 1) {
      const cell = this.add.image(startX + i * cellGap, -103, `vol_${i}`);
      root.add(cell);
      volumeCells.push(cell);
    }

    const updateVolumeDisplay = () => {
      volumeCells.forEach((cell, index) => {
        cell.setVisible(index < volume);
      });
      this.sound.volume = volume * 0.2;
    };
    updateVolumeDisplay();

    const refreshLanguageUI = () => {
      const isMandarin = language === "CN";
      mandarinBtn.setTexture(isMandarin ? "lang_mandarin_on" : "lang_mandarin");
      cantoneseBtn.setTexture(isMandarin ? "lang_cantonese" : "lang_cantonese_on");
    };

    const makePanelBtn = (x, y, key, hoverKey, onClick) => {
      const btn = this.add.image(x, y, key).setInteractive({ useHandCursor: true });
      btn.on("pointerover", () => {
        if (btn.texture.key === key) btn.setTexture(hoverKey);
        btn.setScale(1.05);
      });
      btn.on("pointerout", () => {
        // language buttons keep selected texture
        if (btn === mandarinBtn || btn === cantoneseBtn) {
          refreshLanguageUI();
        } else {
          btn.setTexture(key);
        }
        btn.setScale(1);
      });
      btn.on("pointerup", onClick);
      root.add(btn);
      return btn;
    };

    const mandarinBtn = makePanelBtn(-50, 50, "lang_mandarin", "lang_mandarin_on", () => {
      language = "CN";
      refreshLanguageUI();
    });
    const cantoneseBtn = makePanelBtn(300, 50, "lang_cantonese", "lang_cantonese_on", () => {
      language = "HK";
      refreshLanguageUI();
    });
    refreshLanguageUI();

    makePanelBtn(-250, -100, "vol_left", "vol_left_hover", () => {
      volume = Phaser.Math.Clamp(volume - 1, 1, 5);
      updateVolumeDisplay();
    });
    makePanelBtn(525, -100, "vol_right", "vol_right_hover", () => {
      volume = Phaser.Math.Clamp(volume + 1, 1, 5);
      updateVolumeDisplay();
    });

    makePanelBtn(625, -295, "popup_close", "popup_close_hover", () => {
      // Restore previously saved volume if user closes without saving
      this.applySavedSettings();
      this.clearOverlay();
    });

    makePanelBtn(-50, 200, "save_btn", "save_btn_hover", () => {
      localStorage.setItem(
        "gameSettings",
        JSON.stringify({ volume, language })
      );
      this.sound.volume = volume * 0.2;
      this.clearOverlay();
      this.showToast(
        language === "CN" ? "設定已儲存（普通話）" : "設定已儲存（粵語）"
      );
    });
  }

  makeOverlayButton(x, y, key, hoverKey, scale, onClick) {
    const btn = this.add.image(x, y, key).setScale(scale).setInteractive({ useHandCursor: true });
    btn.on("pointerover", () => btn.setTexture(hoverKey));
    btn.on("pointerout", () => btn.setTexture(key));
    btn.on("pointerup", onClick);
    return btn;
  }

  showToast(message) {
    const { width, height } = this.scale;
    const toast = this.add
      .text(width / 2, height * 0.9, message, {
        fontFamily: '"Noto Serif TC", serif',
        fontSize: "28px",
        color: "#fff8e7",
        backgroundColor: "#000000aa",
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setAlpha(0);

    this.tweens.add({
      targets: toast,
      alpha: 1,
      duration: 200,
      yoyo: true,
      hold: 1200,
      onComplete: () => toast.destroy(),
    });
  }
}
