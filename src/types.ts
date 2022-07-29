import { Request } from 'express'

export interface customRequest extends Request {
	userId?: string
}

export interface JwtPayload {
	id: string
}
