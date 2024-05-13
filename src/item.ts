import { createHTMLFromString } from "foundry-api";
import { getDamageRollClass } from "./classes";
import { getActionGlyph, traitSlugToObject } from "./utils";

const HANDWRAPS_SLUG = "handwraps-of-mighty-blows";
const BANDS_OF_FORCE_SLUGS = [
    "bands-of-force",
    "bands-of-force-greater",
    "bands-of-force-major",
] as const;

function getAnnotationLabel(
    annotation: NonNullable<AuxiliaryActionPurpose> | null,
    hands: ZeroToTwo
) {
    if (!annotation) return null;

    const fullAnnotation = ["draw", "pick-up", "retrieve"].includes(annotation)
        ? `${annotation}${hands}H`
        : ["grip", "sheathe", "modular", "drop"].includes(annotation)
        ? annotation
        : null;

    return fullAnnotation ? game.pf2e.system.sluggify(fullAnnotation, { camel: "bactrian" }) : null;
}

function getCarryTypeActionData(
    item: PhysicalItemPF2e,
    annotation: Exclude<NonNullable<AuxiliaryActionPurpose>, "tower-shield" | "modular">,
    action?: AuxiliaryActionType
): [ZeroToThree, ItemCarryType];
function getCarryTypeActionData(
    item: PhysicalItemPF2e,
    annotation: NonNullable<AuxiliaryActionPurpose> | null,
    action?: AuxiliaryActionType
): [ZeroToThree, ItemCarryType | null];
function getCarryTypeActionData(
    item: PhysicalItemPF2e,
    annotation: NonNullable<AuxiliaryActionPurpose> | null,
    action: AuxiliaryActionType = "interact"
): [ZeroToThree, ItemCarryType | null] {
    switch (annotation) {
        case "draw":
            return [1, "held"];
        case "pick-up":
            return [1, "held"];
        case "retrieve": {
            const { container } = item;
            if (container?.isHeld) return [1, "held"];
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

async function changeCarryType(
    actor: CreaturePF2e,
    item: PhysicalItemPF2e<CreaturePF2e>,
    handsHeld: ZeroToTwo,
    annotation: NonNullable<AuxiliaryActionPurpose> | null,
    action: AuxiliaryActionType = "interact"
) {
    const [actionCost, carryType] = getCarryTypeActionData(item, annotation, action);

    if (!carryType) return;

    await actor.changeCarryType(item, { carryType, handsHeld });

    if (!game.combat) return;

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
        glyph: getActionGlyph(actionCost),
    };

    const [traits, message] =
        action === "raise-a-shield"
            ? [[], `PF2E.Actions.${actionKey}.Content`]
            : ["take-cover", "end-cover"].includes(action)
            ? [[], `PF2E.Actions.${actionKey}.${annotationKey}.Description`]
            : [
                  [traitSlugToObject("manipulate", CONFIG.PF2E.actionTraits)],
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
        type: CONST.CHAT_MESSAGE_STYLES.EMOTE,
    });
}

function hasFreePropertySlot(item: WeaponPF2e<CharacterPF2e>) {
    const potency = item.system.runes.potency;
    return potency > 0 && item.system.runes.property.length < potency;
}

function getEquippedHandwraps<T extends ActorPF2e>(actor: T) {
    return actor.itemTypes.weapon.find((weapon) => {
        const { category, slug, equipped, identification } = weapon._source.system;
        const { carryType, invested, inSlot } = equipped;

        return (
            category === "unarmed" &&
            carryType === "worn" &&
            inSlot &&
            invested &&
            identification.status === "identified" &&
            slug === HANDWRAPS_SLUG
        );
    });
}

function calculateItemPrice(item: PhysicalItemPF2e, quantity = 1, ratio = 1) {
    const coins = game.pf2e.Coins.fromPrice(item.price, quantity);
    return ratio === 1 ? coins : coins.scale(ratio);
}

async function consumeItem(event: Event, item: ConsumablePF2e) {
    const uses = item.uses;
    if (uses.max && uses.value < 1) return null;

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
    const contentHTML = createHTMLFromString(template);

    contentHTML.querySelector("button[data-action='consume']")?.remove();
    contentHTML.querySelector("footer")?.remove();

    const flavor = contentHTML.outerHTML;

    if (item.system.damage) {
        const DamageRoll = getDamageRollClass();
        const { formula, type, kind } = item.system.damage;
        const roll = new DamageRoll(`(${formula})[${type},${kind}]`);

        roll.toMessage({
            speaker,
            flavor,
            flags,
        });
    } else {
        ChatMessage.create({ speaker, content: flavor, flags });
    }

    if (item.system.uses.autoDestroy && uses.value <= 1) {
        const quantityRemaining = item.quantity;

        const isPreservedAmmo = item.category === "ammo" && item.system.rules.length > 0;
        if (quantityRemaining <= 1 && !isPreservedAmmo) {
            return item.delete();
        } else {
            return item.update({
                "system.quantity": Math.max(quantityRemaining - 1, 0),
                "system.uses.value": uses.max,
            });
        }
    } else {
        return item.update({
            "system.uses.value": Math.max(uses.value - 1, 0),
        });
    }
}

class MoveLootPopup extends FormApplication<{}, {}, MoveLootOptions> {
    onSubmitCallback: MoveLootCallback;

    constructor(object: ActorPF2e, options: Partial<MoveLootOptions>, callback: MoveLootCallback) {
        super(object, options);

        this.onSubmitCallback = callback;
    }

    override async getData() {
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

    static override get defaultOptions(): MoveLootOptions {
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

    override async _updateObject(
        _event: DragEvent,
        formData: Record<string, unknown> & MoveLootFormData
    ): Promise<void> {
        this.onSubmitCallback(formData.quantity, formData.newStack);
    }
}

interface MoveLootOptions extends FormApplicationOptions {
    quantity: {
        default: number;
        max: number;
    };
    newStack: boolean;
    lockStack: boolean;
    isPurchase: boolean;
}

interface MoveLootFormData extends FormData {
    quantity: number;
    newStack: boolean;
}

interface PopupData {
    quantity: {
        default: number;
        max: number;
    };
    newStack: boolean;
    lockStack: boolean;
    prompt: string;
    buttonLabel: string;
}

type MoveLootCallback = (quantity: number, newStack: boolean) => void;

type BandsOfForceSlug = (typeof BANDS_OF_FORCE_SLUGS)[number];

export {
    BANDS_OF_FORCE_SLUGS,
    HANDWRAPS_SLUG,
    MoveLootPopup,
    calculateItemPrice,
    changeCarryType,
    consumeItem,
    getAnnotationLabel,
    getCarryTypeActionData,
    getEquippedHandwraps,
    hasFreePropertySlot,
};
export type { BandsOfForceSlug };
