type DropWarningType = "invalid-rank" | "cantrip-mismatch" | "invalid-spell";
interface WarnInvalidDropParams {
    spell: SpellPF2e;
    groupId?: Maybe<SpellSlotGroupId>;
}
declare const EFFECT_AREA_SHAPES: readonly ["burst", "cone", "cube", "cylinder", "emanation", "line", "square"];
declare const MAGIC_TRADITIONS: Set<"arcane" | "divine" | "occult" | "primal">;
declare function upgradeStatisticRank(statistic: Statistic<CreaturePF2e>, rank: OneToFour): Statistic<ActorPF2e> & {
    rank: OneToFour;
};
declare function createCounteractStatistic<TActor extends ActorPF2e>(ability: SpellcastingEntry<TActor>): Statistic<TActor>;
declare function getHighestSyntheticStatistic(actor: CharacterPF2e, withClassDcs?: boolean): Statistic<CharacterPF2e> | undefined;
declare function getHighestSpellcastingStatistic(actor: CharacterPF2e): {
    tradition: MagicTradition | null;
    statistic: Statistic<CharacterPF2e>;
} | undefined;
declare function getActorMaxRank(actor: CreaturePF2e): OneToTen;
declare function getRankLabel(rank: ZeroToTen): string;
declare function coerceToSpellGroupId(value: unknown): SpellSlotGroupId | null;
declare function spellSlotGroupIdToNumber(groupId: SpellSlotGroupId): ZeroToTen;
declare function spellSlotGroupIdToNumber(groupId: Maybe<string | number>): ZeroToTen | null;
declare function warnInvalidDrop(warning: DropWarningType, { spell, groupId }: WarnInvalidDropParams): void;
export { EFFECT_AREA_SHAPES, MAGIC_TRADITIONS, coerceToSpellGroupId, createCounteractStatistic, getActorMaxRank, getHighestSpellcastingStatistic, getHighestSyntheticStatistic, getRankLabel, spellSlotGroupIdToNumber, upgradeStatisticRank, warnInvalidDrop, };
