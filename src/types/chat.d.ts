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

    interface DieResult {
        faces: number;
        result: number;
    }

    interface ItemOriginFlag {
        actor?: ActorUUID;
        type: ItemType;
        uuid: string;
        castRank?: number;
        messageId?: string;
        variant?: { overlays: string[] };
        rollOptions?: string[];
    }

    interface DamageDamageFlag {
        context: DamageDamageContextFlag;
        target: ActorTokenFlag | null;
        modifiers: string[];
        dice: RawDamageDice[];
        origin: ItemOriginFlag | undefined;
        strike: {
            actor: ActorUUID;
            index: number;
            damaging: boolean;
            name: string;
            altUsage: "melee" | "thrown" | null;
        } | null;
        preformatted: "both";
    }

    interface DamageDamageContextFlag
        extends Required<Omit<DamageDamageContext, ContextFlagOmission | "self">> {
        actor: string | null;
        token: string | null;
        item?: string;
        mapIncreases?: ZeroToTwo;
        target: ActorTokenFlag | null;
        notes: RollNoteSource[];
        options: string[];
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

    class ChatMessagePF2e extends ChatMessage {
        rolls: Rolled<Roll>[];
        flags: { [k: string]: any };

        get isDamageRoll(): boolean;
        get token(): TokenDocumentPF2e | null;
        get item(): ItemPF2e<ActorPF2e> | null;
        get isRerollable(): boolean;
        get isCheckRoll(): boolean;
        get isReroll(): boolean;
        get actor(): ActorPF2e | null;
        get target(): { actor: ActorPF2e; token: TokenDocumentPF2e } | null;
    }

    interface ChatMessagePF2e extends Pick<FoundryDocument, "getFlag"> {}
}

export type {};
