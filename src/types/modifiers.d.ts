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

    class StatisticModifier {}

    class ModifierPF2e {
        constructor(args: ModifierObjectParams);

        toObject: () => ModifierObjectParams;
        clone(
            data?: Partial<ModifierObjectParams>,
            options?: { test?: Set<string> | string[] }
        ): ModifierPF2e;
    }

    interface ModifierPF2e extends RawModifier {}

    class DamageDicePF2e {}
}

export type {};
