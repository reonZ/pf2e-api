declare global {
    type ConditionSource = BaseItemSourcePF2e<"condition", ConditionSystemSource>;

    type ConditionSlug = string;

    interface PersistentSourceData {
        formula: string;
        damageType: DamageType;
        dc: number;
        criticalHit?: boolean;
    }

    type ConditionValueData = { isValued: true; value: number } | { isValued: false; value: null };

    interface ConditionSystemSource extends AbstractEffectSystemSource {
        slug: ConditionSlug;
        references: {
            parent?: {
                id: string;
                type: string;
            };
            children: { id: string; type: "condition" }[];
            overriddenBy: { id: string; type: "condition" }[];
            overrides: { id: string; type: "condition" }[];
        };
        duration: { value: number };
        persistent?: PersistentSourceData;
        group: string | null;
        value: ConditionValueData;
        overrides: string[];
        context?: never;
        level?: never;
    }
}

export type {};
