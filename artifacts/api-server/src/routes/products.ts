import { Router, type IRouter } from "express";
import { ListProductsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const PRODUCTS = [
  {
    id: "labneh",
    name: "Labneh",
    description: "Silky strained yogurt cheese, tangy and rich, drizzled with extra-virgin olive oil. A Lebanese staple.",
    price: 12.0,
    emoji: "🫙",
  },
  {
    id: "hummus",
    name: "Hummus",
    description: "Classic Lebanese hummus made with hand-picked chickpeas, fresh lemon juice, and premium tahini.",
    price: 12.0,
    emoji: "🫙",
  },
  {
    id: "olive-dip",
    name: "Olive Dip",
    description: "A savory, herb-laced blend of marinated olives and roasted garlic. Bold, briny, and irresistible.",
    price: 10.0,
    emoji: "🫙",
  },
  {
    id: "matbucha",
    name: "Matbucha",
    description: "Slow-cooked Moroccan tomato and roasted pepper spread. Deeply smoky, subtly spiced.",
    price: 12.0,
    emoji: "🫙",
  },
  {
    id: "tahini",
    name: "Tahini",
    description: "Pure ground sesame paste, nutty and velvety smooth. Made from the finest toasted sesame seeds.",
    price: 10.0,
    emoji: "🫙",
  },
  {
    id: "turkish-eggplant",
    name: "Turkish Eggplant",
    description: "Fire-roasted eggplant slow-cooked with tomatoes and peppers in the Ottoman tradition.",
    price: 15.0,
    emoji: "🫙",
  },
];

router.get("/products", async (_req, res): Promise<void> => {
  res.json(ListProductsResponse.parse(PRODUCTS));
});

export { PRODUCTS };
export default router;
