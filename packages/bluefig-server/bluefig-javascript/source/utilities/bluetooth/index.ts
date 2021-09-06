// #region imports
    // #region libraries
    import bleno from '@abandonware/bleno';
    // #endregion libraries
// #endregion imports



// #region module
export const chunker = <D = any>(
    baseData: D,
    value: string,
) => {
    const CHUNK_FULL_SIZE = bleno.mtu || 256;
    const chunkSize = CHUNK_FULL_SIZE - JSON.stringify(baseData).length;
    const chunks: string[] = [];
    const chunksNumber = Math.ceil(value.length / chunkSize);

    for (let i = 0; i < chunksNumber; i++) {
        const lowerLimit = i * chunkSize;
        const upperLimit = (i + 1) * chunkSize;

        const data = upperLimit > value.length
            ? value.slice(lowerLimit)
            : value.slice(lowerLimit, upperLimit);

        const finalChunk = i === chunksNumber - 1;

        const chunk = {
            ...baseData,
            data,
            end: finalChunk ? 1 : 0,
        };

        chunks.push(JSON.stringify(chunk));
    }

    return chunks;
}
// #endregion module
