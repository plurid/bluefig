// #region module
export type ViewElement =
    | ViewText
    | ViewInputText
    | ViewInputSelect
    | ViewButton
    | ViewImage
    | ViewList;


export interface ViewText {
    type: 'text';
    value: string;
}

export interface ViewInputText {
    type: 'input-text';
    title?: string;
    store: string;
    initial?: string;
}

export interface ViewInputSelect {
    type: 'input-select';
    title?: string;
    /**
     * Select from the options list.
     */
    options: string[];
    store: string;
    /**
     * Make the selection exclusive to one item.
     */
    initial?: number;
    exclusive?: boolean;
    /**
     * Set initial value, index of `options`.
     */
    action?: string;
}

export interface ViewButton {
    type: 'button';
    title: string;
    action: string;
}

export interface ViewImage {
    type: 'image';
    source: string;
    height?: number;
    width?: number;
    alignment?: 'left' | 'right' | 'center';
}

export interface ViewList {
    type: 'list';
    items: ViewElement[];
}



export type ViewActionClient = string[];

export interface ViewRouteClient {
    location: string;
    title?: string;
    elements?: ViewElement[];
    actions?: Record<string, ViewActionClient | undefined>;
}



export interface ActionPayload {
    view: string;
    name: string;
    arguments?: any;
    token?: string;
}
// #endregion module
