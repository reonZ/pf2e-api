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

export {
    ErrorPF2e,
    getActionGlyph,
    htmlClosest,
    localizer,
    objectHasKey,
    ordinalString,
    setHasElement,
    traitSlugToObject,
    tupleHasValue,
};
