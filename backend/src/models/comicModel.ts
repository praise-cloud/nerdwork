import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IComic {
  comicId: string;
  title: string;
  chapters: number;
  image: string;
  isNew: boolean;
  genreType: string;
  createdAt: Date;
}

const comicSchema = new Schema<IComic>({
  comicId: {type: String, required: true,unique: true, default: uuidv4},
  title: { type: String, required: true },
  chapters: { type: Number, required: true },
  image: { type: String, required: true },
  isNew: { type: Boolean, default: false },
  genreType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Comic = model<IComic>('Comic', comicSchema);