import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

export const BASE_URL = "https://rareblu.shop/";
// export const BASE_URL = "http://127.0.0.1:8000/";

export const PAYMENT_URL =
  "https://rareblu.shop/payment/payments/create_checkout_session/";
export const stripePromise = loadStripe(
  "pk_test_51PvfpaGFFuSDNKGDBkvHUBNNM8KISveSjN0cjPBFYX7OqoxJWqnw3bORe91cYA6qPF67whAs8lZVZsVHB0DuurAU00VkoKG4zC"
); 

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})