import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

const products = [
  {
    id: "1",
    name: "Classic Hummus",
    description: "Silky smooth, hand-blended chickpea hummus with tahini and lemon.",
    price: 9.00,
    image: "/images/hummus-classic.png"
  },
  {
    id: "2",
    name: "Roasted Red Pepper Hummus",
    description: "Vibrant and smoky with fire-roasted peppers.",
    price: 10.00,
    image: "/images/hummus-red-pepper.png"
  },
  {
    id: "3",
    name: "Baba Ganoush",
    description: "Charred eggplant with pomegranate molasses and herbs.",
    price: 10.00,
    image: "/images/baba-ganoush.png"
  },
  {
    id: "4",
    name: "Tzatziki",
    description: "Creamy Greek yogurt with cucumber, garlic, and fresh dill.",
    price: 9.00,
    image: "/images/tzatziki.png"
  },
  {
    id: "5",
    name: "Muhammara",
    description: "Roasted red pepper and walnut spread with a smoky kick.",
    price: 10.00,
    image: "/images/muhammara.png"
  },
  {
    id: "6",
    name: "Labneh",
    description: "Velvety Lebanese cream cheese drizzled with olive oil.",
    price: 9.00,
    image: "/images/labneh.png"
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
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-medium text-foreground pr-4 leading-tight">{product.name}</h3>
                <span className="font-medium text-primary">${product.price.toFixed(2)}</span>
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
