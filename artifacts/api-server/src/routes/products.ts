import { Router, type IRouter } from "express";
import { ListProductsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const PRODUCTS = [
  {
    id: "classic-hummus",
    name: "Classic Hummus",
    description: "Silky smooth, hand-blended chickpea hummus with tahini and lemon.",
    price: 9.0,
    emoji: "🫙",
  },
  {
    id: "roasted-red-pepper-hummus",
    name: "Roasted Red Pepper Hummus",
    description: "Vibrant and smoky with fire-roasted peppers.",
    price: 10.0,
    emoji: "🫙",
  },
  {
    id: "baba-ganoush",
    name: "Baba Ganoush",
    description: "Charred eggplant with pomegranate molasses and herbs.",
    price: 10.0,
    emoji: "🫙",
  },
  {
    id: "tzatziki",
    name: "Tzatziki",
    description: "Creamy Greek yogurt with cucumber, garlic, and fresh dill.",
    price: 9.0,
    emoji: "🫙",
  },
  {
    id: "muhammara",
    name: "Muhammara",
    description: "Roasted red pepper and walnut spread with a smoky kick.",
    price: 10.0,
    emoji: "🫙",
  },
  {
    id: "labneh",
    name: "Labneh",
    description: "Velvety Lebanese cream cheese drizzled with olive oil.",
    price: 9.0,
    emoji: "🫙",
  },
];

router.get("/products", async (_req, res): Promise<void> => {
  res.json(ListProductsResponse.parse(PRODUCTS));
});

export { PRODUCTS };
export default router;
