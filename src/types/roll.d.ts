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
        /** The triggering event */
        event?: MouseEvent | JQuery.TriggeredEvent;
        /** Any options which should be used in the roll. */
        options?: string[] | Set<string>;
        /** Optional DC data for the roll */
        dc?: CheckDC | null;
        /** Callback called when the roll occurs. */
        callback?: (roll: Rolled<Roll>) => void;
        /** Additional modifiers */
        modifiers?: ModifierPF2e[];
        /** Whether to create a message from the roll */
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

    type DegreeOfSuccessIndex = ZeroToThree;

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

    abstract class AbstractDamageRoll extends Roll {}

    class DamageRoll extends AbstractDamageRoll {}
}

export type {};
