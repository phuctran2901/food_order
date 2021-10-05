$(() => {
    getListProduct(1, 2);
})




const buildHtmlListProduct = (res) => {
    let html = '';
    res.data.forEach(item => {
        html += ` <tr>
        <td class="tm-product-name">${item.name}</td>
        <td>${formatNumber(item.price)}</td>
        <td><img src="${item.image}"" alt="${item.name}" class="image-product"/></td>
        <td>${item.category}</td>
        <td>${item.createdAt}</td>
        <td>
          <a href="#" class="tm-product-delete-link">
            <i class="far fa-trash-alt tm-product-delete-icon"></i>
          </a>
        </td>
      </tr>`;
    });
    $('#listProduct').append(html);
    $('#pagination').pagination({
        dataSource: [1, 2, 3, 4, 5, 6, 7, 100],
        pageSize: 1,
        totalNumber: 100,
        showPrevious: false,
        showNext: false,
        callback: function (data, pagination) {
            console.log(data, pagination);
        }
    })
}


const getListProduct = (currentPage, limit) => {
    callAPI(
        "GET",
        "http://localhost:8080/foodorder/server/api/products/",
        { event: "getListProduct", currentPage: currentPage, limit: limit },
        "json",
        buildHtmlListProduct,
        function () { }
    );
}

const buildPagination = (totalPage) => {

}