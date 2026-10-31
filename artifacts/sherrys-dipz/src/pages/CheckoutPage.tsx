import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronLeft, Loader2, Banknote, CreditCard, Calendar, Clock, ShoppingBag } from 'lucide-react';
import { useCreateOrder } from '@workspace/api-client-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TIME_SLOTS = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

function getAvailablePickupDates(): { label: string; value: string }[] {
  const results: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 2; i <= 30 && results.length < 8; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow === 4 || dow === 5 || dow === 6) {
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dow];
      const label = `${dayName}, ${d.toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })}`;
      const value = d.toISOString().split('T')[0];
      results.push({ label, value });
    }
  }
  return results;
}

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  paymentMethod: z.enum(['cash', 'etransfer']),
  notes: z.string().optional().nullable(),
  pickupDate: z.string().min(1, "Please select a pickup date"),
  pickupTime: z.string().min(1, "Please select a pickup time"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart, setIsCartOpen } = useCart();
  const [, setLocation] = useLocation();
  const createOrder = useCreateOrder();
  const availableDates = useMemo(() => getAvailablePickupDates(), []);
  const orderSubmitted = useRef(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      paymentMethod: 'etransfer',
      notes: '',
      pickupDate: '',
      pickupTime: '',
    }
  });

  const watchPickupDate = form.watch('pickupDate');

  useEffect(() => {
    if (items.length === 0 && !orderSubmitted.current) setLocation('/');
  }, [items.length, setLocation]);

  const onSubmit = (data: CheckoutFormValues) => {
    setSubmissionError(null);
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
        fulfillmentType: 'pickup',
        deliveryAddress: null,
      }
    }, {
      onSuccess: (confirmation) => {
        orderSubmitted.current = true;
        clearCart();
        setLocation('/thank-you', {
          state: {
            confirmation,
            paymentMethod: data.paymentMethod,
            customerName: data.customerName,
            pickupDate: data.pickupDate,
            pickupTime: data.pickupTime,
          }
        });
      },
      onError: (err: unknown) => {
        const isConnectionError =
          err instanceof TypeError ||
          (err instanceof Error && /failed to fetch|network|load failed/i.test(err.message));
        const message = isConnectionError
          ? "We couldn't reach the order service. Your cart is saved on this device; check your connection and try again in a moment. If you already saw an order confirmation, don't submit a second time."
          : err instanceof Error
            ? err.message.replace(/^HTTP \d+[^:]*: /, '')
            : "Please check your details and try again.";
        setSubmissionError(message);
      }
    });
  };

  const handleAddMore = () => {
    setIsCartOpen(false);
    setLocation('/');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between relative">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground font-medium px-2 sm:px-3"
            onClick={handleAddMore}
            data-testid="button-checkout-add-more"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Add more dips</span>
            <span className="sm:hidden">Menu</span>
          </Button>
          <div className="font-serif text-lg sm:text-xl font-bold text-primary absolute left-1/2 -translate-x-1/2 pointer-events-none">
            Checkout
          </div>
          <Button
            variant="outline"
            size="sm"
            className="relative px-3"
            onClick={() => setIsCartOpen(true)}
            aria-label={"Open cart with " + totalItems + " items"}
            data-testid="button-checkout-open-cart"
          >
            <ShoppingBag className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Cart</span>
            <span className="ml-2 tabular-nums">{totalItems}</span>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-36 lg:pb-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">Order Details</h2>
            {submissionError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Order not confirmed</AlertTitle>
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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

                {/* Pickup Date & Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Pickup Date & Time</h3>
                  <p className="text-sm text-muted-foreground">Pick up is available Thursday–Saturday, 2–6 pm.</p>

                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Date</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            {availableDates.map(({ label, value }) => (
                              <label
                                key={value}
                                className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${field.value === value ? 'border-primary bg-primary/5 font-medium' : 'hover:bg-muted/50'}`}
                              >
                                <input
                                  type="radio"
                                  className="accent-primary"
                                  checked={field.value === value}
                                  onChange={() => {
                                    field.onChange(value);
                                    form.setValue('pickupTime', '');
                                  }}
                                />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchPickupDate && (
                    <FormField
                      control={form.control}
                      name="pickupTime"
                      render={({ field }) => (
                        <FormItem className="animate-in fade-in slide-in-from-top-4 duration-300">
                          <FormLabel className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Time</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              {TIME_SLOTS.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => field.onChange(slot)}
                                  className={`border rounded-lg py-2.5 text-sm font-medium transition-colors ${field.value === slot ? 'border-primary bg-primary/5 text-primary' : 'hover:bg-muted/50'}`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Payment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Payment Method</h3>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { value: 'etransfer', icon: <CreditCard className="h-6 w-6" />, label: 'e-Transfer', sub: 'Pay after confirming' },
                              { value: 'cash', icon: <Banknote className="h-6 w-6" />, label: 'Cash', sub: 'Pay on pickup' },
                            ].map(({ value, icon, label, sub }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => field.onChange(value)}
                                className={`border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors text-center ${field.value === value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                              >
                                {icon}
                                <span className="font-medium">{label}</span>
                                <span className="text-xs text-muted-foreground">{sub}</span>
                              </button>
                            ))}
                          </div>
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
                            placeholder="Any special requests?"
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
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-serif text-xl font-bold text-foreground pt-2">
                <span>Total</span>
                <span data-testid="text-total">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              className="w-full h-14 text-lg font-serif mt-8 hidden lg:flex"
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
              You'll get an order number right away. Sherry will have it ready at your pickup time.
            </p>
          </div>
        </div>
      </main>
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 shrink-0 px-3"
            onClick={() => setIsCartOpen(true)}
            data-testid="button-mobile-open-cart"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Cart ({totalItems})
          </Button>
          <Button
            type="submit"
            form="checkout-form"
            className="h-12 flex-1 text-base font-serif"
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
      </div>
    </div>
  );
}
