import { R, getActiveModule, localeCompare } from "foundry-api";
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

type RawStatisticData = Omit<StatisticData, "modifiers"> & {
    modifiers: ModifierObjectParams[];
};

function getStatisticData(statistic: Statistic) {
    const data = foundry.utils.deepClone(statistic.data) as RawStatisticData;
    data.modifiers = (statistic.modifiers ?? []).map((modifier) => modifier.toObject());
    return data;
}

function createStatisticFromRawData(actor: CreaturePF2e, data: RawStatisticData) {
    const Statistic = getStatisticClass(actor.skills.acrobatics);
    const statisticData = foundry.utils.deepClone(data) as StatisticData;

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

function getHighestSyntheticStatistic(actor: CharacterPF2e, withClassDcs = true) {
    const synthetics = Array.from(actor.synthetics.statistics.values());
    const statistics = withClassDcs
        ? [...synthetics, ...Object.values(actor.classDCs)]
        : synthetics;

    if (!statistics.length) return;

    const classStatistic = actor.classDC;
    const groupedStatistics = R.groupBy(statistics, R.prop("mod"));
    const highestMod = R.pipe(
        groupedStatistics,
        R.keys,
        R.sortBy([R.identity, "desc"]),
        R.first()
    ) as unknown as number;

    if (classStatistic && highestMod && classStatistic.mod === highestMod) {
        return classStatistic;
    }

    return groupedStatistics[highestMod][0];
}

function getHighestSpellcastingStatistic(actor: CharacterPF2e) {
    const entries = actor.spellcasting.spellcastingFeatures;
    if (!entries.length) return;

    const classAttribute = actor.classDC?.attribute;
    const groupedEntries = R.groupBy(entries, (entry) => entry.statistic.mod);

    const highestMod = R.pipe(
        groupedEntries,
        R.keys,
        R.sortBy([(x) => Number(x), "desc"]),
        R.first()
    ) as string;

    const highestResults = groupedEntries[highestMod].map((entry) => ({
        tradition: entry.tradition,
        statistic: entry.statistic,
    }));

    if (highestResults.length === 1 || !classAttribute) {
        return highestResults[0];
    }

    return (
        highestResults.find((entry) => entry.statistic.attribute === classAttribute) ||
        highestResults[0]
    );
}

function getActorMaxRank(actor: CreaturePF2e) {
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

async function getSummarizedSpellsDataForRender(
    actor: CreaturePF2e,
    sortByType: boolean,
    localize: (str: string) => string,
    entries?: SpellcastingSheetData[]
) {
    entries ??= await Promise.all(
        actor.spellcasting.collections.map((spells) => spells.entry.getSheetData({ spells }))
    );

    const focusPool = actor.system.resources?.focus ?? { value: 0, max: 0 };
    const pf2eDailies = getActiveModule<PF2eDailiesModule>("pf2e-dailies");

    const spells: SummarizedSpell[][] = [];
    const labels: string[] = [];

    let hasFocusCantrip = false;

    for (const entry of entries) {
        const entryId = entry.id;
        const entryDc = entry.statistic?.dc.value;
        const entryTooltip = entryDc
            ? `${entry.name} - ${game.i18n.format("PF2E.DCWithValue", { dc: entryDc, text: "" })}`
            : entry.name;
        const isFocus = entry.isFocusPool;
        const isRitual = entry.isRitual;
        const isCharges = entry.category === "charges";
        const isStaff = entry.isStaff;
        const isInnate = entry.isInnate;
        const isPrepared = entry.isPrepared;
        const isSpontaneous = entry.isSpontaneous;
        const isFlexible = entry.isFlexible;

        const consumable =
            entry.category === "items"
                ? actor.items.get<ConsumablePF2e<CharacterPF2e>>(entryId.split("-")[0])
                : undefined;

        for (const group of entry.groups) {
            if (!group.active.length || group.uses?.max === 0) continue;

            const groupNumber = spellSlotGroupIdToNumber(group.id);
            const slotSpells: SummarizedSpell[] = [];
            const isCantrip = group.id === "cantrips";
            const isBroken = !isCantrip && isCharges && !pf2eDailies?.active;
            const groupUses =
                typeof group.uses?.value === "number" ? (group.uses as ValueAndMax) : undefined;

            for (let slotId = 0; slotId < group.active.length; slotId++) {
                const active = group.active[slotId];
                if (!active?.spell || active.uses?.max === 0) continue;

                const { spell } = active;
                const spellId = spell.id;
                const uses =
                    isCantrip || isFocus || consumable || (isPrepared && !isFlexible)
                        ? undefined
                        : isCharges && !isBroken
                        ? entry.uses
                        : active.uses ?? groupUses;

                slotSpells.push({
                    name: spell.name,
                    itemId: spellId,
                    entryId,
                    groupId: group.id,
                    slotId,
                    action: spell.system.time.value,
                    castRank: active.castRank ?? spell.rank,
                    expended: isFocus ? !isCantrip && focusPool.value <= 0 : active.expended,
                    img: spell.img,
                    range: spell.system.range.value || "-&nbsp;",
                    rank: spell.rank,
                    entryName: entry.name,
                    entryDc,
                    entryTooltip,
                    consumable,
                    isBroken,
                    isFocus,
                    isRitual,
                    isCharges,
                    isStaff,
                    isInnate,
                    isPrepared,
                    isSpontaneous,
                    isFlexible,
                    uses: uses
                        ? {
                              ...uses,
                              input: isStaff
                                  ? ""
                                  : isCharges
                                  ? "system.slots.slot1.value"
                                  : isInnate
                                  ? "system.location.uses.value"
                                  : `system.slots.slot${groupNumber}.value`,
                              itemId: isStaff ? "" : isInnate ? spellId : entryId,
                          }
                        : undefined,
                    order: isCharges
                        ? 0
                        : isPrepared
                        ? 1
                        : isFocus
                        ? 2
                        : isInnate
                        ? 3
                        : isSpontaneous
                        ? 4
                        : 5,
                    category: consumable
                        ? `PF2E.Item.Consumable.Category.${consumable.category}`
                        : isStaff
                        ? localize("staff")
                        : isCharges
                        ? localize("charges")
                        : isInnate
                        ? "PF2E.PreparationTypeInnate"
                        : isSpontaneous
                        ? "PF2E.PreparationTypeSpontaneous"
                        : isFlexible
                        ? "PF2E.SpellFlexibleLabel"
                        : isFocus
                        ? "PF2E.TraitFocus"
                        : "PF2E.SpellPreparedLabel",
                });
            }

            if (slotSpells.length) {
                if (isFocus) {
                    if (isCantrip) {
                        hasFocusCantrip = true;
                    } else {
                        spells[12] ??= [];
                        spells[12].push(...slotSpells);
                        continue;
                    }
                } else if (isRitual) {
                    spells[13] ??= [];
                    spells[13].push(...slotSpells);
                    continue;
                }

                labels[groupNumber] ??= group.label;
                spells[groupNumber] ??= [];
                spells[groupNumber].push(...slotSpells);
            }
        }
    }

    if (spells.length) {
        const orderSort = (a: SummarizedSpell, b: SummarizedSpell) =>
            a.order === b.order ? localeCompare(a.name, b.name) : a.order - b.order;
        const nameSort = (a: SummarizedSpell, b: SummarizedSpell) => localeCompare(a.name, b.name);
        const sort = sortByType ? orderSort : nameSort;

        for (let i = 0; i < spells.length; i++) {
            const entry = spells[i];
            if (!entry || i > 11) continue;
            entry.sort(sort);
        }
    }

    labels[12] = "PF2E.Focus.Spells";
    labels[13] = "PF2E.Actor.Character.Spellcasting.Tab.Rituals";

    return {
        labels,
        spells,
        focusPool,
        isOwner: actor.isOwner,
        hasFocusCantrip,
    };
}

type SummarizedSpellsData = {
    labels: string[];
    spells: SummarizedSpell[][];
    focusPool: {
        value: number;
        max: number;
        cap?: number;
    };
    isOwner: boolean;
    hasFocusCantrip: boolean;
};

type SummarizedSpell = {
    itemId: string;
    entryId: string;
    entryDc: number | undefined;
    entryTooltip: string;
    groupId: SpellSlotGroupId;
    castRank: number;
    slotId: number | undefined;
    expended: boolean | undefined;
    name: string;
    action: string;
    img: string;
    order: number;
    entryName: string;
    category: string;
    isBroken: boolean;
    isFocus: boolean | undefined;
    isRitual: boolean | undefined;
    isCharges: boolean;
    isStaff: boolean | undefined;
    isInnate: boolean | undefined;
    isPrepared: boolean | undefined;
    isSpontaneous: boolean | undefined;
    isFlexible: boolean | undefined;
    consumable: ConsumablePF2e<CharacterPF2e> | undefined;
    range: string;
    rank: ZeroToTen;
    uses: (ValueAndMax & { input: string; itemId: string }) | undefined;
};

export type { SummarizedSpell, SummarizedSpellsData };
export {
    EFFECT_AREA_SHAPES,
    MAGIC_TRADITIONS,
    coerceToSpellGroupId,
    createCounteractStatistic,
    getActorMaxRank,
    getHighestSpellcastingStatistic,
    getHighestSyntheticStatistic,
    getRankLabel,
    getSummarizedSpellsDataForRender,
    spellSlotGroupIdToNumber,
    upgradeStatisticRank,
    warnInvalidDrop,
};
