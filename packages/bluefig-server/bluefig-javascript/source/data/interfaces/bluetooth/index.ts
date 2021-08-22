// #region module
export interface Request {
    resource: string;
    id?: string;
    token?: string;
    offset?: number;
}


export interface Response {
    id?: string;
    offset: number;
    data: string;
    end: boolean;
}


export interface WriteChunk {
    id: string;
    token?: string;
    data: string;
    /**
     * Indicates final chunk through `1` or `0`.
     */
    end: number;
}
// #endregion module
