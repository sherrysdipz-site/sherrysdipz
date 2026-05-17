import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import dipPhoto from '@assets/53BA409D-8089-4D04-899D-20C277B9E873_4_5005_c_1778994899377.jpeg';

const products = [
  {
    id: "labneh",
    name: "Labneh",
    description: "Silky strained yogurt cheese made fresh to order — tangy, rich, and preservative free. Finished with a drizzle of extra-virgin olive oil.",
    price: 12.00,
    image: dipPhoto
  },
  {
    id: "hummus",
    name: "Hummus",
    description: "Handcrafted Lebanese hummus with hand-picked chickpeas, fresh lemon juice, and premium tahini. No fillers, no preservatives — just the real thing.",
    price: 12.00,
    image: dipPhoto
  },
  {
    id: "olive-dip",
    name: "Olive Dip",
    description: "A bold, herb-laced blend of marinated olives and roasted garlic. Hand-prepared in small batches, gluten free, and free from artificial additives.",
    price: 10.00,
    image: dipPhoto
  },
  {
    id: "matbucha",
    name: "Matbucha",
    description: "Slow-cooked Moroccan tomato and roasted pepper spread. Made to order with whole ingredients — deeply smoky and preservative free.",
    price: 12.00,
    image: dipPhoto
  },
  {
    id: "tahini",
    name: "Tahini",
    description: "Pure ground sesame paste — nothing added, nothing removed. Handcrafted in small batches from the finest toasted sesame seeds. Gluten free.",
    price: 10.00,
    image: dipPhoto
  },
  {
    id: "turkish-eggplant",
    name: "Turkish Eggplant",
    description: "Fire-roasted eggplant slow-cooked with tomatoes and peppers. Made to order, preservative free, and bursting with authentic Ottoman flavour.",
    price: 15.00,
    image: dipPhoto
  }
];

export function ProductGrid() {
  const { addItem, items, updateQuantity } = useCart();

  const getQuantity = (productId: string) => {
    return items.find(item => item.productId === productId)?.quantity || 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 md:p-12 max-w-7xl mx-auto">
      {products.map((product) => {
        const quantity = getQuantity(product.id);
        
        return (
          <div 
            key={product.id} 
            className="group flex flex-col bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
            data-testid={`card-product-${product.id}`}
          >
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img 
                src={product.image} 
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                  GF · No Preservatives
                </span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-medium text-foreground pr-4 leading-tight">{product.name}</h3>
                <span className="font-medium text-primary whitespace-nowrap">${product.price.toFixed(2)}</span>
              </div>
              
              <p className="text-muted-foreground text-sm flex-1 mb-6">{product.description}</p>
              
              {quantity > 0 ? (
                <div className="flex items-center justify-between bg-accent rounded-lg p-1 border">
                  <button
                    className="p-2 text-foreground hover:bg-background rounded-md transition-colors"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    data-testid={`button-card-decrement-${product.id}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium px-4" data-testid={`text-card-quantity-${product.id}`}>
                    {quantity} in cart
                  </span>
                  <button
                    className="p-2 text-foreground hover:bg-background rounded-md transition-colors"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    data-testid={`button-card-increment-${product.id}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Button 
                  className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                  variant="outline"
                  onClick={() => addItem({ productId: product.id, name: product.name, price: product.price })}
                  data-testid={`button-add-${product.id}`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Order
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
