import React from 'react';
import { useCart } from '@/context/CartContext';
import { Minus, Plus } from 'lucide-react';

const products = [
  {
    id: "labneh",
    name: "Labneh",
    description: "Silky strained yogurt cheese made fresh to order — tangy, rich, and preservative free. Finished with a drizzle of extra-virgin olive oil.",
    price: 12.00,
    image: "/images/dips/labneh.jpg"
  },
  {
    id: "hummus",
    name: "Hummus",
    description: "Handcrafted Middle Eastern hummus with hand-picked chickpeas, fresh lemon juice, and premium tahini. No fillers, no preservatives — just the real thing.",
    price: 12.00,
    image: "/images/dips/hummus.jpg"
  },
  {
    id: "olive-dip",
    name: "Olive Dip",
    description: "A bold, herb-laced blend of marinated olives and roasted garlic. Hand-prepared in small batches, gluten free, and free from artificial additives.",
    price: 10.00,
    image: "/images/dips/olive-dip.jpg"
  },
  {
    id: "matbucha",
    name: "Matbucha",
    description: "Slow-cooked Moroccan tomato and roasted pepper spread. Made to order with whole ingredients — deeply smoky and preservative free.",
    price: 12.00,
    image: "/images/dips/matbucha.jpg"
  },
  {
    id: "tahini",
    name: "Tahini",
    description: "Pure ground sesame paste — nothing added, nothing removed. Handcrafted in small batches from the finest toasted sesame seeds. Gluten free.",
    price: 10.00,
    image: "/images/dips/tahini.jpg"
  },
  {
    id: "turkish-eggplant",
    name: "Turkish Eggplant",
    description: "Fire-roasted eggplant slow-cooked with tomatoes and peppers. Made to order, preservative free, and bursting with authentic Ottoman flavour.",
    price: 15.00,
    image: "/images/dips/turkish-eggplant.jpg"
  }
];

export function ProductGrid() {
  const { addItem, items, updateQuantity } = useCart();

  const getQuantity = (productId: string) => {
    return items.find(item => item.productId === productId)?.quantity || 0;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-6xl mx-auto px-4 sm:px-6">
      {products.map((product) => {
        const quantity = getQuantity(product.id);

        return (
          <article
            key={product.id}
            className="group flex flex-col"
            data-testid={`card-product-${product.id}`}
          >
            <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-muted">
              <img
                src={product.image}
                alt={`${product.name} in a Sherry's Dipz container`}
                loading="lazy"
                width={900}
                height={672}
                className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700"
              />
            </div>

            <div className="pt-5 flex flex-col flex-1">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h3 className="text-2xl font-serif font-semibold text-foreground leading-tight">{product.name}</h3>
                <span className="font-serif text-xl text-secondary whitespace-nowrap">${Number.isInteger(product.price) ? product.price : product.price.toFixed(2)}</span>
              </div>

              <p className="text-muted-foreground leading-relaxed flex-1 mb-5">{product.description}</p>

              {quantity > 0 ? (
                <div className="flex items-center justify-between h-12 rounded-full bg-primary/10 border border-primary/30 px-1.5">
                  <button
                    className="h-9 w-9 flex items-center justify-center rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    aria-label={`Remove one ${product.name}`}
                    data-testid={`button-card-decrement-${product.id}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-primary" data-testid={`text-card-quantity-${product.id}`}>
                    {quantity} in your order
                  </span>
                  <button
                    className="h-9 w-9 flex items-center justify-center rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    aria-label={`Add one more ${product.name}`}
                    data-testid={`button-card-increment-${product.id}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="h-12 w-full rounded-full border border-foreground/20 font-medium flex items-center justify-center gap-2 hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
                  onClick={() => addItem({ productId: product.id, name: product.name, price: product.price })}
                  data-testid={`button-add-${product.id}`}
                >
                  <Plus className="h-4 w-4" />
                  Add to order
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
