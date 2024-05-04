declare global {
    class CreatureConfig<TActor extends CreaturePF2e = CreaturePF2e> extends DocumentSheet<TActor> {
        get actor(): TActor;
    }

    class CharacterConfig extends CreatureConfig<CharacterPF2e> {}

    class NPCConfig extends CreatureConfig<NPCPF2e> {}
}

export type {};
