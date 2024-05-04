import { RollNotePF2e } from "../notes";

declare global {
    type AELikeChangeMode =
        | "override"
        | "multiply"
        | "add"
        | "subtract"
        | "remove"
        | "downgrade"
        | "upgrade";

    type RuleElementSource = {
        key?: JSONValue;
        label?: JSONValue;
        slug?: JSONValue;
        predicate?: JSONValue;
        priority?: JSONValue;
        ignored?: JSONValue;
        requiresInvestment?: JSONValue;
        requiresEquipped?: JSONValue;
        removeUponCreate?: JSONValue;
    };

    interface AutoChangeEntry {
        source: string;
        level: number | null;
        value: boolean | number | string | null;
        mode: AELikeChangeMode;
    }

    type CritSpecEffect = (DamageDicePF2e | ModifierPF2e | RollNotePF2e)[];
    type CritSpecSynthetic = (
        weapon: WeaponPF2e | MeleePF2e,
        options: Set<string>
    ) => CritSpecEffect | null;

    type DamageDiceSynthetics = { damage: DeferredDamageDice[] } & Record<
        string,
        DeferredDamageDice[] | undefined
    >;
    type ModifierSynthetics = Record<"all" | "damage", DeferredModifier[]> &
        Record<string, DeferredModifier[] | undefined>;
    type ModifierAdjustmentSynthetics = {
        all: ModifierAdjustment[];
        damage: ModifierAdjustment[];
    } & Record<string, ModifierAdjustment[] | undefined>;
    type DeferredModifier = DeferredValue<ModifierPF2e>;
    type DeferredDamageDice = (args: DeferredDamageDiceOptions) => DamageDicePF2e | null;
    type DeferredMovementType = DeferredValue<BaseSpeedSynthetic | null>;
    type DeferredEphemeralEffect = DeferredPromise<EffectSource | ConditionSource | null>;
    type DeferredStrike = (runes?: WeaponRuneSource) => WeaponPF2e<ActorPF2e> | null;

    interface BaseSpeedSynthetic extends Omit<LabeledSpeed, "label" | "type"> {
        type: MovementType;
        derivedFromLand: boolean;
    }

    interface MAPSynthetic {
        label: string;
        penalty: number;
        predicate: Predicate;
    }

    interface RollTwiceSynthetic {
        keep: "higher" | "lower";
        predicate?: Predicate;
    }

    interface SenseSynthetic {
        sense: Required<SenseData>;
        predicate: Predicate;
        force: boolean;
    }

    interface RuleElementSynthetics<TParent extends ActorPF2e = ActorPF2e> {
        criticalSpecializations: {
            standard: CritSpecSynthetic[];
            alternate: CritSpecSynthetic[];
        };
        damageAlterations: Record<string, DamageAlteration[]>;
        damageDice: DamageDiceSynthetics;
        degreeOfSuccessAdjustments: Record<string, DegreeOfSuccessAdjustment[]>;
        dexterityModifierCaps: DexterityModifierCapData[];
        ephemeralEffects: Record<
            string,
            { target: DeferredEphemeralEffect[]; origin: DeferredEphemeralEffect[] } | undefined
        >;
        modifierAdjustments: ModifierAdjustmentSynthetics;
        modifiers: ModifierSynthetics;
        movementTypes: { [K in MovementType]?: DeferredMovementType[] };
        multipleAttackPenalties: Record<string, MAPSynthetic[]>;
        rollNotes: Record<string, RollNotePF2e[]>;
        rollSubstitutions: Record<string, RollSubstitution[]>;
        rollTwice: Record<string, RollTwiceSynthetic[]>;
        senses: SenseSynthetic[];
        statistics: Map<string, Statistic<TParent>>;
        strikeAdjustments: StrikeAdjustment[];
        strikes: DeferredStrike[];
        striking: Record<string, StrikingSynthetic[]>;
        toggles: Record<string, Record<string, RollOptionToggle>>;
        tokenEffectIcons: TokenEffect[];
        tokenMarks: Map<TokenDocumentUUID, string>;
        tokenOverrides: DeepPartial<Pick<TokenSource, "light" | "name" | "alpha">> & {
            texture?:
                | { src: VideoFilePath; tint?: HexColorString }
                | { src: VideoFilePath; tint?: HexColorString; scaleX: number; scaleY: number };
        };
        weaponPotency: Record<string, PotencySynthetic[]>;
    }

    interface RollOptionToggle {
        itemId: string;
        label: string;
        placement: string;
        domain: string;
        option: string;
        suboptions: Suboption[];
        alwaysActive: boolean;
        checked: boolean;
        enabled: boolean;
    }

    interface PotencySynthetic {
        label: string;
        bonus: number;
        type: "item" | "potency";
        predicate: Predicate;
        property?: WeaponPropertyRuneType[];
    }

    interface StrikeAdjustment {
        adjustDamageRoll?: (
            weapon: WeaponPF2e | MeleePF2e,
            { materials }: { materials?: Set<MaterialDamageEffect> }
        ) => void;
        adjustWeapon?: (weapon: WeaponPF2e | MeleePF2e) => void;
        adjustTraits?: (weapon: WeaponPF2e | MeleePF2e, traits: ActionTrait[]) => void;
    }

    interface StrikingSynthetic {
        label: string;
        bonus: number;
        predicate: Predicate;
    }

    interface ChoiceSetSource extends RuleElementSource {
        flag?: unknown;
        prompt?: unknown;
        selection?: unknown;
        adjustName?: unknown;
        recordSlug?: unknown;
        allowedDrops?: unknown;
        allowNoSelection?: unknown;
        rollOption?: unknown;
    }

    interface RuleElementOptions extends ParentedDataModelConstructionOptions<ItemPF2e<ActorPF2e>> {
        sourceIndex?: number;
        suppressWarnings?: boolean;
    }

    type RuleElementConstructor = new (
        data: RuleElementSource,
        options: RuleElementOptions
    ) => RuleElementPF2e;

    class Suboption {}

    abstract class RuleElementPF2e extends FoundryDocument<ItemPF2e> {
        get item(): this["parent"];

        onUpdateEncounter?(data: {
            event: "initiative-roll" | "turn-start";
            actorUpdates: Record<string, unknown>;
        }): Promise<void>;
    }

    class ChoiceSetRuleElement extends RuleElementPF2e {}

    class DamageAlterationRuleElement extends RuleElementPF2e {}

    class DamageAlteration {}

    class RuleElements {
        static readonly builtin: Record<string, RuleElementConstructor | undefined>;
    }
}

export type {};
