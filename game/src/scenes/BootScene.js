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

    // Official cover frame extracted from GameStart/cover.mp4
    // (includes title logo + top-right organizer/sponsor logos)
    this.load.image("cover_bg", "assets-opt/cover_official.jpg");

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

    // Settings panel
    this.load.image("setting_bg", "assets/Settings/setting_page_bg.png");
    this.load.image("vol_bg", "assets/Settings/setting_page_volume_bg.png");
    this.load.image("vol_1", "assets/Settings/setting_page_volume1.png");
    this.load.image("vol_2", "assets/Settings/setting_page_volume2.png");
    this.load.image("vol_3", "assets/Settings/setting_page_volume3.png");
    this.load.image("vol_4", "assets/Settings/setting_page_volume4.png");
    this.load.image("vol_5", "assets/Settings/setting_page_volume5.png");
    this.load.image("vol_left", "assets/Settings/setting_page_left_arrow.png");
    this.load.image("vol_left_hover", "assets/Settings/setting_page_left_arrow_click.png");
    this.load.image("vol_right", "assets/Settings/setting_page_right_arrow.png");
    this.load.image("vol_right_hover", "assets/Settings/setting_page_right_arrow_click.png");
    this.load.image("lang_mandarin", "assets/Settings/setting_page_mandarin.png");
    this.load.image("lang_mandarin_on", "assets/Settings/setting_page_mandarin_click.png");
    this.load.image("lang_cantonese", "assets/Settings/setting_page_cantonese.png");
    this.load.image("lang_cantonese_on", "assets/Settings/setting_page_cantonese_click.png");
    this.load.image("save_btn", "assets/Settings/setting_page_save.png");
    this.load.image("save_btn_hover", "assets/Settings/setting_page_save_click.png");
  }

  create() {
    this.scene.start("CoverScene");
  }
}
