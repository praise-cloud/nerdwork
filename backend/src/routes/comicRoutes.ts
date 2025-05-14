import express, { Request, Response, Router } from 'express';
import { Comic } from '../models/comicModel'; // Adjust path

const router: Router = express.Router();

const getComics = async (req: Request, res: Response): Promise<void> => {
  try {
    const comics = await Comic.find();
    res.json(comics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

router.get('/', getComics);

export default router;