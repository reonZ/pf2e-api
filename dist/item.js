"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasFreePropertySlot = exports.getEquippedHandwraps = exports.getCarryTypeActionData = exports.getAnnotationLabel = exports.changeCarryType = exports.calculateItemPrice = exports.MoveLootPopup = exports.HANDWRAPS_SLUG = exports.BANDS_OF_FORCE_SLUGS = void 0;
const utils_1 = require("./utils");
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
    await ChatMessage.implementation.create({
        content,
        speaker: ChatMessage.getSpeaker({ actor, token }),
        flavor,
        type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
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
