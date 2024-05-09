const results = document.getElementById('results');

var classId = null;
var tenHieuHv = null;
var tenHieuHvPlaceHolder = 'Tên hiệu';
var tenHieuHvInputHTML = `
<input id="ten-hieu-input" class="swal2-input" placeholder="${tenHieuHvPlaceHolder}">
`;



async function chooseClass() {
    var { value: classIdChosen } = await Swal.fire({
        title: "Ôn bài:",
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

        fetch('/on-bai', {
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
                    // lesson_html = `
                    //         <div class="part">
                    //             <div class="part-title">{{ lesson['title'] | safe }}</div>
                    //             <div class="pdf-container">
                    //                 {% for embed in lesson['embeds'] %}
                    //                 <iframe class="pdf" src="{{ embed['link'] }}" frameborder = "0"></iframe>
                    //                 {% endfor %}
                    //             </div>
                    //             <div class="others">
                    //                 {{ lesson['others'] | safe }}
                    //             </div>
                    //         </div>
                    // `
                    var lesson_html = `
                            <div class="part">
                                <div class="part-title">${lesson['title']}</div>
                                <div class="pdf-container">
                                    ${lesson['embeds'].map(embed => `
                                        <iframe class="pdf" src="${embed['link']}"></iframe>
                                    `).join('')}
                                </div>
                                <div class="others">
                                    ${lesson['others']}
                                </div>
                            </div>
                    `
                    var lessonDiv = document.createElement('div');
                    lessonDiv.innerHTML = lesson_html;
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