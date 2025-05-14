import { Request, Response } from 'express';
    import { NFT } from '../models/nftModel';

    export const getNFTById = async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const nft = await NFT.findOne({ nftId: parseInt(id) });
        if (!nft) return res.status(404).json({ error: 'NFT not found' });
        res.json(nft);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    };

    export const getActivity = async (req: Request, res: Response) => {
      const activity = [
        { id: 1, action: 'Minted', user: '0xD4AF...', comicTitle: 'Celestial Eyes', time: '2 hours ago' },
        { id: 2, action: 'Listed', user: '0xD4AF...', comicTitle: 'Celestial Eyes', time: '2 hours ago' },
      ];
      res.json(activity);
    };

    export const mintNFT = async (req: Request, res: Response) => {
      const { comicId, userId } = req.body;
      try {
        const nft = await NFT.findOne({ nftId: parseInt(comicId) });
        if (!nft) return res.status(404).json({ error: 'NFT not found' });
        nft.totalMinted = (nft.totalMinted || 0) + 1;
        await nft.save();
        res.json({ message: 'NFT minted successfully', nft });
      } catch (error) {
        res.status(500).json({ error: 'Minting failed' });
      }
    };