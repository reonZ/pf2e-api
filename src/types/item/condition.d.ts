declare global {
    type ConditionSource = BaseItemSourcePF2e<"condition", ConditionSystemSource>;

    type DetectionConditionType = Extract<
        ConditionSlug,
        "hidden" | "observed" | "undetected" | "unnoticed"
    >;
    type ConditionKey = ConditionSlug | `persistent-damage-${string}`;

    type ConditionSlug =
        | "blinded"
        | "broken"
        | "clumsy"
        | "concealed"
        | "confused"
        | "controlled"
        | "dazzled"
        | "deafened"
        | "doomed"
        | "drained"
        | "dying"
        | "encumbered"
        | "enfeebled"
        | "fascinated"
        | "fatigued"
        | "fleeing"
        | "friendly"
        | "frightened"
        | "grabbed"
        | "helpful"
        | "hidden"
        | "hostile"
        | "immobilized"
        | "indifferent"
        | "invisible"
        | "malevolence"
        | "observed"
        | "off-guard"
        | "paralyzed"
        | "persistent-damage"
        | "petrified"
        | "prone"
        | "quickened"
        | "restrained"
        | "sickened"
        | "slowed"
        | "stunned"
        | "stupefied"
        | "unconscious"
        | "undetected"
        | "unfriendly"
        | "unnoticed"
        | "wounded";

    interface ConditionsGetOptions extends CollectionGetOptions {
        active?: boolean | null;
        temporary?: boolean | null;
    }

    type ConditionsBySlugOptions = {
        temporary?: boolean | null | undefined;
        active?: boolean | null | undefined;
    };

    interface PersistentSourceData {
        formula: string;
        damageType: DamageType;
        dc: number;
        criticalHit?: boolean;
    }

    interface PersistentDamageData extends PersistentSourceData {
        damage: DamageRoll;
        expectedValue: number;
    }

    interface ConditionSystemData
        extends Omit<ConditionSystemSource, "description" | "fromSpell">,
            Omit<AbstractEffectSystemData, "level" | "slug"> {
        persistent?: PersistentDamageData;
        duration: DurationData;
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

    interface PersistentDamagePF2e<TParent extends ActorPF2e> extends ConditionPF2e<TParent> {
        system: Omit<ConditionSystemData, "persistent"> & { persistent: PersistentDamageData };
    }

    class ConditionPF2e<TParent extends ActorPF2e = ActorPF2e> extends AbstractEffectPF2e<TParent> {
        onEndTurn(options?: { token?: TokenDocumentPF2e | null }): Promise<void>;
    }

    interface ConditionPF2e {
        readonly _source: ConditionSource;
        system: ConditionSystemData;

        get slug(): ConditionSlug;
    }
}

export type {};
