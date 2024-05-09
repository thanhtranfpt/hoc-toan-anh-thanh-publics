var classId = null;



async function chooseClass() {
    var { value: classIdChosen } = await Swal.fire({
        title: "Check Homework:",
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
    }
};



document.getElementById("review-form").addEventListener("submit", function(event) {
    event.preventDefault();

    if (classId === null) {
        return chooseClass()
    }

    showLoading();

    fetch('/teaching/homework/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            class_id: classId,
            month_selected: document.getElementById('month').value
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
            var lessonsData = data['lessons'];
            var lessonsContainer = document.getElementById("lessons-container");
            lessonsContainer.innerHTML = ""; // Clear previous lessons

            lessonsData.forEach(function(lesson) {
                var lessonDiv = document.createElement("div");
                lessonDiv.classList.add("lesson");
    
                var lessonHeading = document.createElement("h2");
                lessonHeading.textContent = lesson.lessonName;
                lessonDiv.appendChild(lessonHeading);
    
                lesson.students.forEach(function(student) {
                    var studentDiv = document.createElement("div");
                    studentDiv.classList.add("student");
    
                    var studentHeading = document.createElement("h3");
                    studentHeading.textContent = student.name;
                    studentDiv.appendChild(studentHeading);
    
                    var filesList = document.createElement("ul");
                    filesList.classList.add("files-list");
                    student.files.forEach(function(file) {
                        var fileItem = document.createElement("li");
                        fileItem.innerHTML = `<a href="${file}" target="_blank">${file}</a>`;
                        filesList.appendChild(fileItem);
                    });
                    studentDiv.appendChild(filesList);
    
                    lessonDiv.appendChild(studentDiv);
                });
    
                lessonsContainer.appendChild(lessonDiv);
            });

            lessonsContainer.style.display = "block"; // Show the lessons container
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
});



document.addEventListener('DOMContentLoaded', function() {
    chooseClass();
});