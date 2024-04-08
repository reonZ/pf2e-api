import { R } from "foundry-api";
import { getStatisticClass, localizer, ordinalString } from ".";

type DropWarningType = "invalid-rank" | "cantrip-mismatch" | "invalid-spell";

interface WarnInvalidDropParams {
    spell: SpellPF2e;
    groupId?: Maybe<SpellSlotGroupId>;
}

const EFFECT_AREA_SHAPES = [
    "burst",
    "cone",
    "cube",
    "cylinder",
    "emanation",
    "line",
    "square",
] as const;

const MAGIC_TRADITIONS = new Set(["arcane", "divine", "occult", "primal"] as const);

function getSpellcastingEntryMaxSlotRank(entry: SpellcastingEntryPF2e) {
    let maxSlot = 0;

    if (entry.system.prepared.value === "items") {
        const levelMaxSlot = Math.ceil(entry.actor.level / 2);
        if (levelMaxSlot > maxSlot) maxSlot = levelMaxSlot;
    } else {
        for (let i = 0; i <= 10; i++) {
            const slotIndex = `slot${i}` as SlotKey;
            const slot = entry.system.slots[slotIndex];
            if (slot.max && i > maxSlot) maxSlot = i;
        }
    }

    const actorCharges = Math.ceil(entry.actor.level / 2);
    return maxSlot > actorCharges ? actorCharges : maxSlot;
}

type RawStatisticData = Omit<StatisticData, "modifiers"> & {
    modifiers: ModifierObjectParams[];
};

function getStatisticData(statistic: Statistic) {
    const data = deepClone(statistic.data) as RawStatisticData;
    data.modifiers = (statistic.modifiers ?? []).map((modifier) => modifier.toObject());
    return data;
}

function createStatisticFromRawData(actor: CreaturePF2e, data: RawStatisticData) {
    const Statistic = getStatisticClass(actor.skills.acrobatics);
    const statisticData = deepClone(data) as StatisticData;

    statisticData.modifiers = data.modifiers.map((modifier) => new game.pf2e.Modifier(modifier));
    return new Statistic(actor, statisticData);
}

function upgradeStatisticRank(statistic: Statistic<CreaturePF2e>, rank: OneToFour) {
    if (statistic.rank && statistic.rank >= rank) {
        return statistic as Statistic & { rank: OneToFour };
    }

    const statisticData = getStatisticData(statistic);
    return createStatisticFromRawData(statistic.actor, statisticData) as Statistic & {
        rank: OneToFour;
    };
}

function createCounteractStatistic<TActor extends ActorPF2e>(
    ability: SpellcastingEntry<TActor>
): Statistic<TActor> {
    const actor = ability.actor;

    // NPCs have neither a proficiency bonus nor specified attribute modifier: use their base attack roll modifier
    const baseModifier = actor.isOfType("npc")
        ? ability.statistic.check.modifiers
              .find((m) => m.type === "untyped" && m.slug === "base")
              ?.clone()
        : null;

    const Statistic = getStatisticClass(ability.statistic);
    return new Statistic(actor, {
        slug: "counteract",
        label: "PF2E.Item.Spell.Counteract.Label",
        attribute: ability.statistic.attribute,
        rank: ability.statistic.rank || 1,
        check: { type: "check", modifiers: R.compact([baseModifier]) },
    });
}

function getHighestSpellcastingStatistic(actor: CharacterPF2e) {
    const entries = actor.spellcasting.spellcastingFeatures;

    if (!entries.length) return;

    const statistics = entries.map((entry) => ({
        tradition: entry.tradition!,
        statistic: entry.statistic,
    }));

    const groupedStatistics = R.groupBy(statistics, ({ statistic }) => statistic.mod);
    const highestMod = R.pipe(groupedStatistics, R.keys, R.sortBy([R.identity, "desc"]), R.first());
    const highestStatistics = groupedStatistics[highestMod!];
    const classAttribute = actor.classDC?.attribute;

    return (
        (highestStatistics.length > 1 &&
            highestStatistics.find(({ statistic }) => statistic.attribute === classAttribute)) ||
        highestStatistics[0]
    );
}

function getMaxRank(actor: CreaturePF2e) {
    return Math.max(1, Math.ceil(actor.level / 2)) as OneToTen;
}

function getRankLabel(rank: ZeroToTen) {
    return game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
        rank: ordinalString(rank),
    });
}

function coerceToSpellGroupId(value: unknown): SpellSlotGroupId | null {
    if (value === "cantrips") return value;
    const numericValue = Number(value) || NaN;
    return numericValue.between(1, 10) ? (numericValue as OneToTen) : null;
}

function spellSlotGroupIdToNumber(groupId: SpellSlotGroupId): ZeroToTen;
function spellSlotGroupIdToNumber(groupId: Maybe<string | number>): ZeroToTen | null;
function spellSlotGroupIdToNumber(groupId: Maybe<string | number>): ZeroToTen | null {
    if (groupId === "cantrips") return 0;
    const numericValue = Number(groupId ?? NaN);
    return numericValue.between(0, 10) ? (numericValue as ZeroToTen) : null;
}

function warnInvalidDrop(
    warning: DropWarningType,
    { spell, groupId }: WarnInvalidDropParams
): void {
    const localize = localizer("PF2E.Item.Spell.Warning");
    if (warning === "invalid-rank" && typeof groupId === "number") {
        const spellRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: ordinalString(spell.baseRank),
        });
        const targetRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: ordinalString(groupId),
        });
        ui.notifications.warn(
            localize("InvalidRank", { spell: spell.name, spellRank, targetRank })
        );
    } else if (warning === "cantrip-mismatch") {
        const locKey = spell.isCantrip ? "CantripToRankedSlots" : "NonCantripToCantrips";
        ui.notifications.warn(localize(locKey, { spell: spell.name }));
    } else if (warning === "invalid-spell") {
        const type = game.i18n.localize("PF2E.TraitFocus");
        ui.notifications.warn(localize("WrongSpellType", { type }));
    }
}

export {
    EFFECT_AREA_SHAPES,
    MAGIC_TRADITIONS,
    coerceToSpellGroupId,
    createCounteractStatistic,
    getHighestSpellcastingStatistic,
    getMaxRank,
    getRankLabel,
    getSpellcastingEntryMaxSlotRank,
    spellSlotGroupIdToNumber,
    upgradeStatisticRank,
    warnInvalidDrop,
};
