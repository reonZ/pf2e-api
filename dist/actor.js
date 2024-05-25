"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferItemToActor = exports.resetActors = exports.getDispositionColor = void 0;
const foundry_api_1 = require("foundry-api");
const utils_1 = require("./utils");
async function transferItemToActor(targetActor, item, quantity, containerId, newStack = false) {
    if (!item.isOfType("physical")) {
        throw (0, utils_1.ErrorPF2e)("Only physical items (with quantities) can be transfered between actors");
    }
    const container = targetActor.inventory.get(containerId ?? "");
    if (container && !container?.isOfType("backpack")) {
        throw (0, utils_1.ErrorPF2e)("containerId refers to a non-container");
    }
    quantity = Math.min(quantity, item.quantity);
    const newQuantity = item.quantity - quantity;
    const removeFromSource = newQuantity < 1;
    if (removeFromSource) {
        await item.delete();
    }
    else {
        await item.update({ "system.quantity": newQuantity });
    }
    const newItemData = item.toObject();
    newItemData.system.quantity = quantity;
    newItemData.system.equipped.carryType = "worn";
    if ("invested" in newItemData.system.equipped) {
        newItemData.system.equipped.invested = item.traits.has("invested") ? false : null;
    }
    return targetActor.addToInventory(newItemData, container, newStack);
}
exports.transferItemToActor = transferItemToActor;
async function resetActors(actors, options = {}) {
    actors ??= [
        game.actors.contents,
        game.scenes.contents
            .flatMap((s) => s.tokens.contents)
            .flatMap((t) => t.actor ?? []),
    ].flat();
    actors = foundry_api_1.R.uniq(Array.from(actors));
    options.sheets ??= true;
    for (const actor of actors) {
        actor.reset();
        if (options.sheets)
            actor.render();
    }
    game.pf2e.effectPanel.refresh();
    const refreshScenes = game.settings.get("pf2e", "automation.effectExpiration") &&
        !game.settings.get("pf2e", "automation.removeExpiredEffects");
    if (refreshScenes) {
        const scenes = foundry_api_1.R.uniq(Array.from(actors)
            .flatMap((a) => a.getActiveTokens(false, true))
            .flatMap((t) => t.scene));
        for (const scene of scenes) {
            scene.reset();
            if (scene.isView) {
                canvas.perception.update({ initializeVision: true }, true);
            }
        }
    }
    if (options.tokens) {
        for (const token of foundry_api_1.R.uniq(Array.from(actors).flatMap((a) => a.getActiveTokens(true, true)))) {
            token.simulateUpdate();
        }
    }
}
exports.resetActors = resetActors;
function getDispositionColor(actor) {
    const alliance = actor.alliance;
    const colorValue = !actor
        ? CONFIG.Canvas.dispositionColors.NEUTRAL
        : alliance === "party"
            ? actor.hasPlayerOwner
                ? CONFIG.Canvas.dispositionColors.PARTY
                : CONFIG.Canvas.dispositionColors.FRIENDLY
            : alliance === "opposition"
                ? CONFIG.Canvas.dispositionColors.HOSTILE
                : CONFIG.Canvas.dispositionColors.NEUTRAL;
    return new Color(colorValue);
}
exports.getDispositionColor = getDispositionColor;
