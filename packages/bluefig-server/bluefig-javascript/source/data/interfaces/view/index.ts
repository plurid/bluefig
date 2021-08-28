// #region module
export type PromiseOf<T> = () => Promise<T>;
export type TypeOrPromiseOf<T> = T | PromiseOf<T>;

export type StringOrPromiseOf = TypeOrPromiseOf<string>;
export type StringArrayOrPromiseOf = TypeOrPromiseOf<string[]>;
export type NumberOrPromiseOf = TypeOrPromiseOf<number>;
export type BooleanOrPromiseOf = TypeOrPromiseOf<boolean>;
export type StringOrNumberOrPromiseOf = TypeOrPromiseOf<string | number>;


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
    value: StringOrPromiseOf;
    selectable?: BooleanOrPromiseOf;
}

export interface ViewInputText {
    type: 'input-text';
    title?: StringOrPromiseOf;
    store: StringOrPromiseOf;
    initial?: StringOrPromiseOf;
}

export interface ViewInputSelect {
    type: 'input-select';
    title?: StringOrPromiseOf;
    /**
     * Select from the options list.
     */
    options: StringArrayOrPromiseOf;
    store: StringOrPromiseOf;
    /**
     * Make the selection exclusive to one item.
     */
    initial?: StringOrNumberOrPromiseOf;
    exclusive?: BooleanOrPromiseOf;
    /**
     * Set initial value, index of `options`.
     */
    action?: StringOrPromiseOf;
}

export interface ViewInputSwitch {
    type: 'input-switch';
    title: StringOrPromiseOf;
    store: StringOrPromiseOf;
    initial?: BooleanOrPromiseOf;
    action?: StringOrPromiseOf;
}

export interface ViewInputSlider {
    type: 'input-slider';
    title: StringOrPromiseOf;
    store: StringOrPromiseOf;
    initial?: NumberOrPromiseOf;
    action?: StringOrPromiseOf;
    maximum?: NumberOrPromiseOf;
    minimum?: NumberOrPromiseOf;
    step?: NumberOrPromiseOf;
}

export interface ViewButton {
    type: 'button';
    title: StringOrPromiseOf;
    action: StringOrPromiseOf;
}

export type ViewImageAlignment = 'left' | 'right' | 'center';

export interface ViewImage {
    type: 'image';
    source: StringOrPromiseOf;
    contentType?: StringOrPromiseOf;
    height?: NumberOrPromiseOf;
    width?: NumberOrPromiseOf;
    alignment?: ViewImageAlignment | PromiseOf<ViewImageAlignment>;
}

export interface ViewFile {
    type: 'file';
    title: StringOrPromiseOf;
    source: StringOrPromiseOf;
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
    title?: StringOrPromiseOf;
    elements?: ViewElement[];
    actions?: Record<string, ViewActionClient | undefined>;
    notifications?: string[];
}



export interface ActionPayload {
    view: string;
    name: string;
    arguments?: any;
}
// #endregion module
