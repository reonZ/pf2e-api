declare global {
    type ContextFlagOmission =
        | "actor"
        | "action"
        | "altUsage"
        | "createMessage"
        | "damaging"
        | "dosAdjustments"
        | "item"
        | "mapIncreases"
        | "notes"
        | "options"
        | "origin"
        | "range"
        | "target"
        | "token";

    interface ActorTokenFlag {
        actor: ActorUUID | TokenDocumentUUID;
        token?: TokenDocumentUUID;
    }

    interface CheckContextChatFlag extends Required<Omit<CheckCheckContext, ContextFlagOmission>> {
        actor: string | null;
        token: string | null;
        item?: string;
        dosAdjustments?: DegreeAdjustmentsRecord;
        roller?: "origin" | "target";
        origin: ActorTokenFlag | null;
        target: ActorTokenFlag | null;
        altUsage?: "thrown" | "melee" | null;
        notes: RollNoteSource[];
        options: string[];
    }

    class ChatMessagePF2e extends ChatMessage {}
}

export type {};
