declare global {
    type SpellcastingCategory =
        | "items"
        | "focus"
        | "prepared"
        | "spontaneous"
        | "innate"
        | "ritual"
        | "charges";

    interface SpellCollectionTypeSource {
        value: SpellcastingCategory;
        flexible?: boolean;
        validItems?: "scroll" | "" | null;
    }

    interface SpellPrepData {
        id: string | null;
        expended: boolean;
    }

    interface SpellSlotData {
        prepared: SpellPrepData[];
        value: number;
        max: number;
    }

    type SlotKey = `slot${ZeroToTen}`;

    type SpellcastingEntrySlots = Record<SlotKey, SpellSlotData>;

    interface SpellcastingEntrySystemSource extends ItemSystemSource {
        traits: OtherTagsOnly;
        ability: { value: AttributeString | "" };
        spelldc: {
            value: number;
            dc: number;
        };
        tradition: { value: MagicTradition | "" };
        prepared: SpellCollectionTypeSource;
        showSlotlessLevels: {
            value: boolean;
        };
        proficiency: {
            slug: string;
            value: ZeroToFour;
        };
        slots: SpellcastingEntrySlots;
        autoHeightenLevel: {
            value: OneToTen | null;
        };
        level?: never;
    }

    interface SpellCollectionTypeData extends SpellCollectionTypeSource {
        flexible: boolean;
        validItems: "scroll" | null;
    }

    interface SpellcastingEntrySystemData
        extends Omit<SpellcastingEntrySystemSource, "description">,
            Omit<ItemSystemData, "level" | "traits"> {
        prepared: SpellCollectionTypeData;
    }

    interface GetSheetDataOptions<TActor extends ActorPF2e> {
        spells?: Maybe<SpellCollection<TActor>>;
        prepList?: boolean;
    }

    type SpellSlotGroupId = "cantrips" | OneToTen;

    interface ActiveSpell {
        spell: SpellPF2e<ActorPF2e>;
        castRank?: number;
        expended?: boolean;
        signature?: boolean;
        virtual?: boolean;
        uses?: ValueAndMax;
    }

    interface SpellcastingSlotGroup {
        id: SpellSlotGroupId;
        label: string;
        maxRank: OneToTen;
        uses?: {
            value?: number;
            max: number;
        };
        number?: number;
        active: (ActiveSpell | null)[];
    }

    interface SpellPrepEntry {
        spell: SpellPF2e<ActorPF2e>;
        signature: boolean;
    }

    interface SpellCollectionData {
        groups: SpellcastingSlotGroup[];
        flexibleAvailable?: ValueAndMax | null;
        prepList: Record<ZeroToTen, SpellPrepEntry[]> | null;
    }

    interface SpellcastingSheetData
        extends Omit<
                BaseSpellcastingEntry<ActorPF2e>,
                | "statistic"
                | "isFlexible"
                | "isFocusPool"
                | "isInnate"
                | "isPrepared"
                | "isRitual"
                | "isSpontaneous"
                | "actor"
                | "spells"
                | "getSheetData"
                | "cast"
                | "canCast"
            >,
            SpellCollectionData {
        statistic: StatisticChatData | null;
        hasCollection: boolean;
        isFlexible?: boolean;
        isFocusPool?: boolean;
        isInnate?: boolean;
        isPrepared?: boolean;
        isRitual?: boolean;
        isStaff?: boolean;
        isSpontaneous?: boolean;
        usesSpellProficiency: boolean;
        showSlotlessLevels?: boolean;
        uses?: ValueAndMax;
    }

    interface CastOptions {
        slotId?: number;
        rank?: OneToTen;
        consume?: boolean;
        message?: boolean;
        rollMode?: RollMode;
    }

    class ActorSpellcasting<TActor extends ActorPF2e> extends DelegatedCollection<
        BaseSpellcastingEntry<TActor>
    > {
        collections: Collection<SpellCollection<TActor>>;

        get regular(): SpellcastingEntryPF2e<TActor>[];
        get spellcastingFeatures(): SpellcastingEntryPF2e<TActor>[];
    }
}

export type {};
