declare global {
    type SpellCategory = "cantrip" | "focus" | "ritual" | "spell";

    type MagicTradition = "arcane" | "divine" | "occult" | "primal";

    type EffectAreaShape = "burst" | "cone" | "cube" | "cylinder" | "emanation" | "line" | "square";

    type SpellTrait = string;

    type SpellSource = BaseItemSourcePF2e<"spell", SpellSystemSource>;

    interface SpellTraits extends ItemTraits {
        traditions: MagicTradition[];
    }

    interface SpellArea {
        type: EffectAreaShape;
        value: number;
        details?: string;
    }

    interface SpellDamageSource {
        formula: string;
        kinds?: DamageKind[];
        applyMod?: boolean;
        type: DamageType;
        category: DamageCategoryUnique | null;
        materials: MaterialDamageEffect[];
    }

    interface SpellHeighteningFixed {
        type: "fixed";
        levels: { [K in OneToTen]?: Partial<SpellSystemSource> };
    }

    interface SpellHeighteningInterval {
        type: "interval";
        interval: number;
        damage: Record<string, string>;
    }

    type SpellOverlay = SpellOverlayOverride;

    interface SpellOverlayOverride {
        system?: DeepPartial<SpellSystemSource>;
        name?: string;
        overlayType: "override";
        sort: number;
    }

    type SpellPassiveDefense = "ac" | `${SaveType}-dc`;

    interface SpellDefenseSource {
        passive: { statistic: SpellPassiveDefense } | null;
        save: { statistic: SaveType; basic: boolean } | null;
    }

    interface RitualData {
        primary: { check: string };
        secondary: { checks: string; casters: number };
    }

    interface SpellSystemSource extends ItemSystemSource {
        traits: SpellTraits;
        level: { value: OneToTen };
        requirements: string;
        target: {
            value: string;
        };
        range: {
            value: string;
        };
        area: SpellArea | null;
        time: {
            value: string;
        };
        duration: {
            value: string;
            sustained: boolean;
        };
        damage: Record<string, SpellDamageSource>;
        heightening?: SpellHeighteningFixed | SpellHeighteningInterval;
        overlays?: Record<string, SpellOverlay>;
        defense: SpellDefenseSource | null;
        cost: {
            value: string;
        };
        counteraction: boolean;
        ritual: RitualData | null;
        location: {
            value: string | null;
            signature?: boolean;
            heightenedLevel?: OneToTen;

            /** The level to heighten this spell to if it's a cantrip or focus spell */
            autoHeightenLevel?: OneToTen | null;

            /** Number of uses if this is an innate spell */
            uses?: ValueAndMax;
        };
    }

    interface SpellCastData {
        focusPoints: ZeroToThree;
    }

    interface SpellDamage extends Omit<SpellDamageSource, "kinds"> {
        kinds: Set<DamageKind>;
    }

    interface SpellDefenseData extends SpellDefenseSource {
        passive: { statistic: SpellPassiveDefense } | null;
    }

    interface SpellSystemData
        extends Omit<SpellSystemSource, "damage" | "description">,
            Omit<ItemSystemData, "level" | "traits"> {
        /** Time and resources consumed in the casting of this spell */
        cast: SpellCastData;
        damage: Record<string, SpellDamage>;
        defense: SpellDefenseData | null;
    }

    type SpellConsumableItemType = "cantripDeck5" | "scroll" | "wand";

    interface SpellToMessageOptions {
        create?: boolean;
        rollMode?: RollMode;
        data?: { castRank?: number };
    }

    interface SpellConstructionContext<TParent extends ActorPF2e>
        extends DocumentConstructionContext<TParent> {
        parentItem?: Maybe<ConsumablePF2e<TParent>>;
    }

    interface SpellVariantOptions {
        castRank?: number;
        overlayIds?: string[];
        entryId?: string | null;
    }

    class SpellPF2e<TParent extends ActorPF2e = ActorPF2e> extends ItemPF2e<TParent> {
        constructor(data: Partial<SpellSource>, context?: SpellConstructionContext<TParent>);

        parentItem: ConsumablePF2e<TParent> | null;

        get rarity(): Rarity;
        get rank(): OneToTen;
        get baseRank(): OneToTen;
        get isAttack(): boolean;
        get isCantrip(): boolean;
        get isFocusSpell(): boolean;
        get isRitual(): boolean;
        get traits(): Set<SpellTrait>;
        get traditions(): Set<MagicTradition>;
        get spellcasting(): BaseSpellcastingEntry<NonNullable<TParent>> | null;

        computeCastRank(slotNumber?: number): OneToTen;
        loadVariant(options?: SpellVariantOptions): this | null;
        override getRollOptions(
            prefix?: string,
            options?: { includeGranter?: boolean; includeVariants?: boolean }
        ): string[];
        toMessage(
            event?: Maybe<MouseEvent | JQuery.TriggeredEvent>,
            options?: SpellToMessageOptions
        ): Promise<ChatMessagePF2e | undefined>;
    }

    interface SpellPF2e {
        readonly _source: SpellSource;
        system: SpellSystemData;
    }
}

export type {};
