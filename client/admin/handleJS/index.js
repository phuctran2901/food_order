var type = 'ALL';

$(() => {
    getListOrder(res => {
        if (res.status === true) {
            renderListOrder(res.data, res.currentPage, res.totalPage);
        }
    })
    getListNotification(res => {
        if (res.status === true) renderListNotification(res.data);
    })
    $("#typeDate").change(e => {
        type = e.target.value;
        getListOrder(res => {
            if (res.status === true) {
                renderListOrder(res.data, res.currentPage, res.totalPage);
            }
        }, 1, type);
    })
});



const getListOrder = (callback, currentPage = 1, type = 'ALL') => {
    let request = {
        event: "getListOrder",
        currentPage,
        limit: 10,
        type
    }
    callAPI("GET", `${base_URL}/orders`, request, 'json', callback);
}

const getListNotification = (callback) => {
    callAPI("GET", `${base_URL}/notification`, { event: "getList" }, 'json', callback);
}

const renderListOrder = (data, currentPage, totalPage, limit = 10) => {
    let html = '';
    data.forEach((item, index) => {
        html += `
        <tr>
            <th scope="row"><b>${(index + 1) + limit * (currentPage - 1)}</b></th>
            <td>
                <div class="tm-status-circle ${renderStatusClass(item.status)}"></div>
                ${renderStatus(item.status)}
            </td>
            <td><b>${item.phone}</b></td>
            <td><b>${item.address}</b></td>
            <td><b>${item.name}</b></td>
            <td>${new Date(item.createdAt).toLocaleDateString()}</td>
            <td>${formatNumber(item.totalMoney)}</td>
        </tr>
        `;
    });
    $("#listOrder").html(html);
    $("#pagination").html(renderPagination(currentPage, totalPage));
}
const changePagination = (currentPage) => {
    getListOrder(res => {
        getListOrder(res => {
            if (res.status === true) {
                renderListOrder(res.data, res.currentPage, res.totalPage);
            }
        }, currentPage, type);
    })
}
const renderStatus = (num) => {
    switch (Number(num)) {
        case 0:
            return 'Đang xác nhận';
        case 1:
            return 'Đang giao hàng';
        case 2:
            return 'Đã giao';
        default:
            return 'Không xác định';
    }
}

const renderStatusClass = (num) => {
    switch (Number(num)) {
        case 0:
            return 'pending';
        case 1:
            return 'moving';
        case 2:
            return 'cancelled';
        default:
            return 'Không xác định';
    }
}

const renderListNotification = (data) => {
    let html = '';
    data.forEach(item => {
        html += `
        <div class="media tm-notification-item">
            <div class="tm-gray-circle">
                <img src="${item.image}" alt="${item.name}" class="rounded-circle">
            </div>
            <div class="media-body">
                <p class="mb-2"><b>${item.name}</b> vừa <b>${item.content}</b> món ăn ${item.productName}
                <p class="tm-small tm-text-color-secondary">${timeSince(new Date(item.createdAt).getTime())}</p>
            </div>
        </div>

        `;
    })
    $("#listNotification").html(html);
}