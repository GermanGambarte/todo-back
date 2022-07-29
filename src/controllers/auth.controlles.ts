import { NextFunction, Request, Response } from 'express'
import { PrismaClient, User } from '@prisma/client'
import jwt from 'jsonwebtoken'

import {
	compare,
	generateRefreshToken,
	generateAccessToken,
	hash
} from '../utils'
import { customRequest, JwtPayload } from '../types'
const prisma = new PrismaClient()

const register = async (req: Request, res: Response) => {
	const { email, username } = req.body
	let { password } = req.body

	if (!email || !username || !password) {
		return res
			.status(400)
			.json({ status: 400, error: 'email,username and password are required' })
	}
	try {
		const userCheck = await prisma.user.findFirst({
			where: { email }
		})

		if (userCheck !== null) {
			return res
				.status(409)
				.json({ status: 409, error: 'The user already exist' })
		}
		password = await hash(password)
		try {
			await prisma.user.create({
				data: {
					username,
					email,
					password
				}
			})

			return res.status(201).json({
				status: 201,
				error: null,
				response: { message: 'user registered' }
			})
		} catch (err) {
			return res.status(500).json({ status: 500, error: 'unexpected error' })
		}
	} catch (error) {
		return res.status(500).json({ status: 500, error: 'unexpected error' })
	}
}

const login = async (req: Request, res: Response) => {
	const { username, password } = req.body

	if (!username || !password) {
		return res
			.status(400)
			.json({ status: 400, error: 'email,username and password are required' })
	}
	const user = (await prisma.user.findUnique({
		where: { username }
	})) as User

	if (!user) {
		return res.status(401).json({ status: 401, error: 'unauthorized' })
	}
	const valid = await compare(password, user!.password)

	if (!valid) {
		return res.json({
			status: 400,
			in: 'user exist cheking',
			error: 'invalid credentials'
		})
	}
	const accessToken = generateAccessToken(user.id)
	const refreshToken = generateRefreshToken(user.id)

	user.refreshToken = refreshToken

	res.cookie('token', accessToken, {
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		httpOnly: true
	})

	return res.json({ status: 200, error: null, response: { accessToken } })
}

const refresh = async (
	req: customRequest,
	res: Response,
	next: NextFunction
) => {
	const cookies = req.cookies

	if (!cookies?.token) {
		return res.status(401).json({ status: 401, error: 'user unauthorized' })
	}
	const refreshToken = cookies.token as string
	const user = await prisma.user.findUnique({
		where: { refreshToken }
	})

	if (!user) return res.status(403).json({ status: 403, error: 'Forbidden' })

	jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
		const id = (<JwtPayload>decoded).id

		if (err || user.id !== id) {
			return res
				.status(403)
				.json({ status: 403, error: 'missing or invalid token' })
		}
		const accessToken = generateAccessToken(id)

		res.json({ accessToken })
	})

	return next()
}

export { register, login, refresh }
