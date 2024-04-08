declare global {
    type CharacterSheetTabVisibility = {
        character: boolean;
        effects: boolean;
        crafting: boolean;
        actions: boolean;
        inventory: boolean;
        spellcasting: boolean;
        proficiencies: boolean;
        feats: boolean;
        biography: boolean;
        pfs: boolean;
    };

    type SpellcastingTabSlug = "known-spells" | "rituals" | "activations";

    interface InventoryItem<TItem extends PhysicalItemPF2e = PhysicalItemPF2e> {
        item: TItem;
        /** Item size if it causes any weight difference relative to the actor */
        itemSize?: ActorSizePF2e | null;
        isContainer: boolean;
        canBeEquipped: boolean;
        /** Bulk for each item is shown on an individual basis from merchant sheets */
        unitBulk: string | null;
        isInvestable: boolean;
        isSellable: boolean;
        hasCharges: boolean;
        heldItems?: InventoryItem[];
        notifyInvestment?: boolean;
        /** Whether the item should be hidden if the user isn't the owner */
        hidden: boolean;
    }

    interface SheetItemList {
        label: string;
        types: string[];
        items: InventoryItem[];
    }

    interface SheetInventory {
        sections: SheetItemList[];
        bulk: InventoryBulk;
        showValueAlways: boolean;
        showUnitBulkPrice: boolean;
        hasStowingContainers: boolean;
        invested?: { value: number; max: number } | null;
    }

    interface CoinDisplayData {
        value: number;
        label: string;
    }

    type CoinageSummary = { [K in keyof Coins]?: CoinDisplayData };

    interface SheetOption {
        value: string;
        label: string;
        selected: boolean;
    }

    type SheetOptions = Record<string, SheetOption>;

    interface ActorSheetDataPF2e<TActor extends ActorPF2e> extends ActorSheetData<TActor> {
        data: TActor["system"];
        canDistributeCoins?: { enabled: boolean } | null;
        enrichedContent: Record<string, string>;
        inventory: SheetInventory;
        isLootSheet: boolean;
        isTargetFlatFooted: boolean;
        toggles: Record<string, RollOptionToggle[]>;
        totalCoinage: CoinageSummary;
        totalCoinageGold: string;
        totalWealth: Coins;
        totalWealthGold: string;
        traits: SheetOptions;
        user: { isGM: boolean };
    }

    interface CreatureSheetData<TActor extends CreaturePF2e> extends ActorSheetDataPF2e<TActor> {
        actorSizes: typeof CONFIG.PF2E.actorSizes;
        rarity: typeof CONFIG.PF2E.rarityTraits;
        frequencies: typeof CONFIG.PF2E.frequencies;
        pfsFactions: typeof CONFIG.PF2E.pfsFactions;
        languages: { slug: Language | null; label: string }[];
        dying: {
            maxed: boolean;
            remainingDying: number;
            remainingWounded: number;
        };
    }

    interface CharacterSheetData<TActor extends CharacterPF2e = CharacterPF2e>
        extends CreatureSheetData<TActor> {
        abpEnabled: boolean;
        // ancestry: AncestryPF2e<CharacterPF2e> | null;
        // heritage: HeritagePF2e<CharacterPF2e> | null;
        // background: BackgroundPF2e<CharacterPF2e> | null;
        attributeBoostsAllocated: boolean;
        // biography: CharacterBiography;
        // class: ClassPF2e<CharacterPF2e> | null;
        numberToRank: Record<ZeroToFour, string>;
        classDCs: {
            // dcs: ClassDCSheetData[];
            primary: string | null;
            perDCDetails: boolean;
        };
        apexAttributeOptions: AttributeString[];
        // crafting: CraftingSheetData;
        // data: CharacterSystemSheetData;
        // deity: DeityPF2e<CharacterPF2e> | null;
        hasStamina: boolean;
        hasRealContainers: boolean;
        // languages: LanguageSheetData[];
        magicTraditions: Record<MagicTradition, string>;
        martialProficiencies: Record<"attacks" | "defenses", Record<string, MartialProficiency>>;
        // options: CharacterSheetOptions;
        preparationType: Object;
        showPFSTab: boolean;
        spellCollectionGroups: Record<SpellcastingTabSlug, SpellcastingSheetData[]>;
        hasNormalSpellcasting: boolean;
        tabVisibility: CharacterSheetTabVisibility;
        // actions: {
        //     encounter: Record<
        //         "action" | "reaction" | "free",
        //         { label: string; actions: ActionSheetData[] }
        //     >;
        //     exploration: {
        //         active: ActionSheetData[];
        //         other: ActionSheetData[];
        //     };
        //     downtime: ActionSheetData[];
        // };
        // feats: FeatGroup[];
        // elementalBlasts: ElementalBlastSheetConfig[];
        // senses: Sense[];
        // speeds: SpeedSheetData[];
    }

    class ActorSheetPF2e<TActor extends ActorPF2e = ActorPF2e> extends ActorSheet<TActor> {}

    class CreatureSheetPF2e<
        TActor extends CreaturePF2e = CreaturePF2e
    > extends ActorSheetPF2e<TActor> {}

    class FamiliarSheetPF2e<
        TActor extends FamiliarPF2e = FamiliarPF2e
    > extends CreatureSheetPF2e<TActor> {}

    class CharacterSheetPF2e<
        TActor extends CharacterPF2e = CharacterPF2e
    > extends CreatureSheetPF2e<TActor> {}

    abstract class AbstractNPCSheet extends CreatureSheetPF2e<NPCPF2e> {}

    class NPCSheetPF2e extends AbstractNPCSheet {}
}

export type {};
