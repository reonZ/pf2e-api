"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasFreePropertySlot = exports.getEquippedHandwraps = exports.getCarryTypeActionData = exports.getAnnotationLabel = exports.detachSubitem = exports.consumeItem = exports.changeCarryType = exports.calculateItemPrice = exports.MoveLootPopup = exports.ITEM_CARRY_TYPES = exports.HANDWRAPS_SLUG = exports.BANDS_OF_FORCE_SLUGS = void 0;
const foundry_api_1 = require("foundry-api");
const classes_1 = require("./classes");
const utils_1 = require("./utils");
const ITEM_CARRY_TYPES = ["attached", "dropped", "held", "stowed", "worn"];
exports.ITEM_CARRY_TYPES = ITEM_CARRY_TYPES;
const HANDWRAPS_SLUG = "handwraps-of-mighty-blows";
exports.HANDWRAPS_SLUG = HANDWRAPS_SLUG;
const BANDS_OF_FORCE_SLUGS = [
    "bands-of-force",
    "bands-of-force-greater",
    "bands-of-force-major",
];
exports.BANDS_OF_FORCE_SLUGS = BANDS_OF_FORCE_SLUGS;
function getAnnotationLabel(annotation, hands) {
    if (!annotation)
        return null;
    const fullAnnotation = ["draw", "pick-up", "retrieve"].includes(annotation)
        ? `${annotation}${hands}H`
        : ["grip", "sheathe", "modular", "drop"].includes(annotation)
            ? annotation
            : null;
    return fullAnnotation ? game.pf2e.system.sluggify(fullAnnotation, { camel: "bactrian" }) : null;
}
exports.getAnnotationLabel = getAnnotationLabel;
function getCarryTypeActionData(item, annotation, action = "interact") {
    switch (annotation) {
        case "draw":
            return [1, "held"];
        case "pick-up":
            return [1, "held"];
        case "retrieve": {
            const { container } = item;
            if (container?.isHeld)
                return [1, "held"];
            const usage = container?.system.usage;
            const actionCost = usage?.type === "held" || usage?.where === "backpack" ? 2 : 1;
            return [actionCost, "held"];
        }
        case "grip":
            return [action === "interact" ? 1 : 0, "held"];
        case "sheathe":
            return [1, "worn"];
        case "modular":
            return [1, null];
        case "drop":
            return [0, "dropped"];
        case "tower-shield": {
            const cost = action === "take-cover" ? 1 : 0;
            return [cost, null];
        }
        default:
            return [1, null];
    }
}
exports.getCarryTypeActionData = getCarryTypeActionData;
async function changeCarryType(actor, item, handsHeld, annotation, action = "interact") {
    const [actionCost, carryType] = getCarryTypeActionData(item, annotation, action);
    if (!carryType)
        return;
    await actor.changeCarryType(item, { carryType, handsHeld });
    if (!game.combat)
        return;
    const templates = {
        flavor: "./systems/pf2e/templates/chat/action/flavor.hbs",
        content: "./systems/pf2e/templates/chat/action/content.hbs",
    };
    const sluggify = game.pf2e.system.sluggify;
    const actionKey = sluggify(action, { camel: "bactrian" });
    const annotationKey = annotation ? sluggify(annotation, { camel: "bactrian" }) : null;
    const fullAnnotationKey = getAnnotationLabel(annotation, handsHeld);
    const flavorAction = {
        title: `PF2E.Actions.${actionKey}.Title`,
        subtitle: fullAnnotationKey ? `PF2E.Actions.${actionKey}.${fullAnnotationKey}.Title` : null,
        glyph: (0, utils_1.getActionGlyph)(actionCost),
    };
    const [traits, message] = action === "raise-a-shield"
        ? [[], `PF2E.Actions.${actionKey}.Content`]
        : ["take-cover", "end-cover"].includes(action)
            ? [[], `PF2E.Actions.${actionKey}.${annotationKey}.Description`]
            : [
                [(0, utils_1.traitSlugToObject)("manipulate", CONFIG.PF2E.actionTraits)],
                `PF2E.Actions.${actionKey}.${fullAnnotationKey}.Description`,
            ];
    const flavor = await renderTemplate(templates.flavor, { action: flavorAction, traits });
    const content = await renderTemplate(templates.content, {
        imgPath: item.img,
        message: game.i18n.format(message, {
            actor: actor.name,
            weapon: item.name,
            // shield: item.shield?.name ?? item.name,
            // damageType: game.i18n.localize(`PF2E.Damage.RollFlavor.${selection}`),
        }),
    });
    const token = actor.getActiveTokens(false, true).shift();
    await getDocumentClass("ChatMessage").create({
        content,
        speaker: ChatMessage.getSpeaker({ actor, token }),
        flavor,
        type: CONST.CHAT_MESSAGE_STYLES.EMOTE,
    });
}
exports.changeCarryType = changeCarryType;
function hasFreePropertySlot(item) {
    const potency = item.system.runes.potency;
    return potency > 0 && item.system.runes.property.length < potency;
}
exports.hasFreePropertySlot = hasFreePropertySlot;
function getEquippedHandwraps(actor) {
    return actor.itemTypes.weapon.find((weapon) => {
        const { category, slug, equipped, identification } = weapon._source.system;
        const { carryType, invested, inSlot } = equipped;
        return (category === "unarmed" &&
            carryType === "worn" &&
            inSlot &&
            invested &&
            identification.status === "identified" &&
            slug === HANDWRAPS_SLUG);
    });
}
exports.getEquippedHandwraps = getEquippedHandwraps;
function calculateItemPrice(item, quantity = 1, ratio = 1) {
    const coins = game.pf2e.Coins.fromPrice(item.price, quantity);
    return ratio === 1 ? coins : coins.scale(ratio);
}
exports.calculateItemPrice = calculateItemPrice;
async function consumeItem(event, item) {
    const uses = item.uses;
    if (uses.max && uses.value < 1)
        return null;
    if (["wand", "scroll"].includes(item.category) && item.system.spell) {
        return item.consume();
    }
    const actor = item.actor;
    const multiUse = uses.max > 1;
    const key = uses.value === 1 && multiUse ? "UseExhausted" : multiUse ? "UseMulti" : "UseSingle";
    const flags = {
        pf2e: {
            origin: {
                sourceId: item.sourceId,
                uuid: item.uuid,
                type: item.type,
            },
        },
    };
    const speaker = ChatMessage.getSpeaker({ actor });
    const template = (await item.toMessage(event, { create: false })).content;
    const contentHTML = (0, foundry_api_1.createHTMLFromString)(template);
    contentHTML.querySelector("button[data-action='consume']")?.remove();
    contentHTML.querySelector("footer")?.remove();
    const flavor = contentHTML.outerHTML;
    if (item.system.damage) {
        const DamageRoll = (0, classes_1.getDamageRollClass)();
        const { formula, type, kind } = item.system.damage;
        const roll = new DamageRoll(`(${formula})[${type},${kind}]`);
        roll.toMessage({
            speaker,
            flavor,
            flags,
        });
    }
    else {
        ChatMessage.create({ speaker, content: flavor, flags });
    }
    if (item.system.uses.autoDestroy && uses.value <= 1) {
        const quantityRemaining = item.quantity;
        const isPreservedAmmo = item.category === "ammo" && item.system.rules.length > 0;
        if (quantityRemaining <= 1 && !isPreservedAmmo) {
            return item.delete();
        }
        else {
            return item.update({
                "system.quantity": Math.max(quantityRemaining - 1, 0),
                "system.uses.value": uses.max,
            });
        }
    }
    else {
        return item.update({
            "system.uses.value": Math.max(uses.value - 1, 0),
        });
    }
}
exports.consumeItem = consumeItem;
async function detachSubitem(subitem, skipConfirm) {
    const parentItem = subitem.parentItem;
    if (!parentItem)
        throw (0, utils_1.ErrorPF2e)("Subitem has no parent item");
    const localize = (0, utils_1.localizer)("PF2E.Item.Physical.Attach.Detach");
    const confirmed = skipConfirm ||
        (await Dialog.confirm({
            title: localize("Label"),
            content: (0, utils_1.createHTMLElement)("p", {
                children: [localize("Prompt", { attachable: subitem.name })],
            }).outerHTML,
        }));
    if (confirmed) {
        const deletePromise = subitem.delete();
        const createPromise = (async () => {
            // Find a stack match, cloning the subitem as worn so the search won't fail due to it being equipped
            const stack = subitem.isOfType("consumable")
                ? parentItem.actor?.inventory.findStackableItem(subitem.clone({ "system.equipped.carryType": "worn" }))
                : null;
            const keepId = !!parentItem.actor && !parentItem.actor.items.has(subitem.id);
            return (stack?.update({ "system.quantity": stack.quantity + 1 }) ??
                getDocumentClass("Item").create(foundry.utils.mergeObject(subitem.toObject(), {
                    "system.containerId": parentItem.system.containerId,
                }), { parent: parentItem.actor, keepId }));
        })();
        await Promise.all([deletePromise, createPromise]);
    }
}
exports.detachSubitem = detachSubitem;
class MoveLootPopup extends FormApplication {
    onSubmitCallback;
    constructor(object, options, callback) {
        super(object, options);
        this.onSubmitCallback = callback;
    }
    async getData() {
        const [prompt, buttonLabel] = this.options.isPurchase
            ? ["PF2E.loot.PurchaseLootMessage", "PF2E.loot.PurchaseLoot"]
            : ["PF2E.loot.MoveLootMessage", "PF2E.loot.MoveLoot"];
        return {
            ...(await super.getData()),
            quantity: {
                default: this.options.quantity.default,
                max: this.options.quantity.max,
            },
            newStack: this.options.newStack,
            lockStack: this.options.lockStack,
            prompt,
            buttonLabel,
        };
    }
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: "MoveLootPopup",
            classes: [],
            title: game.i18n.localize("PF2E.loot.MoveLootPopupTitle"),
            template: "systems/pf2e/templates/popups/loot/move-loot-popup.hbs",
            width: "auto",
            quantity: {
                default: 1,
                max: 1,
            },
            newStack: false,
            lockStack: false,
            isPurchase: false,
        };
    }
    async _updateObject(_event, formData) {
        this.onSubmitCallback(formData.quantity, formData.newStack);
    }
}
exports.MoveLootPopup = MoveLootPopup;
