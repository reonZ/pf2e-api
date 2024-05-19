import { RollNotePF2e } from "./notes";
declare function ErrorPF2e(message: string): Error;
declare function objectHasKey<O extends object>(obj: O, key: unknown): key is keyof O;
declare function tupleHasValue<const A extends readonly unknown[]>(array: A, value: unknown): value is A[number];
declare function setHasElement<T extends Set<unknown>>(set: T, value: unknown): value is SetElement<T>;
declare function ordinalString(value: number): string;
declare function htmlClosest<K extends keyof HTMLElementTagNameMap>(parent: MaybeHTML, selectors: K): HTMLElementTagNameMap[K] | null;
declare function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null;
declare function htmlClosest<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E | null;
declare function htmlQuery<K extends keyof HTMLElementTagNameMap>(parent: MaybeHTML, selectors: K): HTMLElementTagNameMap[K] | null;
declare function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null;
declare function htmlQuery<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E | null;
declare function localizer(prefix: string): (...args: Parameters<Localization["format"]>) => string;
declare function traitSlugToObject(trait: string, dictionary: Record<string, string | undefined>): TraitViewData;
declare function getActionGlyph(action: string | number | null | ActionCost): string;
declare function extractNotes(rollNotes: Record<string, RollNotePF2e[]>, selectors: string[]): RollNotePF2e[];
declare function createHTMLElement<K extends keyof HTMLElementTagNameMap>(nodeName: K, options?: CreateHTMLElementOptionsWithChildren): HTMLElementTagNameMap[K];
declare function createHTMLElement<K extends keyof HTMLElementTagNameMap>(nodeName: K, options?: CreateHTMLElementOptionsWithInnerHTML): HTMLElementTagNameMap[K];
declare function createHTMLElement<K extends keyof HTMLElementTagNameMap>(nodeName: K, options?: CreateHTMLElementOptionsWithNeither): HTMLElementTagNameMap[K];
declare function signedInteger(value: number, { emptyStringZero, zeroIsNegative }?: {
    emptyStringZero?: boolean | undefined;
    zeroIsNegative?: boolean | undefined;
}): string;
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
export { createHTMLElement, ErrorPF2e, extractNotes, getActionGlyph, htmlClosest, htmlQuery, localizer, objectHasKey, ordinalString, setHasElement, signedInteger, traitSlugToObject, tupleHasValue, };
