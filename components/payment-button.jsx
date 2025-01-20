'use client'
import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay
} from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-background/80" />
        <DialogContent className="sm:max-w-[600px] h-[90vh] p-0 overflow-hidden">
          <div className="w-full h-full overflow-y-auto">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout className="h-full" />
            </EmbeddedCheckoutProvider>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

const PaymentButton = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const onCheckoutClick = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post('/api/subscription/checkout');
            
            if (response.data.clientSecret) {
                setClientSecret(response.data.clientSecret);
                setIsOpen(true);
            } else {
                throw new Error('No client secret received');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to initiate checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const onManageSubscriptionClick = async() => {
      
    }

    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            setClientSecret(null);
        }
    };

    return (
        <>
            <Button
                onClick={onCheckoutClick}
                variant="default"
                className="whitespace-nowrap w-full mt-4 text-sm"
                disabled={isLoading}
            >
                {isLoading ? <Loader2Icon className="animate-spin"/> : children}
            </Button>
            
            {clientSecret && (
                <CheckoutForm 
                    clientSecret={clientSecret}
                    open={isOpen}
                    onOpenChange={handleOpenChange}
                />
            )}
        </>
    );
};

export default PaymentButton;