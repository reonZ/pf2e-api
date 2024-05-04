declare global {
    type DamageKind = "damage" | "healing";

    type DamageDieSize = "d10" | "d12" | "d4" | "d6" | "d8";

    type DamageType =
        | "acid"
        | "bleed"
        | "bludgeoning"
        | "cold"
        | "electricity"
        | "fire"
        | "force"
        | "mental"
        | "piercing"
        | "poison"
        | "slashing"
        | "sonic"
        | "spirit"
        | "vitality"
        | "void"
        | "untyped";

    type DamageCategoryUnique = "precision" | "splash" | "persistent";

    type DamageCategory =
        | "abysium"
        | "adamantine"
        | "dawnsilver"
        | "djezet"
        | "duskwood"
        | "energy"
        | "inubrix"
        | "noqual"
        | "orichalcum"
        | "physical"
        | "siccatite"
        | "silver"
        | "precision"
        | "splash"
        | "cold-iron"
        | "keep-stone"
        | "peachwood"
        | "sisterstone-dusk"
        | "sisterstone-scarlet"
        | "sovereign-steel"
        | "warpglass"
        | "persistent";

    type MaterialDamageEffect =
        | "abysium"
        | "adamantine"
        | "dawnsilver"
        | "djezet"
        | "duskwood"
        | "inubrix"
        | "noqual"
        | "orichalcum"
        | "siccatite"
        | "silver"
        | "cold-iron"
        | "keep-stone"
        | "peachwood"
        | "sisterstone-dusk"
        | "sisterstone-scarlet"
        | "sovereign-steel"
        | "warpglass";

    interface RawDamageDice extends Required<DamageDiceParameters> {}

    type PartialParameters = Partial<Omit<DamageDicePF2e, "predicate">> &
        Pick<DamageDicePF2e, "selector" | "slug">;

    interface DamageDiceParameters extends PartialParameters {
        predicate?: RawPredicate;
    }

    interface DamageDamageContext extends BaseRollContext {
        type: "damage-roll";
        sourceType: "attack" | "check" | "save";
        outcome?: DegreeOfSuccessString | null;
        self?: RollOrigin | null;
        target?: RollTarget | null;
        options: Set<string>;
        secret?: boolean;
        domains: string[];
        mapIncreases?: ZeroToTwo;
    }

    type DamageDiceFaces = 6 | 4 | 8 | 10 | 12;

    interface DamagePartialTerm {
        modifier: number;
        dice: { number: number; faces: DamageDiceFaces } | null;
    }

    interface BaseDamageData {
        terms?: DamagePartialTerm[];
        damageType: DamageType;
        diceNumber?: number;
        dieSize?: DamageDieSize | null;
        modifier?: number;
        category: DamageCategoryUnique | null;
        materials?: MaterialDamageEffect[];
    }

    interface DamageFormulaData {
        base: BaseDamageData[];
        dice: DamageDicePF2e[];
        modifiers: ModifierPF2e[];
        maxIncreases?: number;
        ignoredResistances: { type: ResistanceType; max: number | null }[];
        kinds?: Set<DamageKind>;
    }

    interface ResolvedDamageFormulaData extends DamageFormulaData {
        roll?: never;
        formula: Record<DegreeOfSuccessString, string | null>;
        breakdown: Record<DegreeOfSuccessString, string[]>;
    }

    interface BaseDamageTemplate {
        name: string;
        materials: MaterialDamageEffect[];
        modifiers?: (ModifierPF2e | DamageDicePF2e)[];
    }

    interface SpellDamageTemplate extends BaseDamageTemplate {
        damage: {
            roll: DamageRoll;
            breakdown: string[];
        };
    }

    type AfflictionDamageTemplate = SpellDamageTemplate;
    type SimpleDamageTemplate = SpellDamageTemplate;

    interface WeaponDamageTemplate extends BaseDamageTemplate {
        damage: ResolvedDamageFormulaData;
    }

    type DamageTemplate =
        | WeaponDamageTemplate
        | SpellDamageTemplate
        | AfflictionDamageTemplate
        | SimpleDamageTemplate;

    class DamageInstance extends AbstractDamageRoll {
        kinds: Set<"damage" | "healing">;
        type: DamageType;
        persistent: boolean;
        materials: Set<MaterialDamageEffect>;
        critRule: CriticalDoublingRule | null;
    }
}

export type {};
