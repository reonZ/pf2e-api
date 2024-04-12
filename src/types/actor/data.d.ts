declare global {
    interface TraitViewData {
        /** The name of this action. */
        name: string;
        /** The label for this action which will be rendered on the UI. */
        label: string;
        /** The roll this trait applies to, if relevant. */
        rollName?: string;
        /** The option that this trait applies to the roll (of type `rollName`). */
        rollOption?: string;
        /** An extra css class added to the UI marker for this trait. */
        cssClass?: string;
        /** The description of the trait */
        description: string | null;
    }

    type RollFunction<T extends RollParameters = RollParameters> = (
        params: T
    ) => Promise<Rolled<CheckRoll> | null | string | void>;

    interface StrikeData extends StatisticModifier {
        slug: string;
        label: string;
        /** The type of action; currently just 'strike'. */
        type: "strike";
        /** The glyph for this strike (how many actions it takes, reaction, etc). */
        glyph: string;
        /** A description of this strike. */
        description: string;
        /** A description of what happens on a critical success. */
        criticalSuccess: string;
        /** A description of what happens on a success. */
        success: string;
        /** Action traits associated with this strike */
        traits: TraitViewData[];
        /** Any options always applied to this strike */
        options: string[];
        /**
         * Whether the strike and its auxiliary actions are available (usually when the weapon corresponding with the
         * strike is equipped)
         */
        ready: boolean;
        /** Whether striking itself, independent of the auxiliary actions, is possible */
        canStrike: boolean;
        /** Alias for `attack`. */
        roll?: RollFunction<AttackRollParams>;
        /** Roll to attack with the given strike (with no MAP; see `variants` for MAPs.) */
        attack?: RollFunction<AttackRollParams>;
        /** Roll normal (non-critical) damage for this weapon. */
        damage?: DamageRollFunction;
        /** Roll critical damage for this weapon. */
        critical?: DamageRollFunction;
        /** Alternative usages of a strike weapon: thrown, combination-melee, etc. */
        altUsages?: StrikeData[];
        /** A list of attack variants which apply the Multiple Attack Penalty. */
        variants: { label: string; roll: RollFunction<AttackRollParams> }[];

        /** Ammunition choices and selected ammo if this is a ammo consuming weapon. */
        ammunition?: {
            compatible: (ConsumablePF2e<ActorPF2e> | WeaponPF2e<ActorPF2e>)[];
            incompatible: (ConsumablePF2e<ActorPF2e> | WeaponPF2e<ActorPF2e>)[];
            selected: {
                id: string;
                compatible: boolean;
            } | null;
        };

        /** The weapon or melee item--possibly ephemeral--being used for the strike */
        item: WeaponPF2e<ActorPF2e> | MeleePF2e<ActorPF2e>;
    }

    type DamageRollFunction = (
        params?: DamageRollParams
    ) => Promise<string | Rolled<DamageRoll> | null>;

    type GangUpCircumstance = number | "animal-companion" | true;

    interface BaseHitPointsSource {
        value: number;
        max?: number;
        temp: number;
        details: string;
    }

    type OffGuardableCircumstance = true | number | false;

    interface ActorTraitsData<TTrait extends string> extends ActorTraitsSource<TTrait> {
        size?: ActorSizePF2e;
    }

    interface AuxiliaryInteractParams {
        weapon: WeaponPF2e<CharacterPF2e>;
        action: "interact";
        annotation: "draw" | "grip" | "modular" | "pick-up" | "retrieve" | "sheathe";
        hands?: ZeroToTwo;
    }

    interface AuxiliaryShieldParams {
        weapon: WeaponPF2e<CharacterPF2e>;
        action: "end-cover" | "raise-a-shield" | "take-cover";
        annotation?: "tower-shield";
        hands?: never;
    }

    interface AuxiliaryReleaseParams {
        weapon: WeaponPF2e<CharacterPF2e>;
        action: "release";
        annotation: "grip" | "drop";
        hands: 0 | 1;
    }

    type AuxiliaryActionParams =
        | AuxiliaryInteractParams
        | AuxiliaryShieldParams
        | AuxiliaryReleaseParams;
    type AuxiliaryActionType = AuxiliaryActionParams["action"];
    type AuxiliaryActionPurpose = AuxiliaryActionParams["annotation"];

    type AttributeString = "str" | "dex" | "con" | "int" | "wis" | "cha";

    type Size = "tiny" | "sm" | "med" | "lg" | "huge" | "grg";

    interface DexterityModifierCapData {
        value: number;
        source: string;
    }

    interface Frequency extends FrequencySource {
        value: number;
    }

    interface DeferredValueParams {
        resolvables?: Record<string, unknown>;
        injectables?: Record<string, unknown>;
        test?: string[] | Set<string>;
    }

    interface TestableDeferredValueParams extends DeferredValueParams {
        test: string[] | Set<string>;
    }

    interface DeferredDamageDiceOptions extends TestableDeferredValueParams {
        selectors: string[];
    }

    type DeferredValue<T> = (options?: DeferredValueParams) => T | null;
    type DeferredPromise<T> = (options?: DeferredValueParams) => Promise<T | null>;

    interface FrequencySource {
        value?: number;
        max: number;
        /** Gap between recharges as an ISO8601 duration, or "day" for daily prep. */
        per: FrequencyInterval;
    }

    type HitPointsStatistic = StatisticModifier & ActorHitPoints;

    interface RollOptionFlags {
        all: Record<string, boolean | undefined>;
        [key: string]: Record<string, boolean | undefined> | undefined;
    }

    type Rarity = "common" | "uncommon" | "rare" | "unique";
    type ActionType = "action" | "reaction" | "free" | "passive";
    type SaveType = "fortitude" | "reflex" | "will";

    type ZeroToTwo = 0 | 1 | 2;
    type ZeroToThree = ZeroToTwo | 3; // +1!
    type OneToThree = Exclude<ZeroToThree, 0>;
    type TwoToThree = Exclude<OneToThree, 1>;
    type ZeroToFour = ZeroToThree | 4;
    type OneToFour = Exclude<ZeroToFour, 0>;
    type ZeroToFive = ZeroToFour | 5;
    type OneToFive = OneToFour | Extract<ZeroToFive, 5>;
    type ZeroToSix = ZeroToFive | 6;
    type OneToSix = Exclude<ZeroToSix, 0>;
    type ZeroToTen = ZeroToFive | 6 | 7 | 8 | 9 | 10;
    type OneToTen = Exclude<ZeroToTen, 0>;
    type ZeroToEleven = ZeroToTen | 11;

    type ActionTrait = string;
    type EquipmentTrait = string;

    type FrequencyInterval =
        | "day"
        | "round"
        | "turn"
        | "PT1M"
        | "PT10M"
        | "PT1H"
        | "PT24H"
        | "P1W"
        | "P1M"
        | "P1Y";

    type MovementType = "land" | "burrow" | "climb" | "fly" | "swim";

    class ActorSizePF2e {
        value: Size;
        length: number;
        width: number;
    }

    interface InitiativeData extends StatisticTraceData {
        statistic: SkillLongForm | "perception";
        /**
         * If a pair of initiative rolls are tied, the next resolution step is the tiebreak priority. A lower value
         * constitutes a higher priority.
         */
        tiebreakPriority: ZeroToTwo;
    }

    type InitiativeTraceData = StatisticTraceData & InitiativeData;
}

export type {};
