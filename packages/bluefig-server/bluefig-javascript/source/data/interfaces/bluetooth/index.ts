// #region module
export interface Request {
    resource: string;
    id?: string;
    token?: string;
}


export interface Reading {
    resource: string;
    id: string;
}


export interface ReadingData {
    chunks: string[];
    sent: number;
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
