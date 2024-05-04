import { RollNotePF2e } from "../notes";

declare global {
    interface AttackRollParams extends RollParameters {
        target?: TokenPF2e | null;
        getFormula?: true;
        consumeAmmo?: boolean;
        altUsage?: "thrown" | "melee" | null;
        rollTwice?: RollTwiceOption;
    }

    interface RollOrigin<
        TActor extends ActorPF2e | null = ActorPF2e | null,
        TStatistic extends Statistic | StrikeData | null = Statistic | StrikeData | null,
        TItem extends ItemPF2e<ActorPF2e> | null = ItemPF2e<ActorPF2e> | null
    > {
        actor: TActor;
        token: TokenDocumentPF2e | null;
        statistic: TStatistic | null;
        self: boolean;
        item: TItem;
        modifiers: ModifierPF2e[];
    }

    interface RollTarget {
        actor: ActorPF2e | null;
        token: TokenDocumentPF2e | null;
        statistic: Statistic | null;
        self: boolean;
        item: ItemPF2e<ActorPF2e> | null;
        distance: number | null;
        rangeIncrement: number | null;
    }

    interface BaseRollContext {
        options?: Set<string>;
        notes?: (RollNotePF2e | RollNoteSource)[];
        rollMode?: RollMode | "roll";
        origin?: RollOrigin | null;
        target?: RollTarget | null;
        traits?: ActionTrait[];
        outcome?: DegreeOfSuccessString | null;
        unadjustedOutcome?: DegreeOfSuccessString | null;
        createMessage?: boolean;
        skipDialog?: boolean;
    }

    interface RollParameters {
        event?: MouseEvent | JQuery.TriggeredEvent;
        options?: string[] | Set<string>;
        dc?: CheckDC | null;
        callback?: (roll: Rolled<Roll>) => void;
        modifiers?: ModifierPF2e[];
        createMessage?: boolean;
    }

    interface DamageRollParams extends Omit<AttackRollParams, "consumAmmo" | "rollTwice"> {
        mapIncreases?: Maybe<ZeroToTwo>;
        checkContext?: Maybe<CheckContextChatFlag>;
    }

    interface RollDataPF2e extends RollOptions {
        rollerId?: string;
        totalModifier?: number;
        showBreakdown?: boolean;
    }

    interface CheckRollDataPF2e extends RollDataPF2e {
        type?: CheckType;
        identifier?: Maybe<string>;
        action?: Maybe<string>;
        isReroll?: boolean;
        degreeOfSuccess?: ZeroToThree;
        damaging?: boolean;
        domains?: string[];
    }

    type CriticalDoublingRule = "double-damage" | "double-dice";

    interface AbstractDamageRollData extends RollOptions {
        evaluatePersistent?: boolean;
    }

    interface DamageRollFlag {
        outcome: DegreeOfSuccessString;
        total: number;
        traits: string[];
        types: Record<string, Record<string, number>>;
        diceResults: Record<string, Record<string, DieResult[]>>;
        baseDamageDice: number;
    }

    interface DamageRollData extends RollDataPF2e, AbstractDamageRollData {
        critRule?: Maybe<CriticalDoublingRule>;
        damage?: DamageTemplate;
        result?: DamageRollFlag;
        degreeOfSuccess?: DegreeOfSuccessIndex | null;
        increasedFrom?: number;
        splashOnly?: boolean;
        ignoredResistances?: { type: ResistanceType; max: number | null }[];
    }

    class CheckRoll extends Roll {
        get roller(): UserPF2e | null;
        get type(): CheckType;
        get degreeOfSuccess(): DegreeOfSuccessIndex | null;
        get isReroll(): boolean;
        get isRerollable(): boolean;
    }

    interface CheckRoll extends Roll {
        options: CheckRollDataPF2e & { showBreakdown: boolean };
    }

    abstract class AbstractDamageRoll extends Roll {
        get expectedValue(): number;
    }

    class DamageRoll extends AbstractDamageRoll {
        get instances(): DamageInstance[];
    }

    interface DamageRoll extends AbstractDamageRoll {
        constructor: typeof DamageRoll;

        options: DamageRollData & { showBreakdown: boolean };
    }

    class Grouping extends RollTerm<GroupingData> {}

    interface GroupingData extends RollTermData {
        class?: "Grouping";
        term: RollTermData | ArithmeticExpressionData;
    }

    interface ArithmeticExpressionData extends RollTermData {
        class?: "ArithmeticExpression";
        operator: ArithmeticOperator;
        operands: [RollTermData, RollTermData];
    }

    type ArithmeticOperator = "+" | "-" | "*" | "/" | "%";

    class ArithmeticExpression extends RollTerm<ArithmeticExpressionData> {
        operator: ArithmeticOperator;
        operands: [RollTerm, RollTerm];
    }
}

export type {};
