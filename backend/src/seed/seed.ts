import mongoose from 'mongoose';
    import { NFT } from '../models/nftModel';
    import dotenv from 'dotenv';

    dotenv.config();

    async function seed() {
      try {
        await mongoose.connect(process.env.MONGODB_URI!);
        await NFT.deleteMany();

        const nfts = [
          {
            nftId: 4,
            image: 'https://ipfs.io/ipfs/QmExample4',
            isRecentlyAdded: false,
            creator: 'Chidi Okoye',
            rarity: 'ULTRA_RARE',
            volume: 100,
            totalMinted: 50,
            totalSupply: 100,
            title: 'Celestial Eyes',
            chapters: 5
          }
        ];

        await NFT.insertMany(nfts);
        console.log('Database seeded');
      } catch (error) {
        console.error('Seeding error:', error);
      } finally {
        await mongoose.disconnect();
      }
    }

    seed();