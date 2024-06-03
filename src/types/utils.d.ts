declare global {
    type MaybeHTML = Maybe<Document | Element | EventTarget>;

    function getDocumentClass(name: "ChatMessage"): typeof ChatMessagePF2e;
    function getDocumentClass(name: "Item"): typeof ItemPF2e;
}

export type {};
