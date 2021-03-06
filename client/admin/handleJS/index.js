var type = 'ALL', page = 1;

$(() => {
    checkAdmin();
    getListOrder(res => {
        renderListOrder(res.data, res.currentPage, res.totalPage);
    })
    getListNotification(res => {
        if (res.status === true) renderListNotification(res.data);
    })
    $("#typeDate").change(e => {
        type = e.target.value;
        getListOrder(res => {
            renderListOrder(res.data, res.currentPage, res.totalPage);
        }, 1, type);
    })
    chartOrder();
    getData();
});

const getData = () => {
    callAPI('GET', `${base_URL}/products/`, { event: "getTotal" }, 'json', res => {
        $("#totalProduct").text(`+${res.total || 0}`)
    })
    callAPI('GET', `${base_URL}/users/`, { event: "getTotal" }, 'json', res => {
        $("#totalUser").text(`+${res.total || 0}`)
    })
}

const chartOrder = () => {
    getListOrder((res) => {
        let dataOrder = [];
        res.data.forEach(item => {
            if (dataOrder[new Date(item.createdAt).getMonth()]) {
                dataOrder[new Date(item.createdAt).getMonth()] += 1;
            } else {
                dataOrder[new Date(item.createdAt).getMonth()] = 1;
            }
        })
        let totalMoney = res.data.reduce((total, item) => {
            if (new Date(item.createdAt).getMonth() === new Date(Date.now()).getMonth()) return total + Number(item.totalMoney);
            return total;
        }, 0);
        $("#totalOrder").text(`+${dataOrder[new Date(Date.now()).getMonth()] || 0}`)
        $("#totalMoney").text(`+${formatNumber(totalMoney)}`);
        const renderOrder = document.getElementById('charOrder').getContext('2d');
        const myChart = new Chart(renderOrder, {
            type: 'bar',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                datasets: [{
                    label: false,
                    data: dataOrder,
                    backgroundColor: [
                        'black',
                        'yellow',
                        'blue',
                        'green',
                        'orange',
                        'red',
                        'pink',
                        'tomato',
                        'brown',
                        '#ff80ab',
                        '#f50057',
                        '#fce4ec    '
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: true,
                    displayColors: false,
                    yPadding: 10,
                    xPadding: 30,
                    caretSize: 10,
                    backgroundColor: 'rgba(240, 240, 240, 1)',
                    titleFontColor: 'rgb(50, 100, 50)',
                    bodyFontColor: 'rgb(50, 50, 50)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 1,
                    cornerRadius: 0,
                    yAlign: 'bottom',
                    xAlign: 'center',
                    callbacks: {
                        title: function (tooltipItem, data) {
                            return 'S??? l?????ng ????n th??ng ' + Number(tooltipItem[0].index + 1);
                        },
                        beforeBody: function (tooltipItem, data) {
                            var content = data.datasets[0].data[tooltipItem[0].index];
                            return 'C?? ' + content + ' ????n h??ng';
                        },
                        label: function (tooltipItem, data) {
                            return '--------------';
                        }
                    },
                },
                scales: {
                    yAxes: [{

                        scaleLabel: {
                            display: true,
                            labelString: 'S??? l?????ng ????n h??ng'
                        },
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 20,
                            stepSize: 2
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stepSize: 100
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Th??ng'
                        }
                    }],
                }
            },
        });
    }, 1, 'ALL', 100)
}

const getListOrder = (callback, currentPage = 1, type = 'ALL', limit = 10) => {
    let request = {
        event: "getListOrder",
        currentPage,
        limit: limit,
        type
    }
    callAPI("GET", `${base_URL}/orders/`, request, 'json', callback);
}

const getListNotification = (callback) => {
    let request = {
        event: "getList"
    }
    callAPI("GET", `${base_URL}/notification/`, request, 'json', callback);
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
                ${Number(item.status) === 2 ? "" : `<span onClick ="handleChangeStatus(${item.id});" class="changeOrder"><i class="fas fa-caret-right"></i></span>`}
            </td>
            <td><b>${item.phone}</b></td>
            <td><b>${item.address}</b></td>
            <td><b>${item.name}</b></td>
            <td>${new Date(item.createdAt).toLocaleDateString()}</td>
            <td>${formatNumber(item.totalMoney)}</td>
        </tr>
        `;
    });
    if (data.length === 0) {
        $("#listOrder").html(`<p style="text-align:center;padding:10px;width:100%">Kh??ng c?? ????n h??ng</p>`);
        $("#pagination").html("");
    }
    else {
        $("#listOrder").html(html);
        $("#pagination").html(renderPagination(currentPage, totalPage));
    }
}

const handleChangeStatus = (id) => {
    let request = {
        event: "changeStatus",
        id
    }
    callAPI("POST", `${base_URL}/orders/`, request, 'json', (res) => {
        if (res) {
            getListOrder(res => {
                if (res.status === true) {
                    page = res.currentPage;
                    renderListOrder(res.data, res.currentPage, res.totalPage);
                }
            }, page, type);
        }
    })
}

const changePagination = (currentPage) => {
    getListOrder(res => {
        getListOrder(res => {
            if (res.status === true) {
                page = currentPage;
                renderListOrder(res.data, res.currentPage, res.totalPage);
            }
        }, currentPage, type);
    })
}
const renderStatus = (num) => {
    switch (Number(num)) {
        case 0:
            return '??ang x??c nh???n';
        case 1:
            return '??ang giao h??ng';
        case 2:
            return '???? giao';
        default:
            return 'Kh??ng x??c ?????nh';
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
            return 'Kh??ng x??c ?????nh';
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
                <p class="mb-2"><b>${item.name}</b> v???a <b>${item.content}</b> m??n ??n ${item.productName}
                <p class="tm-small tm-text-color-secondary">${timeSince(new Date(item.createdAt).getTime())}</p>
            </div>
        </div>

        `;
    })
    $("#listNotification").html(html);
}