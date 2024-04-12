"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnInvalidDrop = exports.upgradeStatisticRank = exports.spellSlotGroupIdToNumber = exports.getRankLabel = exports.getHighestSyntheticStatistic = exports.getHighestSpellcastingStatistic = exports.getActorMaxRank = exports.createCounteractStatistic = exports.coerceToSpellGroupId = exports.MAGIC_TRADITIONS = exports.EFFECT_AREA_SHAPES = void 0;
const foundry_api_1 = require("foundry-api");
const _1 = require(".");
const EFFECT_AREA_SHAPES = [
    "burst",
    "cone",
    "cube",
    "cylinder",
    "emanation",
    "line",
    "square",
];
exports.EFFECT_AREA_SHAPES = EFFECT_AREA_SHAPES;
const MAGIC_TRADITIONS = new Set(["arcane", "divine", "occult", "primal"]);
exports.MAGIC_TRADITIONS = MAGIC_TRADITIONS;
function getStatisticData(statistic) {
    const data = deepClone(statistic.data);
    data.modifiers = (statistic.modifiers ?? []).map((modifier) => modifier.toObject());
    return data;
}
function createStatisticFromRawData(actor, data) {
    const Statistic = (0, _1.getStatisticClass)(actor.skills.acrobatics);
    const statisticData = deepClone(data);
    statisticData.modifiers = data.modifiers.map((modifier) => new game.pf2e.Modifier(modifier));
    return new Statistic(actor, statisticData);
}
function upgradeStatisticRank(statistic, rank) {
    if (statistic.rank && statistic.rank >= rank) {
        return statistic;
    }
    const statisticData = getStatisticData(statistic);
    return createStatisticFromRawData(statistic.actor, statisticData);
}
exports.upgradeStatisticRank = upgradeStatisticRank;
function createCounteractStatistic(ability) {
    const actor = ability.actor;
    const baseModifier = actor.isOfType("npc")
        ? ability.statistic.check.modifiers
            .find((m) => m.type === "untyped" && m.slug === "base")
            ?.clone()
        : null;
    const Statistic = (0, _1.getStatisticClass)(ability.statistic);
    return new Statistic(actor, {
        slug: "counteract",
        label: "PF2E.Item.Spell.Counteract.Label",
        attribute: ability.statistic.attribute,
        rank: ability.statistic.rank || 1,
        check: { type: "check", modifiers: foundry_api_1.R.compact([baseModifier]) },
    });
}
exports.createCounteractStatistic = createCounteractStatistic;
function getHighestSyntheticStatistic(actor, withClassDcs = true) {
    const synthetics = Array.from(actor.synthetics.statistics.values());
    const statistics = withClassDcs
        ? [...synthetics, ...Object.values(actor.classDCs)]
        : synthetics;
    if (!statistics.length)
        return;
    const classStatistic = actor.classDC;
    const groupedStatistics = foundry_api_1.R.groupBy(statistics, foundry_api_1.R.prop("mod"));
    const highestMod = foundry_api_1.R.pipe(groupedStatistics, foundry_api_1.R.keys, foundry_api_1.R.sortBy([foundry_api_1.R.identity, "desc"]), foundry_api_1.R.first());
    if (classStatistic && highestMod && classStatistic.mod === highestMod) {
        return classStatistic;
    }
    return groupedStatistics[highestMod][0];
}
exports.getHighestSyntheticStatistic = getHighestSyntheticStatistic;
function getHighestSpellcastingStatistic(actor) {
    const entries = actor.spellcasting.spellcastingFeatures;
    if (!entries.length)
        return;
    const classAttribute = actor.classDC?.attribute;
    const groupedEntries = foundry_api_1.R.groupBy(entries, (entry) => entry.statistic.mod);
    const highestMod = foundry_api_1.R.pipe(groupedEntries, foundry_api_1.R.keys, foundry_api_1.R.sortBy([foundry_api_1.R.identity, "desc"]), foundry_api_1.R.first());
    const highestResults = groupedEntries[highestMod].map((entry) => ({
        tradition: entry.tradition,
        statistic: entry.statistic,
    }));
    if (highestResults.length === 1 || !classAttribute) {
        return highestResults[0];
    }
    return (highestResults.find((entry) => entry.statistic.attribute === classAttribute) ||
        highestResults[0]);
}
exports.getHighestSpellcastingStatistic = getHighestSpellcastingStatistic;
function getActorMaxRank(actor) {
    return Math.max(1, Math.ceil(actor.level / 2));
}
exports.getActorMaxRank = getActorMaxRank;
function getRankLabel(rank) {
    return game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
        rank: (0, _1.ordinalString)(rank),
    });
}
exports.getRankLabel = getRankLabel;
function coerceToSpellGroupId(value) {
    if (value === "cantrips")
        return value;
    const numericValue = Number(value) || NaN;
    return numericValue.between(1, 10) ? numericValue : null;
}
exports.coerceToSpellGroupId = coerceToSpellGroupId;
function spellSlotGroupIdToNumber(groupId) {
    if (groupId === "cantrips")
        return 0;
    const numericValue = Number(groupId ?? NaN);
    return numericValue.between(0, 10) ? numericValue : null;
}
exports.spellSlotGroupIdToNumber = spellSlotGroupIdToNumber;
function warnInvalidDrop(warning, { spell, groupId }) {
    const localize = (0, _1.localizer)("PF2E.Item.Spell.Warning");
    if (warning === "invalid-rank" && typeof groupId === "number") {
        const spellRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: (0, _1.ordinalString)(spell.baseRank),
        });
        const targetRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: (0, _1.ordinalString)(groupId),
        });
        ui.notifications.warn(localize("InvalidRank", { spell: spell.name, spellRank, targetRank }));
    }
    else if (warning === "cantrip-mismatch") {
        const locKey = spell.isCantrip ? "CantripToRankedSlots" : "NonCantripToCantrips";
        ui.notifications.warn(localize(locKey, { spell: spell.name }));
    }
    else if (warning === "invalid-spell") {
        const type = game.i18n.localize("PF2E.TraitFocus");
        ui.notifications.warn(localize("WrongSpellType", { type }));
    }
}
exports.warnInvalidDrop = warnInvalidDrop;
