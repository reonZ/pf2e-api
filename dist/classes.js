"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpellCollectionClass = exports.getStatisticClass = exports.getSpellClass = exports.getDamageRollClass = void 0;
function getStatisticClass(statistic) {
    return statistic.constructor;
}
exports.getStatisticClass = getStatisticClass;
function getSpellCollectionClass(actor) {
    return actor.spellcasting.get("rituals").spells
        .constructor;
}
exports.getSpellCollectionClass = getSpellCollectionClass;
function getSpellClass() {
    return CONFIG.PF2E.Item.documentClasses.spell;
}
exports.getSpellClass = getSpellClass;
function getDamageRollClass() {
    return CONFIG.Dice.rolls.find((Roll) => Roll.name === "DamageRoll");
}
exports.getDamageRollClass = getDamageRollClass;
