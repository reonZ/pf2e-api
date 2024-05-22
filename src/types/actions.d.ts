declare global {
    type ActionGlyph =
        | "A"
        | "D"
        | "T"
        | "R"
        | "F"
        | "a"
        | "d"
        | "t"
        | "r"
        | "f"
        | 1
        | 2
        | 3
        | "1"
        | "2"
        | "3";

    interface CheckResultCallback {
        actor: ActorPF2e;
        message?: ChatMessage;
        outcome: DegreeOfSuccessString | null | undefined;
        roll: Rolled<CheckRoll>;
    }

    interface ActionDefaultOptions {
        event?: JQuery.TriggeredEvent | Event | null;
        actors?: ActorPF2e | ActorPF2e[];
        glyph?: ActionGlyph;
        modifiers?: ModifierPF2e[];
        callback?: (result: CheckResultCallback) => void;
    }

    interface ActionMessageOptions {
        blind: boolean;
        variant: string;
        whisper: string[];
    }

    interface ActionVariantUseOptions extends Record<string, unknown> {
        actors: ActorPF2e | ActorPF2e[];
        event: Event;
        traits: ActionTrait[];
        target: ActorPF2e | TokenPF2e;
    }

    interface ActionVariant {
        cost?: ActionCost;
        description?: string;
        glyph?: string;
        name?: string;
        slug: string;
        traits: ActionTrait[];
        toMessage(options?: Partial<ActionMessageOptions>): Promise<ChatMessagePF2e | undefined>;
        use(options?: Partial<ActionVariantUseOptions>): Promise<unknown>;
    }

    type ActionSection = "skill" | "basic" | "specialty-basic";

    interface ActionUseOptions extends ActionVariantUseOptions {
        variant: string;
    }

    interface Action {
        cost?: ActionCost;
        description?: string;
        glyph?: string;
        img?: string;
        name: string;
        sampleTasks?: Partial<Record<ProficiencyRank, string>>;
        section?: ActionSection;
        slug: string;
        traits: ActionTrait[];
        variants: Collection<ActionVariant>;
        toMessage(options?: Partial<ActionMessageOptions>): Promise<ChatMessagePF2e | undefined>;
        use(options?: Partial<ActionUseOptions>): Promise<unknown>;
    }
}

export type {};
