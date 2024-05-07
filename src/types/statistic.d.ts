import { RollNotePF2e } from "../notes";

declare global {
    interface BaseStatisticTraceData {
        slug: string;
        label: string;
        value: number;
        breakdown: string;
        modifiers: Required<RawModifier>[];
    }

    type LabeledSenseData = Required<SenseData> & {
        label: string | null;
    };

    interface StatisticChatData {
        slug: string;
        label: string;
        rank: number | null;
        check: {
            label: string;
            mod: number;
            breakdown: string;
            map1: number;
            map2: number;
        };
        dc: {
            value: number;
            breakdown: string;
        };
    }

    interface PerceptionTraceData<
        TAttribute extends AttributeString | null = AttributeString | null
    > extends StatisticTraceData<TAttribute> {
        details: string;
        senses: LabeledSenseData[];
        vision: boolean;
    }

    interface StatisticTraceData<TAttribute extends AttributeString | null = AttributeString | null>
        extends BaseStatisticTraceData {
        /** Either the totalModifier or the dc depending on what the data is for */
        value: number;
        totalModifier: number;
        dc: number;
        attribute: TAttribute;
    }

    interface ArmorClassTraceData<
        TAttribute extends AttributeString | null = AttributeString | null
    > extends StatisticTraceData<TAttribute> {
        details: string;
        slug: "ac";
    }

    interface BaseStatisticData {
        slug: string;
        label: string;
        domains?: string[];
        modifiers?: ModifierPF2e[];
    }

    interface StatisticCheckData {
        type: CheckType;
        label?: string;
        domains?: string[];
        modifiers?: ModifierPF2e[];
    }

    interface StatisticDifficultyClassData {
        domains?: string[];
        label?: string;
        modifiers?: ModifierPF2e[];
    }

    interface StatisticData extends BaseStatisticData {
        attribute?: AttributeString | null;
        rank?: ZeroToFour;
        proficient?: boolean;
        lore?: boolean;
        check?: StatisticCheckData;
        dc?: StatisticDifficultyClassData;
        filter?: (m: ModifierPF2e) => boolean;
        rollOptions?: string[];
    }

    interface RollOptionConfig {
        extraRollOptions?: string[];
        item?: ItemPF2e | null;
        origin?: ActorPF2e | null;
        target?: ActorPF2e | null;
    }

    class StatisticCheck<TParent extends Statistic = Statistic> {
        parent: TParent;
        type: CheckType;
        label: string;
        domains: string[];
        mod: number;
        modifiers: ModifierPF2e[];

        roll(args?: StatisticRollParameters): Promise<Rolled<CheckRoll> | null>;
    }

    interface CheckDCReference {
        slug: string;
        value?: never;
    }

    type CheckRollCallback = (
        roll: Rolled<CheckRoll>,
        outcome: DegreeOfSuccessString | null | undefined,
        message: ChatMessagePF2e,
        event: Event | null
    ) => Promise<void> | void;

    interface StatisticRollParameters {
        event?: MouseEvent;
        identifier?: string;
        action?: string;
        token?: Maybe<TokenDocumentPF2e>;
        attackNumber?: number;
        target?: Maybe<ActorPF2e>;
        origin?: Maybe<ActorPF2e>;
        dc?: CheckDC | CheckDCReference | number | null;
        label?: string;
        slug?: Maybe<string>;
        title?: string;
        extraRollNotes?: (RollNotePF2e | RollNoteSource)[];
        extraRollOptions?: string[];
        modifiers?: ModifierPF2e[];
        item?: ItemPF2e<ActorPF2e> | null;
        rollMode?: RollMode | "roll";
        skipDialog?: boolean;
        rollTwice?: RollTwiceOption;
        traits?: (TraitViewData | string)[];
        damaging?: boolean;
        melee?: boolean;
        createMessage?: boolean;
        callback?: CheckRollCallback;
    }

    abstract class BaseStatistic<TActor extends ActorPF2e> {
        actor: TActor;
        slug: string;
        label: string;
        data: StatisticData;
        domains: string[];
        modifiers: ModifierPF2e[];
    }

    class Statistic<TActor extends ActorPF2e = ActorPF2e> extends BaseStatistic<TActor> {
        constructor(actor: TActor, data: StatisticData, config?: RollOptionConfig);

        attribute: AttributeString | null;
        rank: ZeroToFour | null;

        get attributeModifier(): ModifierPF2e | null;
        get check(): StatisticCheck<this>;
        get dc(): StatisticDifficultyClass<this>;
        get mod(): number;

        getChatData(options?: RollOptionConfig): StatisticChatData;
        withRollOptions(options?: RollOptionConfig): Statistic;

        getTraceData(
            this: Statistic<CreaturePF2e>,
            options?: { value?: "dc" | "mod" }
        ): StatisticTraceData<AttributeString>;
        getTraceData(options?: { value?: "dc" | "mod" }): StatisticTraceData;

        roll(args?: StatisticRollParameters): Promise<Rolled<CheckRoll> | null>;
    }

    class StatisticDifficultyClass<TParent extends Statistic = Statistic> {
        parent: TParent;
        domains: string[];
        label?: string;
        modifiers: ModifierPF2e[];
        options: Set<string>;

        get value(): number;
    }
}

export type {};
