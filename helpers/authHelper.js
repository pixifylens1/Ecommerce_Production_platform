import bcrypt from 'bcrypt'

export const hashPassword = async (pass) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        return hashedPassword;

    } catch (error) {
        console.log(error)
    }

}

export const comparePassword = async (password, hashedPassword) => {

    return bcrypt.compare(password, hashedPassword);

}