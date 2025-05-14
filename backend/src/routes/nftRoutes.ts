import express, { Request, Response, Router } from 'express';
import { NFT } from '../models/nftModel'; // Adjust path to your NFT model

const router: Router = express.Router();

// Get NFT by ID
const getNFTById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const nft = await NFT.findById(id);
    if (!nft) {
      res.status(404).json({ message: 'NFT not found' });
      return;
    }
    res.json(nft);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Other routes (e.g., mintNFT) can follow the same pattern
const mintNFT = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body; // Adjust fields as needed
    const newNFT = new NFT({ name, description, owner: 'someAddress' }); // Example
    await newNFT.save();
    res.status(201).json(newNFT);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

router.get('/:id', getNFTById);
router.post('/mint', mintNFT);

export default router;