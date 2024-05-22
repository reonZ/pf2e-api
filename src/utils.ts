import { R } from "foundry-api";
import { RollNotePF2e } from "./notes";

function ErrorPF2e(message: string): Error {
    return Error(`PF2e System | ${message}`);
}

function objectHasKey<O extends object>(obj: O, key: unknown): key is keyof O {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}

function tupleHasValue<const A extends readonly unknown[]>(
    array: A,
    value: unknown
): value is A[number] {
    return array.includes(value);
}

function setHasElement<T extends Set<unknown>>(set: T, value: unknown): value is SetElement<T> {
    return set.has(value);
}

function ordinalString(value: number): string {
    const pluralRules = new Intl.PluralRules(game.i18n.lang, { type: "ordinal" });
    const suffix = game.i18n.localize(`PF2E.OrdinalSuffixes.${pluralRules.select(value)}`);
    return game.i18n.format("PF2E.OrdinalNumber", { value, suffix });
}

function htmlClosest<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K
): HTMLElementTagNameMap[K] | null;
function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null;
function htmlClosest<E extends HTMLElement = HTMLElement>(
    parent: MaybeHTML,
    selectors: string
): E | null;
function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null {
    if (!(child instanceof Element)) return null;
    return child.closest<HTMLElement>(selectors);
}

function htmlQuery<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K
): HTMLElementTagNameMap[K] | null;
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null;
function htmlQuery<E extends HTMLElement = HTMLElement>(
    parent: MaybeHTML,
    selectors: string
): E | null;
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null {
    if (!(parent instanceof Element || parent instanceof Document)) return null;
    return parent.querySelector<HTMLElement>(selectors);
}

function localizer(prefix: string): (...args: Parameters<Localization["format"]>) => string {
    return (...[suffix, formatArgs]: Parameters<Localization["format"]>) =>
        formatArgs
            ? game.i18n.format(`${prefix}.${suffix}`, formatArgs)
            : game.i18n.localize(`${prefix}.${suffix}`);
}

function traitSlugToObject(
    trait: string,
    dictionary: Record<string, string | undefined>
): TraitViewData {
    const traitObject: TraitViewData = {
        name: trait,
        label: game.i18n.localize(dictionary[trait] ?? trait),
        description: null,
    };
    if (objectHasKey(CONFIG.PF2E.traitsDescriptions, trait)) {
        traitObject.description = CONFIG.PF2E.traitsDescriptions[trait];
    }

    return traitObject;
}

const actionGlyphMap: Record<string, string> = {
    0: "F",
    free: "F",
    1: "1",
    2: "2",
    3: "3",
    "1 or 2": "1/2",
    "1 to 3": "1 - 3",
    "2 or 3": "2/3",
    "2 rounds": "3,3",
    reaction: "R",
};

function getActionGlyph(action: string | number | null | ActionCost): string {
    if (!action && action !== 0) return "";

    const value =
        typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();

    return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}

function extractNotes(
    rollNotes: Record<string, RollNotePF2e[]>,
    selectors: string[]
): RollNotePF2e[] {
    return selectors.flatMap((s) => (rollNotes[s] ?? []).map((n) => n.clone()));
}

function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    options?: CreateHTMLElementOptionsWithChildren
): HTMLElementTagNameMap[K];
function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    options?: CreateHTMLElementOptionsWithInnerHTML
): HTMLElementTagNameMap[K];
function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    options?: CreateHTMLElementOptionsWithNeither
): HTMLElementTagNameMap[K];
function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    { classes = [], dataset = {}, children = [], innerHTML }: CreateHTMLElementOptions = {}
): HTMLElementTagNameMap[K] {
    const element = document.createElement(nodeName);
    if (classes.length > 0) element.classList.add(...classes);

    for (const [key, value] of Object.entries(dataset).filter(
        ([, v]) => !R.isNil(v) && v !== false
    )) {
        element.dataset[key] = value === true ? "" : String(value);
    }

    if (innerHTML) {
        element.innerHTML = innerHTML;
    } else {
        for (const child of children) {
            const childElement = child instanceof HTMLElement ? child : new Text(child);
            element.appendChild(childElement);
        }
    }

    return element;
}

function isRelevantEvent(
    event: Maybe<JQuery.TriggeredEvent | Event>
): event is MouseEvent | TouchEvent | KeyboardEvent | WheelEvent | JQuery.TriggeredEvent {
    return !!event && "ctrlKey" in event && "metaKey" in event && "shiftKey" in event;
}

function eventToRollParams(
    event: Maybe<JQuery.TriggeredEvent | Event>,
    rollType: { type: "check" | "damage" }
): ParamsFromEvent {
    const key = rollType.type === "check" ? "showCheckDialogs" : "showDamageDialogs";
    const skipDefault = !(game.user as UserPF2e).settings[key];
    if (!isRelevantEvent(event)) return { skipDialog: skipDefault };

    const params: ParamsFromEvent = { skipDialog: event.shiftKey ? !skipDefault : skipDefault };
    if (event.ctrlKey || event.metaKey) {
        params.rollMode = game.user.isGM ? "gmroll" : "blindroll";
    }

    return params;
}

let intlNumberFormat: Intl.NumberFormat;
function signedInteger(
    value: number,
    { emptyStringZero = false, zeroIsNegative = false } = {}
): string {
    if (value === 0 && emptyStringZero) return "";
    const nf = (intlNumberFormat ??= new Intl.NumberFormat(game.i18n.lang, {
        maximumFractionDigits: 0,
        signDisplay: "always",
    }));
    const maybeNegativeZero = zeroIsNegative && value === 0 ? -0 : value;

    return nf.format(maybeNegativeZero);
}

type ParamsFromEvent = { skipDialog: boolean; rollMode?: RollMode | "roll" };

interface CreateHTMLElementOptionsWithChildren extends CreateHTMLElementOptions {
    children: (HTMLElement | string)[];
    innerHTML?: never;
}

interface CreateHTMLElementOptionsWithInnerHTML extends CreateHTMLElementOptions {
    children?: never;
    innerHTML: string;
}

interface CreateHTMLElementOptionsWithNeither extends CreateHTMLElementOptions {
    children?: never;
    innerHTML?: never;
}

interface CreateHTMLElementOptions {
    classes?: string[];
    dataset?: Record<string, string | number | boolean | null | undefined>;
    children?: (HTMLElement | string)[];
    innerHTML?: string;
}

export {
    createHTMLElement,
    ErrorPF2e,
    eventToRollParams,
    extractNotes,
    getActionGlyph,
    htmlClosest,
    htmlQuery,
    localizer,
    objectHasKey,
    ordinalString,
    setHasElement,
    signedInteger,
    traitSlugToObject,
    tupleHasValue,
};
