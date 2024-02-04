import crypto from 'crypto';
import fetch from 'node-fetch';

const PUBLIC_KEY="4522b0d1398c1f774f0fccbb056bfc4e"
const PRIVATE_KEY="877c848450ca4fd299efda6388c6b15eca8cb454"

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    const ts = new Date().getTime().toString();
    const hash = await getHash(PUBLIC_KEY, PRIVATE_KEY, ts);

    const noParams = url.indexOf('?') === -1;
    const debutParam = noParams ? '?' : '&';

    url = url + debutParam + 'ts=' + ts + '&apikey=' + PUBLIC_KEY + '&hash=' + hash;

    const res = await fetch(url).then((res) => res.json());
    const triThumbnailValid = res.data.results.filter((char) => {
        return char.thumbnail.path.indexOf('image_not_available') === -1;
    });
    const ajoutImageUrl = triThumbnailValid.map((char) => {
        char.imageUrl = char.thumbnail.path + '.' + char.thumbnail.extension;
        return char;
    });
    return ajoutImageUrl;
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    return crypto.createHash('md5').update(""+ timestamp + privateKey + publicKey).digest('hex').toString();
}