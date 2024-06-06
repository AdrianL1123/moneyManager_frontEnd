import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyPayment } from "../../utils/api_payment.js";
import { useEffect } from "react";
import useCustomSnackbar from "../../components/useCustomSnackbar";

export default function PaymentVerify() {
  const snackbar = useCustomSnackbar();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  //* extract query string from the url
  const billplz_id = searchParams.get("billplz[id]");
  const billplz_paid = searchParams.get("billplz[paid]");
  const billplz_paid_at = searchParams.get("billplz[paid_at]");
  const billplz_x_signature = searchParams.get("billplz[x_signature]");

  useEffect(() => {
    //* trigger the payment verification mutation when page load
    verifyPaymentMutation.mutate({
      billplz_id: billplz_id,
      billplz_paid: billplz_paid,
      billplz_paid_at: billplz_paid_at,
      billplz_x_signature: billplz_x_signature,
    });
  }, []);

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (subscription) => {
      //* check if the subscription is paid or not
      //* if its paid show the payment success message
      if (subscription.status === "paid") {
        snackbar.showSuccess("Payment is successfull");
      }
      //* if its failed, show the payment failure message
      //* redirect use to orders page
      if (subscription.status === "failed") {
        snackbar.showWarning("Payment is unsuccessfull");
      }
      navigate("/");
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  return <>Verying your payment...</>;
}
