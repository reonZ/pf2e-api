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
        | EquipmentFilters
        | FeatFilters
        // | HazardFilters
        | SpellFilters;

    type MatchInfo = {
        [term: string]: string[];
    };

    type SearchResult = {
        id: any;
        terms: string[];
        queryTerms: string[];
        score: number;
        match: MatchInfo;
        [key: string]: any;
    };

    type CompendiumBrowserIndexData = Omit<CompendiumIndexData, "_id"> & Partial<SearchResult>;

    type SearchOptions = {};

    type QueryCombination = SearchOptions & {
        queries: Query[];
    };

    type Wildcard = typeof MiniSearch.wildcard;

    type Query = QueryCombination | string | Wildcard;

    class MiniSearch<T = any> {
        static readonly wildcard: unique symbol;

        search(query: Query, searchOptions?: SearchOptions): SearchResult[];
    }

    abstract class CompendiumBrowserTab {
        constructor(browser: CompendiumBrowser);

        browser: CompendiumBrowser;
        filterData: BrowserFilter;
        isInitialized: boolean;
        defaultFilterData: this["filterData"];
        currentIndex: CompendiumBrowserIndexData[];
        searchEngine: MiniSearch<CompendiumBrowserIndexData>;
        indexData: CompendiumBrowserIndexData[];

        init(): Promise<void>;
        open(filter?: BrowserFilter): Promise<void>;
        arrayIncludes(array: string[], other: string[]): boolean;
        getFilterData(): Promise<this["filterData"]>;
        filterIndexData(entry: any): boolean;
        filterTraits(
            traits: string[],
            selected: MultiselectData["selected"],
            condition: MultiselectData["conjunction"]
        ): boolean;
        sortResult(result: CompendiumBrowserIndexData[]): CompendiumBrowserIndexData[];
    }

    class CompendiumBrowserFeatTab extends CompendiumBrowserTab {
        filterData: FeatFilters;
    }

    class CompendiumBrowserSpellTab extends CompendiumBrowserTab {
        filterData: SpellFilters;
    }

    class CompendiumBrowserEquipmentTab extends CompendiumBrowserTab {
        filterData: EquipmentFilters;
    }

    interface BrowserTabs {
        action: CompendiumBrowserTab;
        bestiary: CompendiumBrowserTab;
        campaignFeature: CompendiumBrowserTab;
        equipment: CompendiumBrowserEquipmentTab;
        feat: CompendiumBrowserFeatTab;
        hazard: CompendiumBrowserTab;
        spell: CompendiumBrowserSpellTab;
    }

    type TabName =
        | "action"
        | "bestiary"
        | "campaignFeature"
        | "equipment"
        | "feat"
        | "hazard"
        | "spell"
        | "settings";

    interface PackInfo {
        load: boolean;
        name: string;
        package: string;
    }

    type CompendiumBrowserSettings = Omit<
        TabData<Record<string, PackInfo | undefined>>,
        "settings"
    >;

    type TabData<T> = Record<TabName, T | null>;

    interface SourceInfo {
        load: boolean;
        name: string;
    }

    type CompendiumBrowserSourcesList = Record<string, SourceInfo | undefined>;

    interface CompendiumBrowserSources {
        ignoreAsGM: boolean;
        showEmptySources: boolean;
        showUnknownSources: boolean;
        sources: CompendiumBrowserSourcesList;
    }

    interface CompendiumBrowserSheetData {
        user: UserPF2e;
        settings?: { settings: CompendiumBrowserSettings; sources: CompendiumBrowserSources };
        scrollLimit?: number;
        showCampaign: boolean;
    }

    interface RangesInputData {
        changed: boolean;
        isExpanded: boolean;
        values: {
            min: number;
            max: number;
            inputMin: string;
            inputMax: string;
        };
        label: string;
    }

    interface EquipmentFilters extends BaseFilterData {
        checkboxes: {
            armorTypes: CheckboxData;
            itemTypes: CheckboxData;
            rarity: CheckboxData;
            source: CheckboxData;
            weaponTypes: CheckboxData;
        };
        multiselects: {
            traits: MultiselectData<PhysicalItemTrait>;
        };
        ranges: {
            price: RangesInputData;
        };
        sliders: {
            level: SliderData;
        };
    }

    class CompendiumBrowser extends Application {
        tabs: BrowserTabs;

        // openTab(name: "action", filter?: ActionFilters): Promise<void>;
        // openTab(name: "bestiary", filter?: BestiaryFilters): Promise<void>;
        openTab(name: "equipment", filter?: EquipmentFilters): Promise<void>;
        openTab(name: "feat", filter?: FeatFilters): Promise<void>;
        // openTab(name: "hazard", filter?: HazardFilters): Promise<void>;
        openTab(name: "spell", filter?: SpellFilters): Promise<void>;
        openTab(name: "settings"): Promise<void>;
        openTab(tabName: BrowserTabName, filter?: BrowserFilter): Promise<void>;
    }
}

export type {};
