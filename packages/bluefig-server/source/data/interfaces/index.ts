// #region module
export type ViewElement =
    | ViewText
    | ViewInputText
    | ViewInputSelect
    | ViewButton
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

export interface ViewList {
    type: 'list';
    items: ViewElement[];
}



export type ViewActionExecution<P = any> = (
    payload?: P,
) => Promise<ViewRoute | void>;

export type ViewAction<P = any> =
    | {
        arguments: any[];
        execution: ViewActionExecution<P>;
    } | ViewActionExecution<P>;


export interface ViewRoute {
    title?: string;
    elements?: ViewElement[];
    actions?: Record<string, ViewAction | undefined>;
}


export type Views = Record<string, ViewRoute | undefined>;


export interface RequestView {
    view: string;
    action?: string;
    payload?: any;
}
// #endregion module
