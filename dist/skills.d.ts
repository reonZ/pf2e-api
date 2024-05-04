declare const SKILL_ABBREVIATIONS: readonly ["acr", "arc", "ath", "cra", "dec", "dip", "itm", "med", "nat", "occ", "prf", "rel", "soc", "ste", "sur", "thi"];
declare const SKILL_DICTIONARY: {
    readonly acr: "acrobatics";
    readonly arc: "arcana";
    readonly ath: "athletics";
    readonly cra: "crafting";
    readonly dec: "deception";
    readonly dip: "diplomacy";
    readonly itm: "intimidation";
    readonly med: "medicine";
    readonly nat: "nature";
    readonly occ: "occultism";
    readonly prf: "performance";
    readonly rel: "religion";
    readonly soc: "society";
    readonly ste: "stealth";
    readonly sur: "survival";
    readonly thi: "thievery";
};
interface SkillExpanded {
    attribute: AttributeString;
    shortForm: SkillAbbreviation;
}
declare const SKILL_EXPANDED: Record<SkillLongForm, SkillExpanded>;
declare const ATTRIBUTE_ABBREVIATIONS: Set<"str" | "dex" | "con" | "int" | "wis" | "cha">;
declare const SKILL_LONG_FORMS: Set<"acrobatics" | "arcana" | "athletics" | "crafting" | "deception" | "diplomacy" | "intimidation" | "medicine" | "nature" | "occultism" | "performance" | "religion" | "society" | "stealth" | "survival" | "thievery">;
declare function getTranslatedSkills(): Record<"acrobatics" | "arcana" | "athletics" | "crafting" | "deception" | "diplomacy" | "intimidation" | "medicine" | "nature" | "occultism" | "performance" | "religion" | "society" | "stealth" | "survival" | "thievery", string>;
export { ATTRIBUTE_ABBREVIATIONS, SKILL_ABBREVIATIONS, SKILL_DICTIONARY, SKILL_EXPANDED, SKILL_LONG_FORMS, getTranslatedSkills, };
