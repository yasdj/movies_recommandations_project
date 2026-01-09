import { Router, Request, Response } from "express";
import {
  getLaterMovies,
  getWatchedMovies,
} from "../service/movie";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/:id/watched", async (req: Request, res: Response) => {
  try {
    const movies = await getWatchedMovies(req.params.id);
    res.status(StatusCodes.OK).json(movies);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.NOT_FOUND).json({ error: "Movies not found" });
  }
});

router.get("/:id/later", async (req: Request, res: Response) => {
  try {
    const movies = await getLaterMovies(req.params.id);
    res.status(StatusCodes.OK).json(movies);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.NOT_FOUND).json({ error: "Movies not found" });
  }
});

export default router;
