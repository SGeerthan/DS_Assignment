import Food from '../models/foodModel.js';
import { imageUploadUnit } from '../helper/cloudinarySetUp.js';

/* ---------- add dish ---------- */
export const addFood = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Name & price required' });

    /* optional image upload */
    let imgURL = '';
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const url = `data:${req.file.mimetype};base64,${b64}`;
      const out = await imageUploadUnit(url);
      imgURL = out.secure_url;
    }

    const food = await Food.create({
      owner: req.user.id,
      name,
      description,
      price,
      image: imgURL
    });

    res.status(201).json(food);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Add food failed' });
  }
};

/* ---------- get all dishes for current owner ---------- */
export const myFoods = async (req, res) => {
    const foods = await Food.find({ owner: req.user.id }).sort({ createdAt:-1 });
  res.json(foods);
};

/* ---------- update dish ---------- */
export const updateFood = async (req, res) => {
  const food = await Food.findOne({ _id: req.params.id, owner: req.user.id });
  if (!food) return res.status(404).json({ message: 'Not found' });

  const { name, description, price } = req.body;
  if (name)  food.name  = name;
  if (description) food.description = description;
  if (price) food.price = price;

  /* replace image if new file sent */
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const out = await imageUploadUnit(url);
    food.image = out.secure_url;
  }

  await food.save();
  res.json(food);
};

/* ---------- delete dish ---------- */
export const deleteFood = async (req, res) => {
  const food = await Food.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!food) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};
