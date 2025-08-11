import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.['token']
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret') as { userId: string }
    // Attach to request (without global type augmentation)
    ;(req as any).userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
}


