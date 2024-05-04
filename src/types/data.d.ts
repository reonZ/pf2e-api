declare global {
    interface LabeledValue {
        label: string;
        value: number | string;
        type: string;
    }

    interface LabeledString extends LabeledValue {
        value: string;
    }

    interface LabeledNumber extends LabeledValue {
        value: number;
    }

    type HexColorString = string;
    type AudioFilePath = string;
    type ImageFilePath = string;
    type VideoFilePath = string;
    type FilePath = AudioFilePath | ImageFilePath | VideoFilePath;

    type ProficiencyRank = "untrained" | "trained" | "expert" | "master" | "legendary";

    type DropCanvasItemDataPF2e = DropCanvasData<"Item", ItemPF2e> & {
        value?: number;
        level?: number;
        spellFrom?: {
            collectionId: string;
            groupId: string;
            slotIndex: number;
        };
        context?: EffectContextData;
        fromInventory?: boolean;
    };

    interface HitPointsSummary {
        value: number;
        max: number;
        temp: number;
        unrecoverable: number;
        negativeHealing: boolean;
    }
}

export type {};
