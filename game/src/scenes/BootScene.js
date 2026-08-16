export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    const { width, height } = this.scale;
    const barBg = this.add.rectangle(width / 2, height / 2, 480, 24, 0x1c2a3a);
    const bar = this.add.rectangle(width / 2 - 230, height / 2, 0, 16, 0xd4a017).setOrigin(0, 0.5);
    this.add
      .text(width / 2, height / 2 - 48, "載入桃花源…", {
        fontFamily: '"Noto Serif TC", serif',
        fontSize: "28px",
        color: "#f3e6c8",
      })
      .setOrigin(0.5);

    this.load.on("progress", (value) => {
      bar.width = 460 * value;
    });

    // Lightweight cover assets first so the title screen appears quickly.
    this.load.image("cover_bg", "assets-opt/cover_bg.jpg");

    this.load.image("btn_desc", "assets/GameStart/cover_game_description_button.png");
    this.load.image("btn_desc_hover", "assets/GameStart/cover_game_description_button_click.png");
    this.load.image("btn_start", "assets/GameStart/cover_game_start.png");
    this.load.image("btn_start_hover", "assets/GameStart/cover_game_start_click.png");

    this.load.image("btn_setting", "assets/GameStart/setting_button.png");
    this.load.image("btn_setting_hover", "assets/GameStart/setting_button_click.png");
    this.load.image("btn_help", "assets/GameStart/game_description_button.png");
    this.load.image("btn_help_hover", "assets/GameStart/game_description_button_click.png");
    this.load.image("btn_info", "assets/GameStart/program_information_button.png");
    this.load.image("btn_info_hover", "assets/GameStart/program_information_button_click.png");

    this.load.image("popup_close", "assets/GameStart/close_button.png");
    this.load.image("popup_close_hover", "assets/GameStart/close_button_click.png");
    this.load.image("arrow_left", "assets/GameStart/left_arrow_button.png");
    this.load.image("arrow_left_hover", "assets/GameStart/left_arrow_button_click.png");
    this.load.image("arrow_right", "assets/GameStart/right_arrow_button.png");
    this.load.image("arrow_right_hover", "assets/GameStart/right_arrow_button_click.png");
  }

  create() {
    this.scene.start("CoverScene");
  }
}
