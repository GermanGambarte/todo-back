import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

import { compare, generateToken, hash } from '../utils'

const prisma = new PrismaClient()

const getAllUsers = async (_req: Request, res: Response) => {
	const allUsers = await prisma.user.findMany()

	res.json({ status: 200, error: null, response: allUsers })
}

const register = async (req: Request, res: Response) => {
	const { email, username } = req.body
	let { password } = req.body

	try {
		const userCheck = await prisma.user.findFirst({
			where: { email }
		})

		if (userCheck !== null) {
			return res.json({ status: 302, error: 'User is found with that email' })
		}
		password = await hash(password)
		try {
			const user = await prisma.user.create({
				data: {
					username,
					email,
					password
				}
			})

			return res.json({ status: 200, error: null, response: user.id })
		} catch (error) {
			return res.json({ status: 500, in: 'Create user', error })
		}
	} catch (error) {
		return res.json({ status: 500, in: 'User check', error })
	}
}
const login = async (req: Request, res: Response) => {
	const { username, password } = req.body
	const user = await prisma.user.findUnique({
		where: { username }
	})

	if (!user) {
		return res.json({
			status: 400,
			in: 'user exist cheking',
			error: 'invalid credentials'
		})
	}
	const valid = await compare(password, user!.password)

	if (!valid) {
		return res.json({
			status: 400,
			in: 'user exist cheking',
			error: 'invalid credentials'
		})
	}
	const token = generateToken(user.id)

	res.cookie('token', token, {
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		httpOnly: true
	})

	return res.json({ status: 200, error: null, response: { token } })
}

export { getAllUsers, register, login }
