import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronLeft, Loader2, Store, Truck, Banknote, CreditCard } from 'lucide-react';
import { useCreateOrder } from '@workspace/api-client-react';

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  fulfillmentType: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.string().optional().nullable(),
  paymentMethod: z.enum(['cash', 'etransfer']),
  notes: z.string().optional().nullable()
}).superRefine((data, ctx) => {
  if (data.fulfillmentType === 'delivery' && (!data.deliveryAddress || data.deliveryAddress.length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Delivery address is required for delivery",
      path: ['deliveryAddress']
    });
  }
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const createOrder = useCreateOrder();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      fulfillmentType: 'pickup',
      deliveryAddress: '',
      paymentMethod: 'etransfer',
      notes: ''
    }
  });

  const watchFulfillment = form.watch('fulfillmentType');

  useEffect(() => {
    // Redirect back to home if cart is empty
    if (items.length === 0) {
      setLocation('/');
    }
  }, [items.length, setLocation]);

  const onSubmit = (data: CheckoutFormValues) => {
    const orderItems = items.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    createOrder.mutate({
      data: {
        ...data,
        items: orderItems,
        deliveryAddress: data.fulfillmentType === 'pickup' ? null : data.deliveryAddress,
      }
    }, {
      onSuccess: (confirmation) => {
        clearCart();
        setLocation('/thank-you', { 
          state: { 
            confirmation, 
            paymentMethod: data.paymentMethod,
            customerName: data.customerName
          } 
        });
      }
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Menu
          </Link>
          <div className="mx-auto font-serif text-xl font-bold text-primary absolute left-1/2 -translate-x-1/2">
            Checkout
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">Order Details</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jane@example.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Fulfillment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Fulfillment Method</h3>
                  <FormField
                    control={form.control}
                    name="fulfillmentType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                            data-testid="radio-fulfillment"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="pickup" className="sr-only" data-testid="radio-pickup" />
                                </FormControl>
                                <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                                  <Store className="h-6 w-6" />
                                  <span className="font-medium">Pick up</span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="delivery" className="sr-only" data-testid="radio-delivery" />
                                </FormControl>
                                <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                                  <Truck className="h-6 w-6" />
                                  <span className="font-medium">Delivery</span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchFulfillment === 'delivery' && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <FormField
                        control={form.control}
                        name="deliveryAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="123 Main St, Apartment 4B..." 
                                className="resize-none"
                                {...field} 
                                value={field.value || ''}
                                data-testid="input-address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Payment Method</h3>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                            data-testid="radio-payment"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="etransfer" className="sr-only" data-testid="radio-etransfer" />
                                </FormControl>
                                <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors text-center">
                                  <CreditCard className="h-6 w-6" />
                                  <span className="font-medium">e-Transfer</span>
                                  <span className="text-xs text-muted-foreground">Pay after confirming</span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="cash" className="sr-only" data-testid="radio-cash" />
                                </FormControl>
                                <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors text-center">
                                  <Banknote className="h-6 w-6" />
                                  <span className="font-medium">Cash</span>
                                  <span className="text-xs text-muted-foreground">Pay on receipt</span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Additional Notes</h3>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special requests or delivery instructions?" 
                            className="resize-none"
                            {...field} 
                            value={field.value || ''}
                            data-testid="input-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 lg:hidden">
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-serif" 
                    disabled={createOrder.isPending}
                    data-testid="button-submit-order-mobile"
                  >
                    {createOrder.isPending ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                      `Place Order • $${subtotal.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm sticky top-24">
            <h3 className="font-serif text-xl font-bold mb-6 text-foreground">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <div className="flex gap-3">
                    <span className="font-medium text-muted-foreground">{item.quantity}x</span>
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-serif text-xl font-bold text-foreground pt-2">
                <span>Total</span>
                <span data-testid="text-total">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg font-serif mt-8 hidden lg:flex" 
              onClick={form.handleSubmit(onSubmit)}
              disabled={createOrder.isPending}
              data-testid="button-submit-order"
            >
              {createOrder.isPending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                `Place Order`
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              By placing your order, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
