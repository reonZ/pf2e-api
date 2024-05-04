"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCharacterSheets = void 0;
const foundry_api_1 = require("foundry-api");
function renderCharacterSheets() {
    const apps = Object.values(ui.windows).filter((app) => (0, foundry_api_1.isInstanceOf)(app, "CharacterSheetPF2e"));
    for (const app of apps) {
        app.render();
    }
}
exports.renderCharacterSheets = renderCharacterSheets;
