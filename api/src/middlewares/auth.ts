import { Request, Response, NextFunction } from 'express';

export function verifySecret(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['mega-senha'];

  if (!apiKey || apiKey !== process.env.SECRET) {
    return res.status(401).json({ erro: "Acesso negado: Terminal não autorizado." });
  }

  next();
}