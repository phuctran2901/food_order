$(() => {
    sessionStorage.setItem("role", -1);
    sessionStorage.setItem("limit", 5);
    getListUser((res) => {
        if (res) {
            renderListUser(res.data, res.currentPage, res.totalPage);
        }
    });

    $("#select-accounts").change(e => { // lựa chọn lấy khách hàng theo phân quyền
        getListUser((res) => {
            if (res) {
                sessionStorage.setItem("role", e.target.value);
                renderListUser(res.data, res.currentPage, res.totalPage);
            }
        }, Number(e.target.value), 1, Number(sessionStorage.getItem("limit")));
    });
    $("#select-limit").change(e => { // lấy khách hàng theo số lượng
        getListUser((res) => {
            if (res) {
                sessionStorage.setItem("litmit", e.target.value);
                renderListUser(res.data, res.currentPage, res.totalPage);
            }
        }, Number(sessionStorage.getItem("role")), 1, Number(e.target.value));
    });
});


const getListUser = (callback, role = -1, currentPage = 1, limit = 5) => {
    console.log(role, currentPage, limit);
    callAPI("GET", `${base_URL}/users/`, { event: "getListUser", role, currentPage, limit }, 'JSON ', callback);
}

const renderListUser = (data, currentPage, totalPage) => {
    $("#listUser").html("");
    let html = ``;
    data.forEach(item => {
        html += `
        <tr>
            <th scope="row"><b>#${item.userID}</b></th>
            <td>${item.name}</td>
            <td><b>${item.phone ? item.phone : "Chưa cập nhật"}</b></td>
            <td><b>${item.email}</b></td>
            <td><b>${rendeRole(item.role)}</b></td>
            <td>${new Date(item.createdAt).toLocaleDateString()}</td>
            <td>
                <a style="cursor:pointer; color:orange;"  href="./profile.html?slug=${item.userID}" class="tm-product-delete-link" >
                    <i class="fas fa-edit"></i>
                </a>
                <a style="cursor:pointer;" onClick = "deleteUser(${item.userID},${currentPage} )"class="tm-product-delete-link" >
                    <i class="far fa-trash-alt tm-product-delete-icon" style="color:#f1c1c1;"></i>
                </a>
              </td>
        </tr>
        `;
    });
    $("#listUser").html(html);
    $("#pagination").html(renderPagination(currentPage, totalPage));
}

const rendeRole = (num) => {
    switch (Number(num)) {
        case 0:
            return "Admin";
        case 1:
            return "Người dùng";
        case 2:
            return "Shipper";
        default:
            return "Không xác định";
    }
}

const changePagination = (page) => {
    getListUser((res) => {

    }, Number(sessionStorage.getItem('role')), page)
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