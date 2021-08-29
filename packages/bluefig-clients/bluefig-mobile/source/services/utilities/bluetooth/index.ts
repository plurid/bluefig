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
export const BETWEEN_CALLS_WAIT_TIME = 2;

export interface Request {
    resource: string;
    id?: string;
    token?: string;
}

export interface Response {
    id?: string;
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
export const readData = async (
    characteristic: Characteristic,
    resource: string,
    token?: string,
): Promise<GetResponse> => {
    try {
        let data = '';
        let id = Math.random() + '';
        let finished = false;

        while (!finished) {
            const request: Request = {
                resource,
                id,
                token,
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

            data += response.data;

            if (response.id) {
                id = response.id;
            }

            if (response.end) {
                finished = true;
            } else {
                await new Promise((done) => {
                    setTimeout(() => {
                        done(true);
                    }, BETWEEN_CALLS_WAIT_TIME);
                });
            }
        }

        return {
            finished: true,
            characteristic,
            data,
        };
    } catch (error) {
        console.log('readData error', error);

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


export const chunker = (
    baseData: any,
    value: string,
) => {
    const CHUNK_FULL_SIZE = 512;
    const chunkSize = CHUNK_FULL_SIZE - dataToBase64(baseData).length;
    const chunks: string[] = [];
    const chunksNumber = Math.ceil(value.length / chunkSize);

    for (let i = 0; i < chunksNumber; i++) {
        const lowerLimit = i * chunkSize;
        const upperLimit = (i + 1) * chunkSize;

        const data = upperLimit > value.length
            ? value.slice(lowerLimit)
            : value.slice(lowerLimit, upperLimit);

        const finalChunk = i === chunksNumber - 1;

        const chunk: WriteChunk = {
            ...baseData,
            data,
            end: finalChunk ? 1 : 0,
        };

        chunks.push(dataToBase64(chunk));
    }

    return chunks;
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

        const chunks = chunker(
            writeBase,
            resource,
        );

        for (const chunk of chunks) {
            characteristic = await characteristic.writeWithResponse(
                chunk,
            );
        }


        let responseData = '';

        if (expectResponse) {
            const response = await readData(
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
        console.log('writeData error', error);

        return {
            finished: false,
            characteristic,
            data: '',
        };
    }
}
// #endregion module
