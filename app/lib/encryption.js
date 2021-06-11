const crypto = require('crypto')

const algorithm = 'aes-256-ctr'

module.exports = {
    /**
     * TODO: `crypto.createCipher()` is stupid deprecated, but I don't use any of this so I'm
     * not spending any time fixing it. It'll eventually need to be replaced with
     * `crype.createCipheriv()`:
     *
     * https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options
     *
     * I tried to quickly swap it out but stopped when I couldn't figure out of the `iv` argument
     * needs to be persisted for something encrypted with it to be decrypted (I suspect it does,
     * and if that's the case I don't want to engineer a solution for that right now)
     */
    encrypt(readableStream, password) {
        const cipher = crypto.createCipher(algorithm, password)
        return readableStream.pipe(cipher)
    },
    decrypt(readableStream, password) {
        const decipher = crypto.createDecipher(algorithm, password)
        return readableStream.pipe(decipher)
    }
}
