declare global {
    type BookSource = BasePhysicalItemSource<"book", BookSystemSource>;
    type BookTraits = PhysicalItemTraits<EquipmentTrait>;

    interface BookSystemSource extends PhysicalSystemSource {
        traits: BookTraits;
        category: "formula" | "spell";
        capacity: number;
        contents: ItemUUID[];
        subitems?: never;
    }

    interface BookSystemData
        extends Omit<
                BookSystemSource,
                | "apex"
                | "bulk"
                | "description"
                | "hp"
                | "identification"
                | "material"
                | "price"
                | "temporary"
                | "usage"
            >,
            Omit<PhysicalSystemData, "subitems" | "traits"> {}
}

export type {};
