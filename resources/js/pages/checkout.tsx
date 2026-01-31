import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface CheckoutProps {
    product: {
        slug: string;
        name: string;
        price: string;
        description?: string;
    };
}

export default function Checkout({ product }: CheckoutProps) {
    return (
        <>
            <Head title={`Checkout – ${product.name}`} />

            <div className="mx-auto max-w-lg px-4 py-16">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="mt-2 text-muted-foreground">
                    One-time purchase
                </p>

                <ul className="mt-6 space-y-2 text-sm">
                    <li>✔ Lifetime access</li>
                    <li>✔ All future updates</li>
                    <li>✔ Instant access after checkout</li>
                </ul>

                <div className="mt-8 rounded-lg border p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">Total</span>
                        <span className="text-2xl font-bold">
                            {product.price}
                        </span>
                    </div>

                    <Button
                        className="mt-6 w-full"
                        size="lg"
                        onClick={() =>
                            router.post(route('checkout.store'), {
                                product: product.slug,
                            })
                        }
                    >
                        Complete Purchase
                    </Button>

                    <p className="mt-4 text-center text-xs text-muted-foreground">
                        Secure checkout • No stored card data
                    </p>
                </div>
            </div>
        </>
    );
}
