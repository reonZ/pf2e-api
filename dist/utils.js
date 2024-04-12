"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tupleHasValue = exports.traitSlugToObject = exports.setHasElement = exports.ordinalString = exports.objectHasKey = exports.localizer = exports.htmlClosest = exports.getActionGlyph = exports.ErrorPF2e = void 0;
function ErrorPF2e(message) {
    return Error(`PF2e System | ${message}`);
}
exports.ErrorPF2e = ErrorPF2e;
function objectHasKey(obj, key) {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}
exports.objectHasKey = objectHasKey;
function tupleHasValue(array, value) {
    return array.includes(value);
}
exports.tupleHasValue = tupleHasValue;
function setHasElement(set, value) {
    return set.has(value);
}
exports.setHasElement = setHasElement;
function ordinalString(value) {
    const pluralRules = new Intl.PluralRules(game.i18n.lang, { type: "ordinal" });
    const suffix = game.i18n.localize(`PF2E.OrdinalSuffixes.${pluralRules.select(value)}`);
    return game.i18n.format("PF2E.OrdinalNumber", { value, suffix });
}
exports.ordinalString = ordinalString;
function htmlClosest(child, selectors) {
    if (!(child instanceof Element))
        return null;
    return child.closest(selectors);
}
exports.htmlClosest = htmlClosest;
function localizer(prefix) {
    return (...[suffix, formatArgs]) => formatArgs
        ? game.i18n.format(`${prefix}.${suffix}`, formatArgs)
        : game.i18n.localize(`${prefix}.${suffix}`);
}
exports.localizer = localizer;
function traitSlugToObject(trait, dictionary) {
    const traitObject = {
        name: trait,
        label: game.i18n.localize(dictionary[trait] ?? trait),
        description: null,
    };
    if (objectHasKey(CONFIG.PF2E.traitsDescriptions, trait)) {
        traitObject.description = CONFIG.PF2E.traitsDescriptions[trait];
    }
    return traitObject;
}
exports.traitSlugToObject = traitSlugToObject;
const actionGlyphMap = {
    0: "F",
    free: "F",
    1: "1",
    2: "2",
    3: "3",
    "1 or 2": "1/2",
    "1 to 3": "1 - 3",
    "2 or 3": "2/3",
    "2 rounds": "3,3",
    reaction: "R",
};
function getActionGlyph(action) {
    if (!action && action !== 0)
        return "";
    const value = typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}
exports.getActionGlyph = getActionGlyph;
