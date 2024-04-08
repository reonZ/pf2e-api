declare global {
    interface SpellcastingEntry<TActor extends ActorPF2e> extends BaseSpellcastingEntry<TActor> {
        attribute: AttributeString;
        statistic: Statistic;
        counteraction: Statistic;
    }

    interface BaseSpellcastingEntry<TActor extends ActorPF2e = ActorPF2e> {
        id: string;
        name: string;
        actor: TActor;
        sort: number;
        category: SpellcastingCategory;
        attribute?: Maybe<AttributeString>;
        isFlexible: boolean;
        isFocusPool: boolean;
        isInnate: boolean;
        isPrepared: boolean;
        isRitual: boolean;
        isSpontaneous: boolean;
        isEphemeral: boolean;
        statistic?: Statistic | null;
        counteraction?: Statistic | null;
        tradition: MagicTradition | null;
        spells: SpellCollection<NonNullable<TActor>> | null;
        system?: SpellcastingEntrySystemData;

        getSheetData(
            options?: GetSheetDataOptions<NonNullable<TActor>>
        ): Promise<SpellcastingSheetData>;
        getRollOptions?(prefix: "spellcasting"): string[];

        canCast(spell: SpellPF2e, options?: { origin?: PhysicalItemPF2e }): boolean;

        cast(spell: SpellPF2e, options: CastOptions): Promise<void>;
    }

    type SpellcastingEntrySource = BaseItemSourcePF2e<
        "spellcastingEntry",
        SpellcastingEntrySystemSource
    >;

    class SpellcastingEntryPF2e<TParent extends ActorPF2e = ActorPF2e>
        extends ItemPF2e<TParent>
        implements SpellcastingEntry<TParent>
    {
        constructor(
            data: PreCreate<SpellcastingEntrySource>,
            context?: DocumentConstructionContext<TParent | ItemPF2e>
        );

        statistic: Statistic<TParent>;
        sort: number;
        spells: SpellCollection<NonNullable<TParent>> | null;

        get attribute(): AttributeString;
        get counteraction(): Statistic;
        get ability(): AttributeString;
        get tradition(): MagicTradition | null;
        get category(): SpellcastingCategory;
        get rank(): ZeroToFour;
        get isPrepared(): boolean;
        get isFlexible(): boolean;
        get isSpontaneous(): boolean;
        get isInnate(): boolean;
        get isFocusPool(): boolean;
        get isRitual(): false;
        get isEphemeral(): false;
        get highestRank(): ZeroToTen;
        get showSlotlessRanks(): boolean;

        prepareSiblingData(this: SpellcastingEntryPF2e<NonNullable<TParent>>): void;
        getSheetData(
            options?: GetSheetDataOptions<NonNullable<TParent>> | undefined
        ): Promise<SpellcastingSheetData>;
        canCast(
            spell: SpellPF2e<ActorPF2e>,
            options?: { origin?: PhysicalItemPF2e<ActorPF2e> | undefined } | undefined
        ): boolean;
        cast(spell: SpellPF2e<ActorPF2e>, options: CastOptions): Promise<void>;
        consume(spell: SpellPF2e<ActorPF2e>, rank: number, slotIndex?: number): Promise<boolean>;
    }

    interface SpellcastingEntryPF2e {
        readonly _source: SpellcastingEntrySource;
        system: SpellcastingEntrySystemData;
    }
}

export type {};
