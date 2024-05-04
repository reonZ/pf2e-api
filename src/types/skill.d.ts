import { SKILL_ABBREVIATIONS, SKILL_LONG_FORMS } from "../skills";

declare global {
    type SkillAbbreviation = (typeof SKILL_ABBREVIATIONS)[number];
    type SkillLongForm = SetElement<typeof SKILL_LONG_FORMS>;
    type SkillLongFormWithLore = SkillLongForm | "lore";
}

export type {};
