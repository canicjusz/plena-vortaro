//https://github.com/microsoft/TypeScript/issues/10401#issuecomment-255964760

declare global {
  type ShadowRootMode = "open" | "closed";

  interface ShadowRootInit {
    mode: ShadowRootMode;
    delegatesFocus?: boolean;
  }

  interface CaretPosition {
    offsetNode: Node;
    offset: number;
    getClientRect(): ClientRect;
  }

  interface DocumentOrShadowRoot {
    getSelection(): Selection | null;
    elementFromPoint(x: number, y: number): Element | null;
    elementsFromPoint(x: number, y: number): NodeListOf<Element>;
    caretPositionFromPoint(x: number, y: number): CaretPosition | null;
    activeElement: Element | null;
    styleSheets: StyleSheetList;
  }

  interface ShadowRoot extends DocumentFragment, DocumentOrShadowRoot {
    host: HTMLElement;
    mode: ShadowRootMode;
  }

  interface Document extends DocumentOrShadowRoot {}

  interface AssignedNodesOptions {
    flatten: boolean = false;
  }

  interface HTMLSlotElement extends HTMLElement {
    name: string;
    assignedNodes(options?: AssignedNodesOptions): NodeList;
  }

  interface Element {
    attachShadow(shadowRootInitDict: ShadowRootInit): ShadowRoot;
    assignedSlot: HTMLSlotElement | null;
    slot: string;
    shadowRoot: ShadowRoot | null;
  }
}

export {};
