import { useEffect, type FC } from 'react';
import { useCart } from '../context/CartContext';

type PaymentReturnHandlerProps = {
  onBanner: (message: string) => void;
  onGoCheckout: () => void;
};

/** Handles Stripe/PayPal return query params after redirect. */
const PaymentReturnHandler: FC<PaymentReturnHandlerProps> = ({ onBanner, onGoCheckout }) => {
  const { clearCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const ref = params.get('ref');
    if (payment === 'success') {
      clearCart();
      onBanner(
        `Payment successful${ref ? ` · reference ${ref}` : ''}. Thank you — we will confirm your booking shortly.`
      );
      onGoCheckout();
      window.history.replaceState({}, '', window.location.pathname);
    } else if (payment === 'cancelled') {
      onBanner('Payment was cancelled. You can try again from checkout.');
      onGoCheckout();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [clearCart, onBanner, onGoCheckout]);

  return null;
};

export default PaymentReturnHandler;
