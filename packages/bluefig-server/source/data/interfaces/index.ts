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



export type ViewAction = (
    payload?: any,
) => Promise<any>;


export interface ViewRoute {
    title?: string;
    elements?: ViewElement[];
    actions?: Record<string, ViewAction>;
}
// #endregion module
