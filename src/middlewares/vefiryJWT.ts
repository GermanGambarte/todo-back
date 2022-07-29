import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { NextFunction, Response } from 'express'

import { customRequest, JwtPayload } from '../types'

export const verifyJWT = (
	req: customRequest,
	res: Response,
	next: NextFunction
) => {
	const authorization = req.get('authorization')
	const startsWhithBearer = authorization
		?.toLocaleLowerCase()
		.startsWith('bearer')

	if (!authorization || !startsWhithBearer) {
		return res
			.status(401)
			.json({ status: 401, error: 'missing or invalid authorization' })
	}
	const token = authorization.substring(7)

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
		if (err) {
			return res
				.status(403)
				.json({ status: 403, error: 'missing or invalid token' })
		}
		req.userId = (<JwtPayload>decoded).id

		return next()
	})
}
