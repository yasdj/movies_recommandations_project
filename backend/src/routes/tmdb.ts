import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  const query = String(req.query.query ?? "").trim();
  if (!query) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing query" });
  }

  const key = process.env.TMDB_API_KEY;
  if (!key) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "TMDB_API_KEY not configured" });
  }

  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(
        query
      )}`
    );

    const data = await r.json();
    return res.status(StatusCodes.OK).json(data);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "TMDB request failed" });
  }
});

export default router;
