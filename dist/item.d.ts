declare function getAnnotationLabel(annotation: NonNullable<AuxiliaryActionPurpose> | null, hands: ZeroToTwo): string | null;
declare function getCarryTypeActionData(item: PhysicalItemPF2e, annotation: Exclude<NonNullable<AuxiliaryActionPurpose>, "tower-shield" | "modular">, action?: AuxiliaryActionType): [ZeroToThree, ItemCarryType];
declare function getCarryTypeActionData(item: PhysicalItemPF2e, annotation: NonNullable<AuxiliaryActionPurpose> | null, action?: AuxiliaryActionType): [ZeroToThree, ItemCarryType | null];
declare function changeCarryType(actor: CreaturePF2e, item: PhysicalItemPF2e<CreaturePF2e>, handsHeld: ZeroToTwo, annotation: NonNullable<AuxiliaryActionPurpose> | null, action?: AuxiliaryActionType): Promise<void>;
declare function hasFreePropertySlot(item: WeaponPF2e<CharacterPF2e>): boolean;
export { changeCarryType, getAnnotationLabel, getCarryTypeActionData, hasFreePropertySlot };
