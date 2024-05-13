"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranslatedSkills = exports.SKILL_LONG_FORMS = exports.SKILL_EXPANDED = exports.SKILL_DICTIONARY = exports.SKILL_ABBREVIATIONS = exports.ATTRIBUTE_ABBREVIATIONS = void 0;
const SKILL_ABBREVIATIONS = [
    "acr",
    "arc",
    "ath",
    "cra",
    "dec",
    "dip",
    "itm",
    "med",
    "nat",
    "occ",
    "prf",
    "rel",
    "soc",
    "ste",
    "sur",
    "thi",
];
exports.SKILL_ABBREVIATIONS = SKILL_ABBREVIATIONS;
const SKILL_DICTIONARY = {
    acr: "acrobatics",
    arc: "arcana",
    ath: "athletics",
    cra: "crafting",
    dec: "deception",
    dip: "diplomacy",
    itm: "intimidation",
    med: "medicine",
    nat: "nature",
    occ: "occultism",
    prf: "performance",
    rel: "religion",
    soc: "society",
    ste: "stealth",
    sur: "survival",
    thi: "thievery",
};
exports.SKILL_DICTIONARY = SKILL_DICTIONARY;
const SKILL_EXPANDED = {
    acrobatics: { attribute: "dex", shortForm: "acr" },
    arcana: { attribute: "int", shortForm: "arc" },
    athletics: { attribute: "str", shortForm: "ath" },
    crafting: { attribute: "int", shortForm: "cra" },
    deception: { attribute: "cha", shortForm: "dec" },
    diplomacy: { attribute: "cha", shortForm: "dip" },
    intimidation: { attribute: "cha", shortForm: "itm" },
    medicine: { attribute: "wis", shortForm: "med" },
    nature: { attribute: "wis", shortForm: "nat" },
    occultism: { attribute: "int", shortForm: "occ" },
    performance: { attribute: "cha", shortForm: "prf" },
    religion: { attribute: "wis", shortForm: "rel" },
    society: { attribute: "int", shortForm: "soc" },
    stealth: { attribute: "dex", shortForm: "ste" },
    survival: { attribute: "wis", shortForm: "sur" },
    thievery: { attribute: "dex", shortForm: "thi" },
};
exports.SKILL_EXPANDED = SKILL_EXPANDED;
const ATTRIBUTE_ABBREVIATIONS = new Set(["str", "dex", "con", "int", "wis", "cha"]);
exports.ATTRIBUTE_ABBREVIATIONS = ATTRIBUTE_ABBREVIATIONS;
const SKILL_LONG_FORMS = new Set(Object.values(SKILL_DICTIONARY));
exports.SKILL_LONG_FORMS = SKILL_LONG_FORMS;
let TRANSLATED_SKILL;
function getTranslatedSkills() {
    if (!TRANSLATED_SKILL) {
        TRANSLATED_SKILL = {};
        for (const [key, value] of Object.entries(CONFIG.PF2E.skillList)) {
            TRANSLATED_SKILL[key] = game.i18n
                .localize(value)
                .toLocaleLowerCase(game.i18n.lang);
        }
    }
    return foundry.utils.deepClone(TRANSLATED_SKILL);
}
exports.getTranslatedSkills = getTranslatedSkills;
