/// <reference types="jquery" />
/// <reference types="jquery" />
/// <reference types="@types/tooltipster" />
declare class IdentifyItemPopup extends FormApplication<PhysicalItemPF2e> {
    static get defaultOptions(): FormApplicationOptions;
    dcs: IdentifyMagicDCs | GenericIdentifyDCs | IdentifyAlchemyDCs;
    getData(): Promise<IdentifyPopupData>;
    activateListeners($html: JQuery): void;
    _updateObject(_event: Event, formData: Record<string, unknown>): Promise<void>;
}
interface IdentifyPopupData extends FormApplicationData {
    isMagic: boolean;
    isAlchemical: boolean;
    dcs: GenericIdentifyDCs | IdentifyMagicDCs | IdentifyAlchemyDCs;
}
type MagicSkill = Extract<SkillLongForm, "arcana" | "nature" | "religion" | "occultism">;
type IdentifyMagicDCs = Record<MagicSkill, number>;
type IdentifyAlchemyDCs = {
    crafting: number;
};
type GenericIdentifyDCs = {
    dc: number;
};
export { IdentifyItemPopup };
