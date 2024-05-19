declare global {
    type ImmunityType = string;
    type WeaknessType = string;
    type ResistanceType = string;

    type IWRType = string;

    type IWRException<TType extends IWRType = IWRType> =
        | TType
        | { definition: Predicate; label: string };

    interface IWRSource<TType extends IWRType = IWRType> {
        type: TType;
        exceptions?: IWRException<TType>[];

        get label(): string;
        get typeLabel(): string;
    }

    type ImmunitySource = IWRSource<ImmunityType>;

    abstract class IWR<TType extends IWRType> {}

    interface Immunity extends IWR<ImmunityType>, ImmunitySource {}

    interface Weakness extends IWR<WeaknessType>, WeaknessSource {
        value: number;
    }

    interface Resistance extends IWR<ResistanceType>, ResistanceSource {
        value: number;
        doubleVs?: IWRException<string>[] | undefined;
    }
}

export type {};
