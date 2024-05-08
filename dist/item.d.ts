declare const HANDWRAPS_SLUG = "handwraps-of-mighty-blows";
declare const BANDS_OF_FORCE_SLUGS: readonly ["bands-of-force", "bands-of-force-greater", "bands-of-force-major"];
declare function getAnnotationLabel(annotation: NonNullable<AuxiliaryActionPurpose> | null, hands: ZeroToTwo): string | null;
declare function getCarryTypeActionData(item: PhysicalItemPF2e, annotation: Exclude<NonNullable<AuxiliaryActionPurpose>, "tower-shield" | "modular">, action?: AuxiliaryActionType): [ZeroToThree, ItemCarryType];
declare function getCarryTypeActionData(item: PhysicalItemPF2e, annotation: NonNullable<AuxiliaryActionPurpose> | null, action?: AuxiliaryActionType): [ZeroToThree, ItemCarryType | null];
declare function changeCarryType(actor: CreaturePF2e, item: PhysicalItemPF2e<CreaturePF2e>, handsHeld: ZeroToTwo, annotation: NonNullable<AuxiliaryActionPurpose> | null, action?: AuxiliaryActionType): Promise<void>;
declare function hasFreePropertySlot(item: WeaponPF2e<CharacterPF2e>): boolean;
declare function getEquippedHandwraps<T extends ActorPF2e>(actor: T): WeaponPF2e<T> | undefined;
declare function calculateItemPrice(item: PhysicalItemPF2e, quantity?: number, ratio?: number): CoinsPF2e;
declare function consumeItem(event: Event, item: ConsumablePF2e): Promise<void | ConsumablePF2e<ActorPF2e> | null>;
declare class MoveLootPopup extends FormApplication<{}, {}, MoveLootOptions> {
    onSubmitCallback: MoveLootCallback;
    constructor(object: ActorPF2e, options: Partial<MoveLootOptions>, callback: MoveLootCallback);
    getData(): Promise<{
        quantity: {
            default: number;
            max: number;
        };
        newStack: boolean;
        lockStack: boolean;
        prompt: string;
        buttonLabel: string;
    }>;
    static get defaultOptions(): MoveLootOptions;
    _updateObject(_event: DragEvent, formData: Record<string, unknown> & MoveLootFormData): Promise<void>;
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
type MoveLootCallback = (quantity: number, newStack: boolean) => void;
type BandsOfForceSlug = (typeof BANDS_OF_FORCE_SLUGS)[number];
export { BANDS_OF_FORCE_SLUGS, HANDWRAPS_SLUG, MoveLootPopup, calculateItemPrice, changeCarryType, consumeItem, getAnnotationLabel, getCarryTypeActionData, getEquippedHandwraps, hasFreePropertySlot, };
export type { BandsOfForceSlug };
