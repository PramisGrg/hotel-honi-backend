import { Request, Response } from "express";

export async function NotFoundController(req: Request, res: Response) {
    return res.status(404).json({ message: "Sorry, the requested content was not found in the server." })
}