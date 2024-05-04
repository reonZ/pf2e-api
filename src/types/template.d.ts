declare global {
    class MeasuredTemplateDocumentPF2e extends MeasuredTemplateDocument {
        get actor(): ActorPF2e | null;
        get item(): ItemPF2e<ActorPF2e> | null;
        get message(): ChatMessagePF2e | null;
        get areaShape(): EffectAreaShape | null;
    }
}

export type {};
