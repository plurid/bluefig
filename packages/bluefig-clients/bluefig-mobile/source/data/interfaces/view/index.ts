// #region module
export type ViewElement =
    | ViewText
    | ViewInputText
    | ViewInputSelect
    | ViewInputSwitch
    | ViewInputSlider
    | ViewButton
    | ViewImage
    | ViewFile
    | ViewDivider
    | ViewList;


export interface ViewText {
    type: 'text';
    value: string;
    selectable?: boolean;
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
    initial?: string | number | (string | number)[];
    /**
     * Allow for multiple selection.
     */
    multiple?: boolean;
    /**
     * Set initial value, index of `options`.
     */
    action?: string;
}

export interface ViewInputSwitch {
    type: 'input-switch';
    title: string;
    store: string;
    initial?: boolean;
    action?: string;
}

export interface ViewInputSlider {
    type: 'input-slider';
    title: string;
    store: string;
    initial?: number;
    action?: string;
    maximum?: number;
    minimum?: number;
    step?: number;
}

export interface ViewButton {
    type: 'button';
    title: string;
    action: string;
}

export interface ViewImage {
    type: 'image';
    source: string;
    contentType?: string;
    height?: number;
    width?: number;
    alignment?: 'left' | 'right' | 'center';
}

export interface ViewFile {
    type: 'file';
    title: string;
    source: string;
}

export interface ViewDivider {
    type: 'divider';
}

export interface ViewList {
    type: 'list';
    items: ViewElement[];
}



export type ViewActionClient = string[];

export interface ViewRouteClient {
    location: string;
    title?: string;
    elements: ViewElement[];
    actions?: Record<string, ViewActionClient | undefined>;
}



export interface ActionPayload {
    view: string;
    name: string;
    arguments?: any;
    token?: string;
}
// #endregion module
