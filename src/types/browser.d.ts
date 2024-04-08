declare global {
    type SortDirection = "asc" | "desc";

    type BrowserTabName =
        | "action"
        | "bestiary"
        | "campaignFeature"
        | "equipment"
        | "feat"
        | "hazard"
        | "spell";

    interface OrderData {
        by: string;
        direction: SortDirection;
        /** The key must be present as an index key in the database */
        options: Record<string, string>;
    }

    interface BaseFilterData {
        order: OrderData;
        search: {
            text: string;
        };
    }

    interface SliderData {
        isExpanded: boolean;
        values: {
            lowerLimit: number;
            upperLimit: number;
            min: number;
            max: number;
            step: number;
        };
        label: string;
    }

    type CheckboxOptions = Record<string, { label: string; selected: boolean }>;

    interface CheckboxData<T extends string = string> {
        isExpanded: boolean;
        label: string;
        options: CheckboxOptions;
        selected: T[];
    }

    interface MultiselectData<T extends string = string> {
        label: string;
        conjunction: "and" | "or";
        options: { label: string; value: T }[];
        selected: { label?: string; not?: boolean; value: T }[];
    }

    interface SelectData {
        label: string;
        options: Record<string, string>;
        selected: string;
    }

    interface FeatFilters extends BaseFilterData {
        checkboxes: {
            category: CheckboxData<FeatCategory>;
            skills: CheckboxData<SkillLongForm>;
            rarity: CheckboxData<Rarity>;
            source: CheckboxData;
        };
        multiselects: {
            traits: MultiselectData;
        };
        sliders: {
            level: SliderData;
        };
    }

    interface SpellFilters extends BaseFilterData {
        checkboxes: {
            category: CheckboxData<SpellCategory>;
            rank: CheckboxData;
            rarity: CheckboxData<Rarity>;
            source: CheckboxData;
            traditions: CheckboxData<MagicTradition>;
        };
        multiselects: {
            traits: MultiselectData;
        };
        selects: {
            timefilter: SelectData;
        };
    }

    type BrowserFilter =
        // | ActionFilters
        // | BestiaryFilters
        // | CampaignFeatureFilters
        // | EquipmentFilters
        | FeatFilters
        // | HazardFilters
        | SpellFilters;

    abstract class CompendiumBrowserTab {
        constructor(browser: CompendiumBrowser);
        isInitialized: boolean;
        abstract filterData: BrowserFilter;
        defaultFilterData: this["filterData"];
        init(): Promise<void>;
        open(filter?: BrowserFilter): Promise<void>;
        getFilterData(): Promise<this["filterData"]>;
        filterIndexData(entry: any): boolean;
        filterTraits(
            traits: string[],
            selected: MultiselectData["selected"],
            condition: MultiselectData["conjunction"]
        ): boolean;
    }

    class CompendiumBrowserFeatTab extends CompendiumBrowserTab {
        filterData: FeatFilters;
    }

    class CompendiumBrowserSpellTab extends CompendiumBrowserTab {
        filterData: SpellFilters;
    }

    interface BrowserTabs {
        action: CompendiumBrowserTab;
        bestiary: CompendiumBrowserTab;
        campaignFeature: CompendiumBrowserTab;
        equipment: CompendiumBrowserTab;
        feat: CompendiumBrowserFeatTab;
        hazard: CompendiumBrowserTab;
        spell: CompendiumBrowserSpellTab;
    }

    class CompendiumBrowser extends Application {
        tabs: BrowserTabs;

        // openTab(name: "action", filter?: ActionFilters): Promise<void>;
        // openTab(name: "bestiary", filter?: BestiaryFilters): Promise<void>;
        // openTab(name: "equipment", filter?: EquipmentFilters): Promise<void>;
        openTab(name: "feat", filter?: FeatFilters): Promise<void>;
        // openTab(name: "hazard", filter?: HazardFilters): Promise<void>;
        openTab(name: "spell", filter?: SpellFilters): Promise<void>;
        openTab(name: "settings"): Promise<void>;
        openTab(tabName: BrowserTabName, filter?: BrowserFilter): Promise<void>;
    }
}

export type {};
