import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const hash = async (password: string) => {
	const salt = await bcrypt.genSalt(10)

	return await bcrypt.hash(password, salt)
}

const compare = (hashedPass: string, unhasedPass: string) => {
	return bcrypt.compare(hashedPass, unhasedPass)
}

const generateToken = (id: string) => {
	return jwt.sign(id, process.env.JWT_PASS!, {
		expiresIn: process.env.JWT_EXPIRES!
	})
}

export { hash, compare, generateToken }
