


$(() => {
  getListProduct((res) => {
    renderProducts(res);
  })
})


const getListProduct = (callback, currentPage = 1) => {
  callAPI(
    "GET",
    `${base_URL}/products/`,
    { event: "getListProduct", currentPage: currentPage, limit: 2 },
    "json",
    callback,
    function () { }
  );
}

const changePagination = (page) => {
  getListProduct((res) => {
    renderProducts(res);
  }, page);
}

const deleteProduct = (productID, currentPage) => {
  let request = {
    event: "deleteProduct",
    productID
  };
  callAPI("POST", `${base_URL}/products/`, request, "JSON",
    (res) => {
      if (res.status) {
        getListProduct((res) => {
          renderProducts(res);
        }, currentPage)
      }
    },
    () => {

    });
}



const renderProducts = (res) => {
  let html = '';
  $("#listProduct").html(""); // reset html
  res.data.forEach(item => {
    html += ` <tr>
        <td class="tm-product-name">${item.name}</td>
        <td>${formatNumber(item.price)}</td>
        <td><img src="${item.image}"" alt="${item.name}" class="image-product"/></td>
        <td>${item.category}</td>
        <td>${item.createdAt}</td>
        <td>
        <a style="cursor:pointer;"  href="./edit-product.html?slug=${item.product_id}" class="tm-product-delete-link" >
        <i class="fas fa-edit"></i>
          </a>
          <a style="cursor:pointer;" onClick = "deleteProduct(${item.product_id},${res.current_page} )"class="tm-product-delete-link" >
            <i class="far fa-trash-alt tm-product-delete-icon"></i>
          </a>
        </td>
      </tr>`;
  });
  $('#listProduct').html(html);
  $('#pagination').html(renderPagination(res.current_page, res.total_page));

}

const renderPagination = (currentPage, totalPage) => {
  let html = `
    <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" onClick="changePagination(${currentPage > 1 ? currentPage - 1 : currentPage});">
        <a class="page-link"  aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
    `;
  for (let index = 1; index <= totalPage; index++) {
    html += `
        <li class="page-item ${index === currentPage ? "active" : ""}" onClick="changePagination(${index});" ><a class="page-link">${index}</a></li>
            `;
  }
  html += ` <li class="page-item" onClick="changePagination(${currentPage < totalPage ? currentPage + 1 : currentPage});">
    <a class="page-link"  aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
      <span class="sr-only">Next</span>
    </a>
  </li>
</ul>
</nav>`;
  return html;
}