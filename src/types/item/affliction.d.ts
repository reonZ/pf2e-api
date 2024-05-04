declare global {
    type AfflictionSource = BaseItemSourcePF2e<"affliction", AfflictionSystemSource> & {
        flags: DeepPartial<AfflictionFlags>;
    };

    type AfflictionFlags = ItemFlagsPF2e & {
        pf2e: {
            aura?: EffectAuraData;
        };
    };

    interface AfflictionSystemSource extends AbstractEffectSystemSource {
        level: { value: number };
        save: {
            type: SaveType;
            value: number;
        };
        stage: number;
        stages: Record<string, AfflictionStageData>;
        onset?: AfflictionOnset;
        duration: DurationData;
        start: {
            value: number;
            initiative: number | null;
        };
        context: EffectContextData | null;
    }

    interface AfflictionSystemData
        extends Omit<AfflictionSystemSource, "description" | "fromSpell">,
            Omit<AbstractEffectSystemData, "level"> {}

    interface AfflictionOnset {
        active: boolean;
        value: number;
        unit: TimeUnit;
    }

    interface AfflictionDamage {
        formula: string;
        type: DamageType;
        category?: DamageCategoryUnique | null;
    }

    interface AfflictionStageData {
        damage: Record<string, AfflictionDamage>;
        conditions: Record<string, AfflictionConditionData>;
        effects: AfflictionEffectData[];
        duration: Omit<DurationData, "expiry">;
    }

    interface AfflictionConditionData {
        slug: ConditionSlug;
        value?: number;
        linked?: boolean;
    }

    interface AfflictionEffectData {
        uuid: ItemUUID;
    }

    type AfflictionExpiryType = "turn-end";
}

export type {};
