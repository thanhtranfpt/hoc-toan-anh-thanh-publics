var classId = null;
var lessons = null;

var tenHieuHv = null;
var tenHieuHvPlaceHolder = 'Tên hiệu';
var tenHieuHvInputHTML = `
<input id="ten-hieu-input" class="swal2-input" placeholder="${tenHieuHvPlaceHolder}">
`;



async function chooseClass() {
    var { value: classIdChosen } = await Swal.fire({
        title: "Lên kế hoạch ôn thi:",
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



        Swal.fire({
            title: 'Chọn các Nội dung cần Kiểm tra, Đánh giá',
            icon: 'info'
        });


        showLoading();

        fetch('/classes/get-syllabus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                class_id: classId
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();

            var statusCode = data['status'];

            if (statusCode !== 1) {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra khi lấy thông tin về Chương trình Học tập...',
                    text: data['message'],
                    icon: 'error'
                });
            }
            else {
                lessons = data['lessons'];

                const lessonsDiv = document.getElementById('lessons');

                for (let i = 0; i < lessons.length; i++) {
                    var lesson = lessons[i];

                    // lesson = {
                    //     id: '',
                    //     is_chapter: true,
                    //     name: ''
                    // }

                    var lessonDiv = document.createElement('div');
                    if (lesson['is_chapter']) {
                        lessonDiv.classList.add('chapter');
                        lessonDiv.textContent = lesson['name'];
                    }
                    else {
                        lessonDiv.classList.add('lesson-checkbox');
                        var html = `
                            <input type="checkbox" id="${lesson['id']}" name="lesson" value="${lesson['name']}">
                            <label for="${lesson['id']}">${lesson['name']}</label>
                        `;
                        lessonDiv.innerHTML = html;
                    }

                    lessonsDiv.appendChild(lessonDiv);
                }
            }
        })
        .catch(error => {
            hideLoading();
            Swal.fire({
                title: 'Lỗi: (không thể lấy thông tin về Chương trình Học tập)',
                text: error,
                icon: 'error'
            });
        });
    }
};



document.getElementById("lessons-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    // Get all selected lessons
    var selectedLessons = [];
    var checkboxes = document.querySelectorAll('input[name="lesson"]:checked');
    checkboxes.forEach(function(checkbox) {
        selectedLessons.push(checkbox.value);
    });


    // Get date:
    var { value: date } = await Swal.fire({
        title: "Ngày diễn ra kỳ thi:",
        input: "date",
        didOpen: () => {
          const today = (new Date()).toISOString();
          Swal.getInput().min = today.split("T")[0];
        }
    });


    if (classId === null || tenHieuHv === null) {
        return chooseClass()
    }


    if (date) {
        showLoading();

        fetch('/tro-ly-hoc-tap/len-ke-hoach/on-thi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'date': date,
                'lessons_checked': selectedLessons,
                'ten_hieu_hv': tenHieuHv,
                'class_id': classId,
                'get_html': true
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();

            var statusCode = data['status'];

            if (statusCode !== 1) {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'error'
                });
            }
            else {
                var results_html = data['results_html'];
                document.getElementById('recommended-schedule').innerHTML = results_html;
            }
        })
        .catch(error => {
            hideLoading();
            Swal.fire({
                title: 'Lỗi:',
                text: error,
                icon: 'error'
            });
        });
    }

    // // Display the selected lessons
    // var resultsDiv = document.getElementById("results");
    // var recommendedLessonsList = document.getElementById("recommended-lessons");
    // recommendedLessonsList.innerHTML = ""; // Clear previous results
    // selectedLessons.forEach(function(lesson) {
    //     var li = document.createElement("li");
    //     li.textContent = lesson;
    //     recommendedLessonsList.appendChild(li);
    // });
    // resultsDiv.style.display = "block"; // Show the results div


});





document.addEventListener('DOMContentLoaded', function() {
    chooseClass();
});