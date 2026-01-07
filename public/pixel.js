function log(...messages) {
  if (localStorage.getItem('showWeniPixelLogs') === 'true') {
    console.log(`[Gist Pixel Script - ${new Date().toISOString()}] ${messages.join(' ')}`);
  }
}

const throttle = (func, limit) => {
  let inThrottle;

  return function(...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined
          : cache.push(value) && value
        : value,
    indent
  );
  cache = null;
  return retVal;
};

const timeToCallNextAbandonedCartUpdateInSeconds = 15 * 60; // 15 minutes
let seeOrderFormTimeout;

function getDetails() {
  return new Promise((resolve) => {
    fetch('/api/sessions?items=*')
      .then((response) => response.json())
      .then((data) => {
        log('got user data:', JSON.safeStringify(data.namespaces.profile, 2));
        resolve({
          profile: data.namespaces.profile,
          account: data.namespaces.account,
        });
      });
  });
}

function seeOrderForm() {
  log('calling seeOrderForm function');

  clearTimeout(seeOrderFormTimeout);

  fetch('/api/checkout/pub/orderForm')
    .then((response) => response.json())
    .then(async (data) => {
      seeOrderFormTimeout = setTimeout(
        seeOrderForm,
        timeToCallNextAbandonedCartUpdateInSeconds * 1e3
      );

      const { profile, account } = await getDetails();

      const phone = profile.phone?.value || data.clientProfileData.phone;

      fetch('/_v/abandoned-cart-notification', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: data.orderFormId,
          phone,
          account: account.accountName?.value,
          name: data.clientProfileData.firstName,
        }),
      });
    });
}

function handleEvents(e) {
  const eventName = e.data?.eventName;
  switch (eventName) {
    case 'vtex:addToCart': {
      seeOrderForm();
      return;
    }
  }
}

window.addEventListener('message', handleEvents);

if (typeof $(window) === 'object' && typeof $(window).on === 'function') {
  const seeOrderFormThrottled = throttle(seeOrderForm, timeToCallNextAbandonedCartUpdateInSeconds * 1e3);
  $(window).on('orderFormUpdated.vtex', seeOrderFormThrottled);
}

seeOrderForm();
