import React, { useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronLeft, Loader2, Banknote, CreditCard, Calendar, Clock } from 'lucide-react';
import { useCreateOrder } from '@workspace/api-client-react';

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
  const { items, subtotal, totalItems, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const createOrder = useCreateOrder();
  const availableDates = useMemo(() => getAvailablePickupDates(), []);

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
    if (items.length === 0) setLocation('/');
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
        fulfillmentType: 'pickup',
        deliveryAddress: null,
      }
    }, {
      onSuccess: (confirmation) => {
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
        console.error('Order submission failed:', err);
        const msg = err instanceof Error ? err.message : String(err);
        alert(`Order failed: ${msg}\n\nPlease try again or contact us directly.`);
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
