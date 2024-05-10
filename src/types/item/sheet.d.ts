declare global {
    interface TraitTagifyEntry {
        id: string;
        value: string;
        readonly: boolean;
    }

    interface ItemSheetDataPF2e<TItem extends ItemPF2e> extends ItemSheetData<TItem> {
        itemType: string | null;
        showTraits: boolean;
        sidebarTitle: string;
        sidebarTemplate: string | null;
        detailsTemplate: string;
        item: TItem;
        data: TItem["system"];
        fieldIdPrefix: string;
        enrichedContent: Record<string, string>;
        isPhysical: boolean;
        user: { isGM: boolean };
        enabledRulesUI: boolean;
        ruleEditing: boolean;
        rarity: Rarity | null;
        rarities: typeof CONFIG.PF2E.rarityTraits;
        traits: SheetOptions | null;
        traitTagifyData: TraitTagifyEntry[] | null;
        rules: {
            selection: {
                selected: string | null;
                types: Record<string, string>;
            };
            elements: {
                template: string;
            }[];
        };
        proficiencyRanks: typeof CONFIG.PF2E.proficiencyLevels;
    }

    interface ItemSheetOptions extends DocumentSheetOptions {
        hasSidebar: boolean;
    }

    class ItemSheetPF2e<TItem extends ItemPF2e = ItemPF2e> extends ItemSheet<TItem> {
        item: TItem;
    }

    class LootSheetPF2e extends ActorSheetPF2e<LootPF2e> {}

    interface LootSheetDataPF2e extends ActorSheetDataPF2e<LootPF2e> {
        isLoot: boolean;
    }

    class AbilitySheetPF2e extends ItemSheetPF2e<AbilityItemPF2e> {}

    interface ActionSheetData extends ItemSheetDataPF2e<AbilityItemPF2e> {
        // categories: ConfigPF2e["PF2E"]["actionCategories"];
        // actionTypes: ConfigPF2e["PF2E"]["actionTypes"];
        // actionsNumber: ConfigPF2e["PF2E"]["actionsNumber"];
        // actionTraits: ConfigPF2e["PF2E"]["actionTraits"];
        // frequencies: ConfigPF2e["PF2E"]["frequencies"];
        // skills: ConfigPF2e["PF2E"]["skillList"];
        // proficiencies: ConfigPF2e["PF2E"]["proficiencyLevels"];
        selfEffect: SelfEffectReference | null;
    }

    class FeatSheetPF2e extends ItemSheetPF2e<FeatPF2e> {}

    interface FeatSheetData extends ItemSheetDataPF2e<FeatPF2e> {
        actionsNumber: typeof CONFIG.PF2E.actionsNumber;
        actionTypes: typeof CONFIG.PF2E.actionTypes;
        attributes: typeof CONFIG.PF2E.abilities;
        canHaveKeyOptions: boolean;
        categories: typeof CONFIG.PF2E.featCategories;
        frequencies: typeof CONFIG.PF2E.frequencies;
        hasLanguages: boolean;
        hasLineageTrait: boolean;
        hasProficiencies: boolean;
        hasSenses: boolean;
        languages: LanguageOptions;
        mandatoryTakeOnce: boolean;
        proficiencies: ProficiencyOptions;
        selfEffect: SelfEffectReference | null;
        senses: SenseOption[];
        showPrerequisites: boolean;
    }

    interface LanguageOptions {
        slots: number;
        granted: {
            available: { slug: Language; label: string }[];
            selected: { slug: Language; label: string }[];
        };
    }

    interface ProficiencyOptions {
        other: ProficiencyOptionGroup<null>;
        saves: ProficiencyOptionGroup;
        attacks: ProficiencyOptionGroup;
        defenses: ProficiencyOptionGroup;
        classes: ProficiencyOptionGroup;
    }

    interface ProficiencyOptionGroup<TGroup extends string | null = string> {
        group: TGroup;
        options: { slug: string; label: string; rank: OneToFour | null }[];
    }

    interface SenseOption {
        acuity?: SenseAcuity | null;
        canSetAcuity: boolean;
        canSetRange: boolean;
        label: string;
        range?: number | null;
        selected: boolean;
        slug: string;
        special: { ancestry: boolean; second: boolean } | null;
    }
}

export type {};
