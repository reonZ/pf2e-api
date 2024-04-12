"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpellCollectionClass = exports.getStatisticClass = exports.getSpellClass = void 0;
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
