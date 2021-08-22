// #region imports
    // #region libraries
    import {
        Characteristic,
    } from 'react-native-ble-plx';
    // #endregion libraries


    // #region external
    import {
        dataToBase64,
        base64ToData,
    } from '../base64';
    // #endregion external
// #endregion imports



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

export interface GetResponse {
    finished: boolean;
    characteristic: Characteristic;
    data: string;
}


/**
 *
 * @param characteristic
 * @param resource string parseable by the server
 * @param token
 * @returns
 */
export const getData = async (
    characteristic: Characteristic,
    resource: string,
    token?: string,
): Promise<GetResponse> => {
    try {
        let data = '';
        let id = '';
        let finished = false;
        let offset = 0;

        while (!finished) {
            const request: Request = {
                resource,
                id,
                token,
                offset,
            };
            characteristic = await characteristic.writeWithResponse(
                dataToBase64({
                    ...request,
                }),
            );

            characteristic = await characteristic.read();
            const response = base64ToData<Response>(characteristic.value || '');
            if (!response) {
                console.log('Something went wrong.');
                return {
                    finished: false,
                    characteristic,
                    data,
                };
            }

            offset = response.offset;
            data += response.data;

            if (response.id) {
                id = response.id;
            }

            if (response.end) {
                finished = true;
            }
        }

        return {
            finished: true,
            characteristic,
            data,
        };
    } catch (error) {
        console.log('error', error);

        return {
            finished: false,
            characteristic,
            data: '',
        };
    }
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


export interface WriteResponse {
    finished: boolean;
    characteristic: Characteristic;
    data: string;
}


/**
 *
 * @param characteristic
 * @param resource base64 string
 * @param token
 * @param expectResponse
 */
export const writeData = async (
    characteristic: Characteristic,
    resource: string,
    token?: string,
    expectResponse?: boolean,
): Promise<WriteResponse> => {
    try {
        const id = Math.random() + '';

        const writeBase: WriteChunk = {
            id,
            token,
            data: '',
            end: 0,
        };

        const CHUNK_FULL_SIZE = 512;
        const chunkSize = CHUNK_FULL_SIZE - dataToBase64(writeBase).length;
        const chunks: string[] = [];
        const chunksNumber = Math.ceil(resource.length / chunkSize);

        for (let i = 0; i < chunksNumber; i++) {
            const lowerLimit = i * chunkSize;
            const upperLimit = (i + 1) * chunkSize;

            const data = upperLimit > resource.length
                ? resource.slice(lowerLimit)
                : resource.slice(lowerLimit, upperLimit);

            const finalChunk = i === chunksNumber - 1;

            const chunk: WriteChunk = {
                ...writeBase,
                data,
                end: finalChunk ? 1 : 0,
            };

            chunks.push(dataToBase64(chunk));
        }


        for (const chunk of chunks) {
            characteristic = await characteristic.writeWithResponse(
                chunk,
            );
        }


        let responseData = '';

        if (expectResponse) {
            const response = await getData(
                characteristic,
                'response:' + id,
                token,
            );

            if (response.finished) {
                responseData = response.data;
                characteristic = response.characteristic;
            }
        }


        return {
            finished: true,
            characteristic,
            data: responseData,
        };
    } catch (error) {
        console.log('error', error);

        return {
            finished: false,
            characteristic,
            data: '',
        };
    }
}
// #endregion module
