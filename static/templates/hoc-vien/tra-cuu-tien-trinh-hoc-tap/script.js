var classId = null;
var tenHieuHv = null;
var tenHieuHvPlaceHolder = 'Tên hiệu';
var tenHieuHvInputHTML = `
<input id="ten-hieu-input" class="swal2-input" placeholder="${tenHieuHvPlaceHolder}">
`;



async function chooseClass() {
    var { value: classIdChosen } = await Swal.fire({
        title: "Tra cứu tiến trình học tập:",
        input: "select",
        inputOptions: classesName,
        inputPlaceholder: "Chọn Lớp học",
        showCancelButton: true
        // inputValidator: (value) => {
        //     return new Promise((resolve) => {
        //         if (value === "vietnamese") {
        //             resolve();
        //         }
        //         else {
        //             resolve("Bạn cần vui lòng chọn Tiếng Việt :)");
        //         }
        //     });
        // }
    });
    if (classIdChosen) {
        classId = classIdChosen;

        if (classId in cacTenHieuHv) {
            tenHieuHvPlaceHolder = cacTenHieuHv[classId];
            tenHieuHvInputHTML = `
            <input id="ten-hieu-input" class="swal2-input" value="${tenHieuHvPlaceHolder}">
            `;
        }
        else {
            tenHieuHvPlaceHolder = 'Tên hiệu';
            tenHieuHvInputHTML = `
            <input id="ten-hieu-input" class="swal2-input" placeholder="${tenHieuHvPlaceHolder}">
            `;
        }

        var { value: tenHieuHvInput } = await Swal.fire({
            title: "Nhập tên hiệu của bạn:",
            html: tenHieuHvInputHTML,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "OK",
            focusConfirm: false,
            preConfirm: () => {
                return document.getElementById('ten-hieu-input').value
            }
        });
        if (tenHieuHvInput) {
            tenHieuHv = tenHieuHvInput;
        }
    }
};



document.addEventListener('DOMContentLoaded', function() {
    chooseClass();

    var form = document.getElementById('main-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        var monthSelected = document.getElementById('month-year').value;
        if (monthSelected === 'Chọn tháng') {
            return Swal.fire({
                title: 'Chọn Tháng học',
                icon: 'info'
            })
        }

        if (classId === null || tenHieuHv === null) {
            return chooseClass();
        }

        showLoading();

        fetch('/tra-cuu-tien-trinh-hoc-tap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                class_id: classId,
                ten_hieu_hv: tenHieuHv,
                month_selected: monthSelected
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();

            var statusCode = data['status'];

            if (statusCode === 1) {
                document.getElementById('results').innerHTML = data['results_html'];
            }

            else if (statusCode === 2) {
                Swal.fire({
                    title: data['message']['title'],
                    text: data['message']['details'],
                    icon: 'info'
                });
            }
            else if (statusCode === 3) {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'question'
                });
            }
            else {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi:',
                text: error,
                icon: 'error'
            });
        });
    });
});