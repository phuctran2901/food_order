$(() => {
    getListOrderDetail(res => {
        renderListOrderDetail(res.data);
    }, getParamsToURL()[0])
});

const getListOrderDetail = (callback, id) => {
    let request = {
        event: "getOrder",
        id
    };
    callAPI("GET", `${base_URL}/orders/`, request, 'json', callback);
}

const renderListOrderDetail = (data) => {
    let html = '';
    let totalCart = data.reduce((totalPrice, cart) => totalPrice + Number(handleDiscountCalculation(cart.price, cart.discount)) * Number(cart.quantity), 0);
    data.forEach(item => {
        html += `
            <div class="row row-main">
                <div class="col-3"> <img class="img-fluid" src="${item.image}" alt="${item.name}"> </div>
                    <div class="col-6">
                        <div class="row d-flex">
                            <p><b>${item.name}</b> x${item.quantity}</p>
                        </div>
                        <div class="row d-flex">
                            <p class="text-muted">${item.nameCategory}</p>
                        </div>
                    </div>
                <div class="col-3 d-flex justify-content-end">
                    <p><b>${formatNumber(Number(handleDiscountCalculation(item.price, item.discount)))}</b></p>
                </div>
            </div>
        `;
    });
    $("#listOrderDetail").html(html);
    $("#total").text(formatNumber(totalCart));
    $("#orderno").text(`Order #${getParamsToURL()[0]}`);
}