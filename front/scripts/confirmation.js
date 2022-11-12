const searchParams = new URLSearchParams(window.location.search).get('id');
orderId.textContent = searchParams;