declare global {
    type EffectSource = BaseItemSourcePF2e<"effect", EffectSystemSource> & {
        flags: DeepPartial<EffectFlags>;
    };

    interface EffectAuraData {
        slug: string;
        origin: ActorUUID;
        removeOnExit: boolean;
    }

    type EffectFlags = ItemFlagsPF2e & {
        pf2e: {
            aura?: EffectAuraData;
        };
    };

    type EffectTrait = string;

    interface EffectTraits extends ItemTraitsNoRarity<EffectTrait> {}

    interface AbstractEffectSystemSource extends ItemSystemSource {
        traits: EffectTraits;
        fromSpell?: boolean;
        expired?: boolean;
    }

    interface EffectBadgeBaseSource {
        labels?: string[];
    }

    interface EffectBadgeBase extends EffectBadgeBaseSource {
        label: string | null;
    }

    interface EffectBadgeCounterSource extends EffectBadgeBaseSource {
        type: "counter";
        min?: number;
        max?: number;
        value: number;
        loop?: boolean;
    }

    interface EffectBadgeCounter extends EffectBadgeCounterSource, EffectBadgeBase {
        min: number;
        max: number;
    }

    type BadgeReevaluationEventType = "initiative-roll" | "turn-start" | "turn-end";

    interface EffectBadgeValueSource extends EffectBadgeBaseSource {
        type: "value";
        value: number;
        reevaluate?: {
            event: BadgeReevaluationEventType;
            formula: string;
            initial?: number;
        } | null;
    }

    interface EffectBadgeFormulaSource extends EffectBadgeBaseSource {
        type: "formula";
        value: string;
        evaluate?: boolean;
        reevaluate?: BadgeReevaluationEventType | null;
    }

    interface EffectBadgeValue extends EffectBadgeValueSource, EffectBadgeBase {
        min: number;
        max: number;
    }

    interface EffectBadgeFormula extends EffectBadgeFormulaSource, EffectBadgeBase {}

    type EffectBadgeSource =
        | EffectBadgeCounterSource
        | EffectBadgeValueSource
        | EffectBadgeFormulaSource;
    type EffectBadge = EffectBadgeCounter | EffectBadgeValue | EffectBadgeFormula;

    type TimeUnit = "rounds" | "minutes" | "hours" | "days";
    type EffectExpiryType = "turn-start" | "turn-end" | "round-end";

    interface DurationData {
        value: number;
        unit: TimeUnit | "unlimited" | "encounter";
        expiry: EffectExpiryType | null;
    }

    interface EffectSystemSource extends AbstractEffectSystemSource {
        level: { value: number };
        start: {
            value: number;
            initiative: number | null;
        };
        duration: DurationData & {
            sustained: boolean;
        };
        tokenIcon: {
            show: boolean;
        };
        unidentified: boolean;
        badge: EffectBadgeSource | null;
        context: EffectContextData | null;
    }

    interface EffectContextSpellcastingData {
        attribute: { type: AttributeString; mod: number };
        tradition: MagicTradition | null;
    }

    interface EffectContextData {
        origin: {
            actor: ActorUUID;
            token: TokenDocumentUUID | null;
            item: ItemUUID | null;
            spellcasting: EffectContextSpellcastingData | null;
            rollOptions?: string[];
        };
        target: {
            actor: ActorUUID;
            token: TokenDocumentUUID | null;
        } | null;
        roll: Pick<CheckRoll, "total" | "degreeOfSuccess"> | null;
    }

    interface AbstractEffectSystemData extends ItemSystemData {
        traits: EffectTraits;
        fromSpell: boolean;
    }

    interface EffectSystemData
        extends Omit<EffectSystemSource, "description" | "fromSpell">,
            Omit<AbstractEffectSystemData, "level"> {
        expired: boolean;
        badge: EffectBadge | null;
        remaining: string;
    }

    abstract class AbstractEffectPF2e<
        TParent extends ActorPF2e = ActorPF2e
    > extends ItemPF2e<TParent> {
        get origin(): ActorPF2e | null;
    }

    interface AbstractEffectPF2e {
        readonly _source: AfflictionSource | ConditionSource | EffectSource;
        system: AfflictionSystemData | ConditionSystemData | EffectSystemData;
    }

    class EffectPF2e<TParent extends ActorPF2e = ActorPF2e> extends AbstractEffectPF2e<TParent> {
        get isLocked(): boolean;
        get badge(): EffectBadge | null;

        onEncounterEvent(event: BadgeReevaluationEventType): Promise<void>;
    }

    interface EffectPF2e {
        flags: EffectFlags;
        readonly _source: EffectSource;
        system: EffectSystemData;
    }
}

export type {};
