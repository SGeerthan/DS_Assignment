import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    owner: {                     // NEW – which restaurant owner added it
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name:        { type: String,  required: true },
    description: { type: String },
    price:       { type: Number,  required: true },
    image:       { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Food', foodSchema);
