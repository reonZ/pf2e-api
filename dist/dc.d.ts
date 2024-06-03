declare function adjustDCByRarity(dc: number, rarity?: Rarity): number;
declare function calculateDC(level: number, { pwol, rarity }?: DCOptions): number;
export { adjustDCByRarity, calculateDC };
