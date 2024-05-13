"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConsumableFromSpell = void 0;
const foundry_api_1 = require("foundry-api");
const _1 = require(".");
const CANTRIP_DECK_ID = "tLa4bewBhyqzi6Ow";
const scrollCompendiumIds = {
    1: "RjuupS9xyXDLgyIr",
    2: "Y7UD64foDbDMV9sx",
    3: "ZmefGBXGJF3CFDbn",
    4: "QSQZJ5BC3DeHv153",
    5: "tjLvRWklAylFhBHQ",
    6: "4sGIy77COooxhQuC",
    7: "fomEZZ4MxVVK3uVu",
    8: "iPki3yuoucnj7bIt",
    9: "cFHomF3tty8Wi1e5",
    10: "o1XIHJ4MJyroAHfF",
};
const wandCompendiumIds = {
    1: "UJWiN0K3jqVjxvKk",
    2: "vJZ49cgi8szuQXAD",
    3: "wrDmWkGxmwzYtfiA",
    4: "Sn7v9SsbEDMUIwrO",
    5: "5BF7zMnrPYzyigCs",
    6: "kiXh4SUWKr166ZeM",
    7: "nmXPj9zuMRQBNT60",
    8: "Qs8RgNH6thRPv2jt",
    9: "Fgv722039TVM5JTc",
};
const SPELL_CONSUMABLE_NAME_TEMPLATES = {
    cantripDeck5: "PF2E.Item.Physical.FromSpell.CantripDeck5",
    scroll: "PF2E.Item.Physical.FromSpell.Scroll",
    wand: "PF2E.Item.Physical.FromSpell.Wand",
};
function getIdForSpellConsumable(type, heightenedLevel) {
    switch (type) {
        case "cantripDeck5":
            return CANTRIP_DECK_ID;
        case "scroll":
            return scrollCompendiumIds[heightenedLevel] ?? null;
        default:
            return wandCompendiumIds[heightenedLevel] ?? null;
    }
}
function getNameForSpellConsumable(type, spellName, heightenedLevel) {
    const templateId = SPELL_CONSUMABLE_NAME_TEMPLATES[type] ||
        `${type} of {name} (Rank {level})`;
    return game.i18n.format(templateId, { name: spellName, level: heightenedLevel });
}
async function createConsumableFromSpell(spell, { type, heightenedLevel = spell.baseRank, mystified = false, temp, itemName, itemImg, }) {
    const pack = game.packs.find((p) => p.collection === "pf2e.equipment-srd");
    const itemId = getIdForSpellConsumable(type, heightenedLevel);
    const consumable = await pack?.getDocument(itemId ?? "");
    if (!(0, foundry_api_1.isInstanceOf)(consumable, "ConsumablePF2e")) {
        throw (0, _1.ErrorPF2e)("Failed to retrieve consumable item");
    }
    const consumableSource = { ...consumable.toObject(), _id: null }; // Clear _id
    const traits = consumableSource.system.traits;
    traits.value = foundry_api_1.R.uniq([...traits.value, ...spell.traits]);
    traits.rarity = spell.rarity;
    if (traits.value.includes("magical") &&
        traits.value.some((t) => (0, _1.setHasElement)(_1.MAGIC_TRADITIONS, t))) {
        traits.value.splice(traits.value.indexOf("magical"), 1);
    }
    traits.value.sort();
    consumableSource.name = getNameForSpellConsumable(itemName ?? type, spell.name, heightenedLevel);
    const description = consumableSource.system.description.value;
    consumableSource.system.description.value = (() => {
        const paragraphElement = document.createElement("p");
        paragraphElement.append(spell.sourceId ? `@UUID[${spell.sourceId}]{${spell.name}}` : spell.description);
        const containerElement = document.createElement("div");
        const hrElement = document.createElement("hr");
        containerElement.append(paragraphElement, hrElement);
        hrElement.insertAdjacentHTML("afterend", description);
        return containerElement.innerHTML;
    })();
    // Cantrip deck casts at level 1
    if (type !== "cantripDeck5") {
        consumableSource.system.spell = foundry.utils.mergeObject(spell._source, {
            _id: foundry.utils.randomID(),
            system: { location: { value: null, heightenedLevel } },
        }, { inplace: false });
    }
    if (mystified) {
        consumableSource.system.identification.status = "unidentified";
    }
    if (typeof itemImg === "string") {
        consumableSource.img = itemImg;
    }
    if (temp) {
        consumableSource.system.temporary = true;
    }
    return consumableSource;
}
exports.createConsumableFromSpell = createConsumableFromSpell;
