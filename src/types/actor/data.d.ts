import { saveTypes } from "../../data";
import { ATTRIBUTE_ABBREVIATIONS } from "../../skills";

declare global {
    interface TraitViewData {
        name: string;
        label: string;
        rollName?: string;
        rollOption?: string;
        cssClass?: string;
        description: string | null;
    }

    type RollFunction<T extends RollParameters = RollParameters> = (
        params: T
    ) => Promise<Rolled<CheckRoll> | null | string | void>;

    interface StrikeData extends StatisticModifier {
        slug: string;
        label: string;
        type: "strike";
        glyph: string;
        description: string;
        criticalSuccess: string;
        success: string;
        traits: TraitViewData[];
        options: string[];
        ready: boolean;
        canStrike: boolean;
        /** Alias for `attack`. */
        roll?: RollFunction<AttackRollParams>;
        attack?: RollFunction<AttackRollParams>;
        damage?: DamageRollFunction;
        critical?: DamageRollFunction;
        altUsages?: StrikeData[];
        variants: { label: string; roll: RollFunction<AttackRollParams> }[];
        ammunition?: {
            compatible: (ConsumablePF2e<ActorPF2e> | WeaponPF2e<ActorPF2e>)[];
            incompatible: (ConsumablePF2e<ActorPF2e> | WeaponPF2e<ActorPF2e>)[];
            selected: {
                id: string;
                compatible: boolean;
            } | null;
        };
        item: WeaponPF2e<ActorPF2e> | MeleePF2e<ActorPF2e>;
    }

    type Alignment = "CE" | "LE" | "LG" | "NG" | "CG" | "LN" | "N" | "CN" | "NE";

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

    type AttributeString = SetElement<typeof ATTRIBUTE_ABBREVIATIONS>;

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
    type SaveType = (typeof saveTypes)[number];

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
