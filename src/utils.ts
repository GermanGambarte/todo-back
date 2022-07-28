import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const hash = async (password: string) => {
	const salt = await bcrypt.genSalt(10)

	return await bcrypt.hash(password, salt)
}

const compare = (unhashedPass: string, hashedPass: string) => {
	return bcrypt.compare(unhashedPass, hashedPass)
}

const generateToken = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_PASS!, { expiresIn: '7d' })
}

export { hash, compare, generateToken }
