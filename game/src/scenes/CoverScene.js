export class CoverScene extends Phaser.Scene {
  constructor() {
    super("CoverScene");
    this.overlay = null;
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "cover_bg").setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x061018, 0.22);

    this.createPetals();
    this.createTitle(width, height);
    this.createTopLeftButtons();
    this.createMainButtons(width, height);
    this.createSponsorBar(width);

    this.overlayRoot = this.add.container(0, 0).setDepth(50).setVisible(false);
  }

  createPetals() {
    const { width, height } = this.scale;
    for (let i = 0; i < 18; i += 1) {
      const petal = this.add
        .circle(
          Phaser.Math.Between(0, width),
          Phaser.Math.Between(-40, height),
          Phaser.Math.Between(3, 7),
          0xffb7c5,
          Phaser.Math.FloatBetween(0.35, 0.8)
        )
        .setDepth(1);

      this.tweens.add({
        targets: petal,
        y: height + 40,
        x: petal.x + Phaser.Math.Between(-120, 120),
        duration: Phaser.Math.Between(7000, 14000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 4000),
        onRepeat: () => {
          petal.y = -20;
          petal.x = Phaser.Math.Between(0, width);
        },
      });
    }
  }

  createTitle(width, height) {
    const cx = width * 0.52;
    const cy = height * 0.32;

    const titleShadow = this.add
      .text(cx + 4, cy + 6, "桃花源記", {
        fontFamily: '"Ma Shan Zheng", "Noto Serif TC", serif',
        fontSize: "132px",
        color: "#1a1208",
      })
      .setOrigin(0.5)
      .setDepth(3);

    const title = this.add
      .text(cx, cy, "桃花源記", {
        fontFamily: '"Ma Shan Zheng", "Noto Serif TC", serif',
        fontSize: "132px",
        color: "#7fd6c4",
        stroke: "#e8c35a",
        strokeThickness: 10,
      })
      .setOrigin(0.5)
      .setDepth(4);

    this.add
      .text(cx, cy + 110, "土地平曠，屋舍儼然", {
        fontFamily: '"Ma Shan Zheng", "Noto Serif TC", serif',
        fontSize: "46px",
        color: "#8fe0b8",
        stroke: "#d8b44a",
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(4);

    const authorBg = this.add
      .rectangle(cx, cy + 175, 360, 42, 0x000000, 0.45)
      .setDepth(3);
    this.add
      .text(cx, cy + 175, "作者：東晉 · 陶淵明", {
        fontFamily: '"Noto Serif TC", serif',
        fontSize: "26px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(4);

    this.tweens.add({
      targets: [title, titleShadow],
      scale: 1.03,
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    void authorBg;
  }

  createTopLeftButtons() {
    const startX = 86;
    const startY = 86;
    const gap = 92;
    const scale = 0.62;

    this.makeImageButton(startX, startY, "btn_setting", "btn_setting_hover", scale, () => {
      this.openLazyPopup("settings");
    });
    this.makeImageButton(startX + gap, startY, "btn_help", "btn_help_hover", scale, () => {
      this.openLazyPopup("desc");
    });
    this.makeImageButton(startX + gap * 2, startY, "btn_info", "btn_info_hover", scale, () => {
      this.openLazyPopup("info");
    });
  }

  createMainButtons(width, height) {
    const cx = width * 0.52;
    const y1 = height * 0.66;
    const y2 = height * 0.76;
    const scale = 1.15;

    this.makeImageButton(cx, y1, "btn_desc", "btn_desc_hover", scale, () => {
      this.openLazyPopup("desc");
    });

    this.makeImageButton(cx, y2, "btn_start", "btn_start_hover", scale, () => {
      this.showToast("即將進入遊戲…（角色選擇頁待接）");
    });
  }

  createSponsorBar(width) {
    const bar = this.add
      .rectangle(width - 24, 24, 420, 78, 0xffffff, 0.92)
      .setOrigin(1, 0)
      .setDepth(5)
      .setStrokeStyle(1, 0xd0d0d0);

    this.add
      .text(width - 234, 52, "主辦機構　｜　贊助機構", {
        fontFamily: '"Noto Serif TC", serif',
        fontSize: "22px",
        color: "#333333",
      })
      .setOrigin(0.5)
      .setDepth(6);

    void bar;
  }

  makeImageButton(x, y, key, hoverKey, scale, onClick) {
    const btn = this.add
      .image(x, y, key)
      .setScale(scale)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => {
      btn.setTexture(hoverKey);
      btn.setScale(scale * 1.04);
    });
    btn.on("pointerout", () => {
      btn.setTexture(key);
      btn.setScale(scale);
    });
    btn.on("pointerdown", () => {
      btn.setScale(scale * 0.97);
    });
    btn.on("pointerup", () => {
      btn.setScale(scale * 1.04);
      onClick();
    });

    return btn;
  }

  clearOverlay() {
    this.overlayRoot.removeAll(true);
    this.overlayRoot.setVisible(false);
  }

  openLazyPopup(kind) {
    const needed =
      kind === "desc"
        ? ["popup_desc_1", "popup_desc_2"]
        : kind === "info"
          ? ["popup_info_1", "popup_info_2", "popup_info_3", "popup_info_4"]
          : ["setting_bg"];

    const missing = needed.filter((key) => !this.textures.exists(key));
    if (missing.length === 0) {
      if (kind === "settings") this.openSettings();
      else this.openPagedPopup(needed);
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
        setting_bg: "assets/Settings/setting_page_bg.png",
      };
      this.load.image(key, fileMap[key]);
    });
    this.load.once("complete", () => {
      if (kind === "settings") this.openSettings();
      else this.openPagedPopup(needed);
    });
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
      width / 2 + (page.displayWidth / 2) - 40,
      height / 2 - (page.displayHeight / 2) + 40,
      "popup_close",
      "popup_close_hover",
      0.7,
      () => this.clearOverlay()
    );
    this.overlayRoot.add(close);

    const left = this.makeOverlayButton(
      width / 2 - page.displayWidth / 2 - 50,
      height / 2,
      "arrow_left",
      "arrow_left_hover",
      1,
      () => {
        pageIndex = (pageIndex - 1 + pages.length) % pages.length;
        page.setTexture(pages[pageIndex]);
      }
    );
    const right = this.makeOverlayButton(
      width / 2 + page.displayWidth / 2 + 50,
      height / 2,
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

    const dim = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.55)
      .setInteractive();
    this.overlayRoot.add(dim);

    const panel = this.add.image(width / 2, height / 2, "setting_bg");
    const scale = Math.min((width * 0.7) / panel.width, (height * 0.75) / panel.height, 1);
    panel.setScale(scale);
    this.overlayRoot.add(panel);

    const close = this.makeOverlayButton(
      width / 2 + (panel.displayWidth / 2) - 36,
      height / 2 - (panel.displayHeight / 2) + 36,
      "popup_close",
      "popup_close_hover",
      0.65,
      () => this.clearOverlay()
    );
    this.overlayRoot.add(close);
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
