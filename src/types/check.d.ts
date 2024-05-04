declare global {
    type RollTwiceOption = "keep-higher" | "keep-lower" | false;

    type CheckType =
        | "attack-roll"
        | "check"
        | "counteract-check"
        | "flat-check"
        | "initiative"
        | "perception-check"
        | "saving-throw"
        | "skill-check";

    interface CheckCheckContext extends BaseRollContext {
        type?: CheckType;
        identifier?: Maybe<string>;
        action?: Maybe<string>;
        rollTwice?: RollTwiceOption;
        actor?: ActorPF2e;
        token?: TokenDocumentPF2e | null;
        item?: ItemPF2e<ActorPF2e> | null;
        title?: string;
        dc?: CheckDC | null;
        domains?: string[];
        damaging?: boolean;
        isReroll?: boolean;
        mapIncreases?: Maybe<ZeroToTwo>;
        substitutions?: RollSubstitution[];
        altUsage?: Maybe<"thrown" | "melee">;
        dosAdjustments?: Record<DegreeOfSuccessString, { amount: number; label: string }>;
    }
}

export type {};
