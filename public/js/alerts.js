/* eslint-disable */
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  // Move one level up to the parent element and then from there remove a child element.
  if (el) el.parentElement.removeChild(el);
};

// type is 'success or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;

  // Inside of the body, but right at the beginning
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 3000);
};
