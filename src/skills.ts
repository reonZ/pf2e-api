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
    return deepClone(TRANSLATED_SKILL);
}

export { getTranslatedSkills };
