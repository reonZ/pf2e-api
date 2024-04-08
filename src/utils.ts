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

export {
    ErrorPF2e,
    htmlClosest,
    localizer,
    objectHasKey,
    tupleHasValue,
    setHasElement,
    ordinalString,
};
