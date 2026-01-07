/*
  KK-Date Stamper
  - Author: Nero-kk
  - Github: https://github.com/Nero-kk
  - Youtube : https://www.youtube.com/@Nero-kk
  - Blog : https://nero-k.tistory.com/  
  - Buy Me a Coffee: https://buymeacoffee.com/nerokk
*/

const { Plugin, PluginSettingTab, Setting, moment } = require("obsidian");

const DEFAULT_SETTINGS = {
    dateFormat: "YYYY-MM-DD(dd)",
    dateTimeFormat: "YYYY-MM-DD(dd), HH:mm"
};

module.exports = class SimpleDateStamper extends Plugin {
    async onload() {
        await this.loadSettings();

        // 1. 날짜 입력 명령어 (대괄호 자동 추가)
        this.addCommand({
            id: "insert-date-only",
            name: "날짜 입력",
            editorCallback: (editor) => {
                const stamp = this.getFormattedDate(this.settings.dateFormat, true);
                editor.replaceSelection(stamp);
            }
        });

        // 2. 날짜와 시간 입력 명령어 (날짜 부분만 대괄호 추가)
        this.addCommand({
            id: "insert-date-time",
            name: "날짜와 시간 입력",
            editorCallback: (editor) => {
                const stamp = this.getFormattedDate(this.settings.dateTimeFormat, true);
                editor.replaceSelection(stamp);
            }
        });

        this.addSettingTab(new DateStamperSettingTab(this.app, this));
    }

    // 날짜 형식을 분석해서 대괄호([[ ]])를 입혀주는 핵심 함수
    getFormattedDate(format, shouldLink) {
        const formatted = moment().format(format);
        
        if (shouldLink) {
            // 콤마(,)가 있다면 날짜와 시간을 구분해서 날짜에만 대괄호를 칩니다.
            if (formatted.includes(",")) {
                const [datePart, ...timeParts] = formatted.split(",");
                return `[[${datePart.trim()}]]` + "," + timeParts.join(",");
            }
            // 콤마가 없다면 전체를 대괄호로 감쌉니다.
            return `[[${formatted}]]`;
        }
        return formatted;
    }

    async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()); }
    async saveSettings() { await this.saveData(this.settings); }
};

class DateStamperSettingTab extends PluginSettingTab {
    constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "날짜/시간 입력 설정" });

        new Setting(containerEl).setName("날짜 형식").addText(t => t
            .setValue(this.plugin.settings.dateFormat)
            .onChange(async v => { this.plugin.settings.dateFormat = v; await this.plugin.saveSettings(); }));

        new Setting(containerEl).setName("날짜 및 시간 형식").addText(t => t
            .setValue(this.plugin.settings.dateTimeFormat)
            .onChange(async v => { this.plugin.settings.dateTimeFormat = v; await this.plugin.saveSettings(); }));

        const footer = containerEl.createDiv();
        footer.innerHTML = `<hr>Developed by <a href="https://github.com/Nero-kk">Nero-kk</a><br><a href="https://buymeacoffee.com/nerokk">☕ Buy Me a Coffee</a>`;
    }
}