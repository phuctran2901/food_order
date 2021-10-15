


$(() => {
    getListProduct((res) => {
        renderProducts(res);
    })
    getListCategories(res => {
        if (res.status) {
            renderListCategories(res.data);
        } else toastCustom(ERROR, "Lấy danh sách loại món ăn thất bại", "error");
    });
    $("#inputNameCategoryBtn").click(() => {
        let name = $("#inputNameCategory").val();
        if (name !== "") {
            let request = {
                event: "addCategories",
                name
            };
            callAPI("POST", `${base_URL}/categories/`, request, "json", addCategoriesSuccess);
        } else toastCustom(ERROR, "Vui lòng nhập tên loại món ăn!", "error")
    })
})


const getListCategories = (callback) => {
    return callAPI(
        "GET",
        `${base_URL}/categories/`,
        { event: "getListCategories" },
        'json',
        callback
    )
}

const addCategoriesSuccess = (respon) => {
    if (respon) {
        // gọi lại hàm render categories sau khi thêm thành công
        getListCategories(res => {
            if (res.status) {
                renderListCategories(res.data);
            } else toastCustom(ERROR, "Lấy danh sách loại món ăn thất bại", "error");
        });
        toastCustom(NOTIFICATION, ADD_SUCCESS, "success");
        $("#inputNameCategory").val("");
    } else {
        toastCustom(ERROR, ADD_FAILED, "error");
    }
}


const getListProduct = (callback, currentPage = 1) => {
    callAPI(
        "GET",
        `${base_URL}/products/`,
        { event: "getListProduct", currentPage: currentPage, limit: 5 },
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
                toastCustom(NOTIFICATION, 'Xóa thành công', "success");
            } else {
                toastCustom(ERROR, 'Xóa thất bại', "error");
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
        <td>${item.categoryName}</td>
        <td>${item.createdAt}</td>
        <td>
        <a style="cursor:pointer; color:orange;"  href="./edit-product.html?slug=${item.product_id}" class="tm-product-delete-link" >
        <i class="fas fa-edit"></i>
          </a>
          <a style="cursor:pointer;" onClick = "deleteProduct(${item.product_id},${res.current_page} )"class="tm-product-delete-link" >
            <i class="far fa-trash-alt tm-product-delete-icon" style="color:#f1c1c1;"></i>
          </a>
        </td>
      </tr>`;
    });
    $('#listProduct').html(html);
    $('#pagination').html(renderPagination(res.current_page, res.total_page));

}


const renderListCategories = (data) => {
    let html = '';
    data.forEach(item => {
        html += `
                    <tr>
                        <td class="tm-product-name">${item.name}</td>
                        <td class="text-center">
                            <a style="cursor:pointer;" class="tm-product-delete-link" onClick="deleteCategories(${item.categoryID})">
                                <i class="far fa-trash-alt tm-product-delete-icon"></i>
                            </a>
                        </td>
                    </tr>`;
    })
    $("#listCategories").html(html);
}

const deleteCategories = (id) => {
    let request = {
        event: "deleteCategories",
        id
    };
    callAPI("POST", `${base_URL}/categories/`, request, 'json', (res) => {
        if (res) {
            toastCustom(NOTIFICATION, "Xóa thành công", "success");
            getListCategories(res => {
                if (res.status) {
                    renderListCategories(res.data);
                } else toastCustom(ERROR, "Lấy danh sách loại món ăn thất bại", "error");
            });
        } else {
            toastCustom(WARNING, "Xóa thất bại do có sản phẩm đang thuộc loại này", "warning")
        }
    })
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