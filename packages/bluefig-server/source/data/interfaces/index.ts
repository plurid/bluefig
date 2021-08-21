// #region module
export type ViewElement =
    | ViewText
    | ViewInput
    | ViewButton
    | ViewList;


export interface ViewText {
    type: 'text';
    content: string;
}

export interface ViewInput {
    type: 'input';
    action: string;
}

export interface ViewButton {
    type: 'button';
    content: string;
    action: string;
}

export interface ViewList {
    type: 'list';
    items: ViewElement[];
}



export type ViewActionExecution<P = any> = (
    payload?: P,
) => Promise<ViewRoute | void>;

export interface ViewAction<P = any> {
    arguments: any[];
    execution: ViewActionExecution<P>
}


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
