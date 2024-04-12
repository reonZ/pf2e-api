"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCharacterSheet = void 0;
const foundry_api_1 = require("foundry-api");
function renderCharacterSheet(actor) {
    const apps = Object.values(ui.windows).filter((app) => (0, foundry_api_1.isInstanceOf)(app, "CharacterSheetPF2e"));
    if (actor) {
        const app = apps.find((x) => x.actor === actor);
        app?.render();
        return;
    }
    for (const app of apps) {
        app.render();
    }
}
exports.renderCharacterSheet = renderCharacterSheet;
