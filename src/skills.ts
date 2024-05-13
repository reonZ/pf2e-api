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
] as const;

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
} as const;

interface SkillExpanded {
    attribute: AttributeString;
    shortForm: SkillAbbreviation;
}

const SKILL_EXPANDED: Record<SkillLongForm, SkillExpanded> = {
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

const ATTRIBUTE_ABBREVIATIONS = new Set(["str", "dex", "con", "int", "wis", "cha"] as const);

const SKILL_LONG_FORMS = new Set(Object.values(SKILL_DICTIONARY));

let TRANSLATED_SKILL: Record<SkillLongForm, string> | undefined;
function getTranslatedSkills() {
    if (!TRANSLATED_SKILL) {
        TRANSLATED_SKILL = {} as Record<SkillLongForm, string>;

        for (const [key, value] of Object.entries(CONFIG.PF2E.skillList)) {
            TRANSLATED_SKILL[key as SkillLongForm] = game.i18n
                .localize(value)
                .toLocaleLowerCase(game.i18n.lang);
        }
    }
    return foundry.utils.deepClone(TRANSLATED_SKILL);
}

export {
    ATTRIBUTE_ABBREVIATIONS,
    SKILL_ABBREVIATIONS,
    SKILL_DICTIONARY,
    SKILL_EXPANDED,
    SKILL_LONG_FORMS,
    getTranslatedSkills,
};
