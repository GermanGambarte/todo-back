import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

const getAllUsers = async (_req: Request, res: Response) => {
	const allUsers = await prisma.user.findMany()

	res.json({ status: 200, error: null, response: allUsers })
}

export { getAllUsers }
