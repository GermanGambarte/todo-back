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

const generateAccessToken = (id: string) => {
	return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: '30s'
	})
}

const generateRefreshToken = (id: string) => {
	return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!)
}

export { hash, compare, generateAccessToken, generateRefreshToken }
