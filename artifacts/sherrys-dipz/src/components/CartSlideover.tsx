import React from 'react';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CartSlideover() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setIsCartOpen(false);
    setLocation('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Order
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
              <p className="font-serif text-xl text-foreground mb-2">Your cart is empty</p>
              <p className="text-sm">Looks like you haven't added any dips yet.</p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setIsCartOpen(false)}
                data-testid="button-continue-shopping"
              >
                Continue Browsing
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4" data-testid={`cart-item-${item.productId}`}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          data-testid={`button-remove-${item.productId}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border rounded-md h-8">
                          <button
                            className="px-2 h-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            data-testid={`button-decrement-${item.productId}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium" data-testid={`text-quantity-${item.productId}`}>
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 h-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            data-testid={`button-increment-${item.productId}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium ml-auto">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-card border-t mt-auto">
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full text-lg h-12 font-serif" 
              onClick={handleCheckout}
              data-testid="button-checkout"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
