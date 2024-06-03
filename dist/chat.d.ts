declare function createTradeContent(message: string, img: string): Promise<string>;
declare function createTradeMessage(subtitle: string, message: string, actor: ActorPF2e, item: ItemPF2e, senderId?: string): Promise<ChatMessagePF2e | undefined>;
declare function applyDamageFromMessage({ message, multiplier, addend, promptModifier, rollIndex, tokens, onDamageApplied, }: ApplyDamageFromMessageParams): Promise<void>;
declare function toggleOffShieldBlock(messageId: string): void;
declare function onClickShieldBlock(shieldButton: HTMLButtonElement, messageEl: HTMLLIElement, token?: TokenDocumentPF2e): void;
declare function selfApplyEffectFromMessage(message: ChatMessagePF2e, html: HTMLElement): Promise<void>;
type ApplyDamageFromMessageCallback = (message: ChatMessagePF2e, tokens: TokenDocumentPF2e[], rollIndex: number) => void;
interface ApplyDamageFromMessageParams {
    message: ChatMessagePF2e;
    multiplier?: number;
    addend?: number;
    promptModifier?: boolean;
    rollIndex?: number;
    tokens?: TokenDocumentPF2e[];
    onDamageApplied?: ApplyDamageFromMessageCallback;
}
export { applyDamageFromMessage, createTradeContent, createTradeMessage, onClickShieldBlock, selfApplyEffectFromMessage, toggleOffShieldBlock, };
