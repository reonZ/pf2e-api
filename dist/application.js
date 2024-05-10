"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderItemSheets = exports.renderCharacterSheets = exports.renderActorSheets = void 0;
const foundry_api_1 = require("foundry-api");
function renderApplication(types) {
    types = Array.isArray(types) ? types : [types];
    const apps = Object.values(ui.windows).filter((app) => types.some((type) => (0, foundry_api_1.isInstanceOf)(app, type)));
    for (const app of apps) {
        app.render();
    }
}
function renderActorSheets(types = ["ActorSheetPF2e"]) {
    renderApplication(types);
}
exports.renderActorSheets = renderActorSheets;
function renderCharacterSheets() {
    renderActorSheets(["CharacterSheetPF2e"]);
}
exports.renderCharacterSheets = renderCharacterSheets;
function renderItemSheets(types = ["ItemSheetPF2e"]) {
    renderApplication(types);
}
exports.renderItemSheets = renderItemSheets;
