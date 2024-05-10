"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderItemSheets = exports.renderCharacterSheets = exports.renderActorSheets = void 0;
const foundry_api_1 = require("foundry-api");
function renderApplication(type) {
    const types = Array.isArray(type) ? type : [type];
    const apps = Object.values(ui.windows).filter((app) => types.some((x) => (0, foundry_api_1.isInstanceOf)(app, x)));
    for (const app of apps) {
        app.render();
    }
}
function renderActorSheets(type = ["ActorSheetPF2e"]) {
    renderApplication(type);
}
exports.renderActorSheets = renderActorSheets;
function renderCharacterSheets() {
    renderActorSheets(["CharacterSheetPF2e"]);
}
exports.renderCharacterSheets = renderCharacterSheets;
function renderItemSheets(type = ["ItemSheetPF2e"]) {
    renderApplication(type);
}
exports.renderItemSheets = renderItemSheets;
