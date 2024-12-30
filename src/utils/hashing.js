import bcrypt from 'bcrypt'

class krypto {
    encrypt(password) {
        try {
            return bcrypt.hashSync(password, 10);
        }
        catch (err) {
            return err;
        }
    }
    decrypt(password, hashedPassword) {
        try {
            return bcrypt.compareSync(password, hashedPassword);
        }
        catch (err) {
            return err;
        }
    }
}

const kryptoService = new krypto();
export default kryptoService;