import { PredicatePF2e } from "..";

declare global {
    type ImmunityType = string;
    type WeaknessType = string;
    type ResistanceType = string;

    type IWRType = string;

    type IWRException<TType extends IWRType = IWRType> =
        | TType
        | { definition: PredicatePF2e; label: string };

    interface IWRSource<TType extends IWRType = IWRType> {
        type: TType;
        exceptions?: IWRException<TType>[];
    }

    type ImmunitySource = IWRSource<ImmunityType>;

    abstract class IWR<TType extends IWRType> {}

    class Immunity extends IWR<ImmunityType> implements ImmunitySource {
        type: string;
        exceptions?: IWRException<string>[] | undefined;
    }

    class Weakness extends IWR<WeaknessType> implements WeaknessSource {
        value: number;
        type: string;
        exceptions?: IWRException<string>[] | undefined;
    }

    class Resistance extends IWR<ResistanceType> implements ResistanceSource {
        value: number;
        doubleVs?: IWRException<string>[] | undefined;
        type: string;
        exceptions?: IWRException<string>[] | undefined;
    }
}

export type {};
