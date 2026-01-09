import { Router, Request, Response, NextFunction } from "express";
import {
  addLaterMovie,
  addWatchedMovie,
  connectUser,
  createUser,
  getUser,
  removeLaterMovie,
  removeWatchedMovie,
  updateUser,
} from "../service/user";
import { getWatchedMovies, getLaterMovies } from "../service/movie";
import { StatusCodes } from "http-status-codes";
import { UserDto } from "../models/dto/user-dto";
import { addMovie } from "../service/movie";
import jwt from "jsonwebtoken";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

function requireSelf(req: AuthRequest, res: Response, next: NextFunction) {
  const paramId = String(req.params.id);
  const authId = String(req.userId);

  if (!authId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Not authenticated" });
  }

  if (paramId !== authId) {
    return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden" });
  }

  next();
}

router.get(
  "/:id",
  requireAuth,
  requireSelf,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await getUser(req.params.id);
      res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
  }
);

router.patch("/:id", requireAuth, requireSelf, async (req, res) => {
  const { newUsername, newEmail, newPassword } = req.body;

  const updates: Record<string, unknown> = {};
  if (newUsername != null) updates.username = newUsername;
  if (newEmail != null) updates.email = newEmail;
  if (newPassword != null) updates.password = newPassword;

  const user = await updateUser(req.params.id, updates);
  res.json({ user });
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await createUser(new UserDto(username, email, password));
    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await connectUser(username, password);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Login failed" });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ message: "Logged out" });
});

router.post(
  "/:id/watched",
  requireAuth,
  requireSelf,
  async (req: AuthRequest, res: Response) => {
    try {
      const { movieId, title, releaseDate, posterPath } = req.body;

      await addWatchedMovie(req.params.id, movieId);

      if (title && releaseDate && posterPath) {
        await addMovie(movieId, title, releaseDate, posterPath);
      }

      res.status(StatusCodes.OK).json();
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND).json({ error: "Movie not found" });
    }
  }
);

router.delete(
  "/:id/:movieId/watched",
  requireAuth,
  requireSelf,
  async (req: AuthRequest, res: Response) => {
    try {
      await removeWatchedMovie(req.params.id, req.params.movieId);
      res.status(StatusCodes.OK).json();
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND).json({ error: "Movie not found" });
    }
  }
);

router.get(
  "/:id/watched",
  requireAuth,
  requireSelf,
  async (req: AuthRequest, res: Response) => {
    try {
      const movies = await getWatchedMovies(req.params.id);
      res.status(StatusCodes.OK).json(movies);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND).json({ error: "Movies not found" });
    }
  }
);

router.post(
  "/:id/later",
  requireAuth,
  requireSelf,
  async (req: AuthRequest, res: Response) => {
    try {
      const { movieId, title, releaseDate, posterPath } = req.body;

      await addLaterMovie(req.params.id, movieId);

      if (title && releaseDate && posterPath) {
        await addMovie(movieId, title, releaseDate, posterPath);
      }

      res.status(StatusCodes.OK).json();
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND).json({ error: "Movies not found" });
    }
  }
);

router.get(
  "/:id/later",
  requireAuth,
  requireSelf,
  async (req: AuthRequest, res: Response) => {
    try {
      const movies = await getLaterMovies(req.params.id);
      res.status(StatusCodes.OK).json(movies);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND).json({ error: "Movies not found" });
    }
  }
);

router.delete(
  "/:id/:movieId/later",
  requireAuth,
  requireSelf,
  async (req: AuthRequest, res: Response) => {
    try {
      await removeLaterMovie(req.params.id, req.params.movieId);
      res.status(StatusCodes.OK).json();
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND).json({ error: "Movie not found" });
    }
  }
);

export default router;
