/* eslint-disable */
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { getToken, sendNonce, createDropIn } from './braintree';
import { token } from 'morgan';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const container = document.querySelector('#dropin-container');

// DELEGATION
if (mapBox) {
  // Whatever we put into a data attribute like data-locations,
  // it wii be stored into the dataset property.
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    // prevent form element to load any other page
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);
    await updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (container) {
  const button = document.querySelector('#submit-button');

  getToken()
    .then((token) => createDropIn(token))
    .then((dropinInstance) => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        await sendNonce(dropinInstance, tourId);
        location.assign('/');
      });
    });
}
// const cleanFlow = async () => {
//   const token = await getToken();
//   const instance = await createDropIn(token);
//   console.log(instance);
//   return instance;
// };
