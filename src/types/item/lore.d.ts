declare global {
    type LoreSource = BaseItemSourcePF2e<"lore", LoreSystemSource>;

    interface LoreSystemSource extends ItemSystemSource {
        traits: OtherTagsOnly;
        mod: { value: number };
        proficient: { value: ZeroToFour };
        variants?: Record<string, { label: string; options: string }>;
        level?: never;
    }

    interface LoreSystemData extends Omit<LoreSystemSource, "description">, ItemSystemData {
        level?: never;
        traits: OtherTagsOnly;
    }

    class LorePF2e<TParent extends ActorPF2e = ActorPF2e> extends ItemPF2e<TParent> {}

    interface LorePF2e {
        readonly _source: LoreSource;
        system: LoreSystemData;
    }
}

export type {};
