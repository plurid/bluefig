// #region module
export type PromiseOf<T> = () => Promise<T>;
export type TypeOrPromiseOf<T> = T | PromiseOf<T>;

export type StringOrPromiseOf = TypeOrPromiseOf<string>;
export type StringArrayOrPromiseOf = TypeOrPromiseOf<string[]>;
export type NumberOrPromiseOf = TypeOrPromiseOf<number>;
export type BooleanOrPromiseOf = TypeOrPromiseOf<boolean>;


export type ViewElement =
    | ViewText
    | ViewInputText
    | ViewInputSelect
    | ViewButton
    | ViewImage
    | ViewList;


export interface ViewText {
    type: 'text';
    value: StringOrPromiseOf;
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
    initial?: NumberOrPromiseOf;
    exclusive?: BooleanOrPromiseOf;
    /**
     * Set initial value, index of `options`.
     */
    action?: StringOrPromiseOf;
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
}



export interface ActionPayload {
    view: string;
    name: string;
    arguments?: any;
}
// #endregion module
