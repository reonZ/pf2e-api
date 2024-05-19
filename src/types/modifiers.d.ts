declare global {
    type ModifierType =
        | "untyped"
        | "ability"
        | "item"
        | "potency"
        | "status"
        | "proficiency"
        | "circumstance";

    interface ModifierAdjustment {
        slug: string | null;
        test: (options: string[] | Set<string>) => boolean;
        damageType?: DamageType;
        relabel?: string;
        suppress?: boolean;
        getNewValue?: (current: number) => number;
        getDamageType?: (current: DamageType | null) => DamageType | null;
    }

    interface RawModifier {
        slug?: string;
        domains?: string[];
        label: string;
        modifier: number;
        type?: ModifierType;
        ability?: AttributeString | null;
        adjustments?: ModifierAdjustment[];
        enabled?: boolean;
        ignored?: boolean;
        source?: string | null;
        custom?: boolean;
        damageType?: DamageType | null;
        damageCategory?: DamageCategoryUnique | null;
        predicate?: RawPredicate;
        critical?: boolean | null;
        traits?: string[];
        hideIfDisabled?: boolean;
        force?: boolean;
    }

    interface ModifierObjectParams extends RawModifier {
        name?: string;
        rule?: RuleElementPF2e | null;
        alterations?: DamageAlteration[];
    }

    class RollNotePF2e {}

    class StatisticModifier {
        constructor(slug: string, modifiers?: ModifierPF2e[], rollOptions?: string[] | Set<string>);

        slug: string;
        label?: string;
        totalModifier: number;
        notes?: RollNotePF2e[];
        domains?: string[];
    }

    class ModifierPF2e {
        constructor(args: ModifierObjectParams);

        kind: "bonus" | "penalty" | "modifier";

        test(options: string[] | Set<string>): void;
        toObject: () => ModifierObjectParams;
        clone(
            data?: Partial<ModifierObjectParams>,
            options?: { test?: Set<string> | string[] }
        ): ModifierPF2e;
    }

    interface ModifierPF2e extends RawModifier {}

    interface DamageDiceOverride {
        upgrade?: boolean;
        downgrade?: boolean;
        dieSize?: DamageDieSize;
        damageType?: DamageType;
        diceNumber?: number;
    }

    class DamageDicePF2e {
        selector: string;
        slug: string;
        label: string;
        diceNumber: number;
        dieSize: DamageDieSize | null;
        critical: boolean | null;
        category: "persistent" | "precision" | "splash" | null;
        damageType: DamageType | null;
        override: DamageDiceOverride | null;
        ignored: boolean;
        enabled: boolean;
        predicate: Predicate;
        alterations: DamageAlteration[];
        hideIfDisabled: boolean;
    }
}

export type {};
