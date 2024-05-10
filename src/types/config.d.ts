declare global {
    interface GlobalConfig {
        PF2E: {
            skills: Record<SkillAbbreviation, string>;
            skillList: Record<SkillLongFormWithLore, string>;
            resistanceTypes: Record<string, string>;
            featCategories: Record<FeatCategory, string>;
            rarityTraits: Record<Rarity, string>;
            spellTraits: Record<SpellCategory & string, string>;
            magicTraditions: Record<MagicTradition, string>;
            languages: Record<string, string>;
            preparationType: Record<string, string>;
            actorSizes: Record<Size, string>;
            traitsDescriptions: Record<string, string>;
            actionTraits: Record<string, string>;
            proficiencyLevels: Record<OneToFour, string>;
            weaponTraits: Record<string, string>;
            weaponGroups: Record<WeaponGroup, string>;
            damageTypes: Record<DamageType, string>;
            featTraits: Record<string, string>;
            effectTraits: Record<string, string>;
            preciousMaterials: Record<PreciousMaterialType, string>;
            saves: {
                fortitude: "PF2E.SavesFortitude";
                reflex: "PF2E.SavesReflex";
                will: "PF2E.SavesWill";
            };
            frequencies: {
                turn: "PF2E.Duration.turn";
                round: "PF2E.Duration.round";
                PT1M: "PF2E.Duration.PT1M";
                PT10M: "PF2E.Duration.PT10M";
                PT1H: "PF2E.Duration.PT1H";
                PT24H: "PF2E.Duration.PT24H";
                day: "PF2E.Duration.day";
                P1W: "PF2E.Duration.P1W";
                P1M: "PF2E.Duration.P1M";
                P1Y: "PF2E.Duration.P1Y";
            };
            pfsFactions: {
                EA: "PF2E.PFS.Factions.EA";
                GA: "PF2E.PFS.Factions.GA";
                HH: "PF2E.PFS.Factions.HH";
                VS: "PF2E.PFS.Factions.VS";
                RO: "PF2E.PFS.Factions.RO";
                VW: "PF2E.PFS.Factions.VW";
            };
            Item: {
                documentClasses: {
                    spell: typeof SpellPF2e;
                    spellcastingEntry: typeof SpellcastingEntryPF2e;
                };
            };
            actionsNumber: {
                1: "PF2E.ActionNumber1";
                2: "PF2E.ActionNumber2";
                3: "PF2E.ActionNumber3";
            };
            actionTypes: {
                action: "PF2E.ActionTypeAction";
                reaction: "PF2E.ActionTypeReaction";
                free: "PF2E.ActionTypeFree";
                passive: "PF2E.ActionTypePassive";
            };
            abilities: {
                str: "PF2E.AbilityStr";
                dex: "PF2E.AbilityDex";
                con: "PF2E.AbilityCon";
                int: "PF2E.AbilityInt";
                wis: "PF2E.AbilityWis";
                cha: "PF2E.AbilityCha";
            };
            chatDamageButtonShieldToggle: boolean;
        };
    }
}

export type {};
