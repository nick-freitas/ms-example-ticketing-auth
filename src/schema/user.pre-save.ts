import * as bcrypt from 'bcrypt';

export const userPreSave = async function (done) {
    this.isModified('password'){
        const hashed = await bcrypt.hash(this.get('password'), 12);
        this.set('password', hashed);
    }

    done();
}