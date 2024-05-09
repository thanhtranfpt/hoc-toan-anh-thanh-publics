const results = document.getElementById('results');

var classId = null;
var tenHieuHv = null;
var tenHieuHvPlaceHolder = 'Tên hiệu';
var tenHieuHvInputHTML = `
<input id="ten-hieu-input" class="swal2-input" placeholder="${tenHieuHvPlaceHolder}">
`;



async function chooseClass() {
    var { value: classIdChosen } = await Swal.fire({
        title: "Homework:",
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

        if (classId === null || tenHieuHv === null) {
            return chooseClass();
        }

        showLoading();

        fetch('/homework', {
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
                results.innerHTML = '';
                var lessons = data['lessons'];
                for (let i = 0; i < lessons.length; i++) {
                    var lesson = lessons[i]

                    // lesson = {
                    //     'metadata': {
                    //         'class_id': '',
                    //         'month_selected': '',
                    //         'buoi_hoc': '',
                    //         'ten_hieu_hv': ''
                    //     },
                    //     'title': '',
                    //     'de_bai': {
                    //         'text': '',
                    //         'imgs': [
                    //             {
                    //                 'title': 'optional',
                    //                 'link': ''
                    //             }
                    //         ],
                    //         'embeds': [
                    //             {
                    //                 'title': 'optional',
                    //                 'link': ''
                    //             }
                    //         ]
                    //     }
                    // }

                    console.log(lesson);

                    var lesson_html = `
                                <div class="lesson">
                                    <h2>${lesson['title']}</h2>
                                    <div class="de-bai">
                                        <p>${lesson['de_bai']['text']}</p>
                                        ${lesson['de_bai']['imgs'].map(img => `
                                            <img src="${img['link']}" style="width: 100%; height: auto; object-fit: contain;">
                                        `).join('')}
                                        ${lesson['de_bai']['embeds'].map(embed => `
                                            <iframe src="${embed['link']}" frameborder="0" style="width: 100%; height: 500px;"></iframe>
                                        `).join('')}
                                        <p></p>
                                    </div>
                                    <button class="submit-button">Submit Homework</button>
                                </div>
                    `
                    var lessonDiv = document.createElement('div');
                    lessonDiv.innerHTML = lesson_html;

                    lessonDiv.onclick = () => {
                        var lessonString = JSON.stringify(lesson);
                        localStorage.setItem('tmp', lessonString);
                        window.location.href = '/homework/submit';
                    };

                    results.appendChild(lessonDiv);

                    document.querySelector('main').scrollTop = 0;
                }
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