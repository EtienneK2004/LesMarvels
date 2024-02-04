const publicKey = pm.collectionVariables.get('publicKey');
const privateKey = pm.collectionVariables.get('privateKey');
const ts = new Date().getTime().toString();

const hash = CryptoJS.MD5(""+ ts + privateKey + publicKey).toString();

pm.request.url.addQueryParams([
    { key: 'apikey', value: publicKey },
    { key: 'ts', value: ts },
    { key: 'hash', value: hash }
]);