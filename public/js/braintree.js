/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Step two: create a dropin instance using that container (or a string
//   that functions as a query selector such as `#dropin-container`)

export const getToken = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/bookings/client_token',
    });

    return res.data.clientToken;
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createDropIn = async (token) => {
  try {
    const dropinInstance = await braintree.dropin.create({
      authorization: token,
      container: '#dropin-container',
    });
    return dropinInstance;
  } catch (err) {
    console.error(err);
  }
};

export const sendNonce = async (dropinInstance, tourId) => {
  try {
    const payload = await dropinInstance.requestPaymentMethod();
    const nonce = payload.nonce;
    await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/bookings/checkout',
      data: {
        payment_method_nonce: nonce,
        tourId,
      },
    });
  } catch (err) {
    console.log(err.response.data.message);
  }
};
