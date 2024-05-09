const lessonString = localStorage.getItem('tmp');
const lesson = JSON.parse(lessonString);

document.getElementById('lesson-title').textContent = lesson['title'];

var de_bai_html = `
                    <p>${lesson['de_bai']['text']}</p>
                    ${lesson['de_bai']['imgs'].map(img => `
                        <img src="${img['link']}" style="width: 100%; height: auto; object-fit: contain;">
                    `).join('')}
                    ${lesson['de_bai']['embeds'].map(embed => `
                        <iframe src="${embed['link']}" frameborder="0" style="width: 100%; height: 500px;"></iframe>
                    `).join('')}
                    <p></p>
                `

document.getElementById('de-bai').innerHTML = de_bai_html;




// document.getElementById('file-upload').addEventListener('change', function() {
//     var files = this.files;
//     var uploadedFilesContainer = document.querySelector('.uploaded-files');

//     for (var i = 0; i < files.length; i++) {
//         var file = files[i];
//         if (file.type.startsWith('image/')) {
//             var img = document.createElement('img');
//             img.src = URL.createObjectURL(file);
//             uploadedFilesContainer.appendChild(img);
//         }
//     }
// });

document.querySelector('.add-more').addEventListener('click', function() {
    var uploadInput = document.getElementById('file-upload');
    uploadInput.click();
});



function handleFileUpload(event) {
    var files = event.target.files;
    var file = files[0];

    var uploadedFilesContainer = document.querySelector('.uploaded-files');

    var formData = new FormData();
    formData.append('image', file);

    if (file) {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn nộp ảnh chụp này không ?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes!"
        }).then((result) => {
            if (result.isConfirmed) {
                showLoading();

                fetch('/uploads/image', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('loading-icon').style.display = 'none';
                    
                    if (data['status'] === 1) {
                        Swal.fire({
                            title: 'Success!',
                            icon: 'success'
                        });

                        var img = document.createElement('img');
                        img.src = data['image']['url'];
                        uploadedFilesContainer.appendChild(img);

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
            }
        });
    }

    // else {
    //     Swal.fire({
    //         title: 'Không tìm thấy ảnh nào!',
    //         text: 'Bạn hãy chụp hoặc tải lên ảnh đại diện mới.',
    //         icon: 'error'
    //     });
    // }
};






function submitHomework() {
    var uploadedFiles = document.getElementById('upload-files');
    var children = uploadedFiles.children;

    if (children.length == 0) {
        return Swal.fire({
            'title': 'Bạn chưa tải lên ảnh chụp bài làm nào!',
            'icon': 'info'
        })
    }


    var img_links = [];

    for (let i = 0; i < children.length; i++) {
        var img = children[i];
        img_links.push(img.src);
    }


    showLoading();


    fetch('/homework/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lesson_metadata: lesson['metadata'],
            img_links: img_links
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();

        var statusCode = data['status'];

        if (statusCode == 1) {
            Swal.fire({
                title: 'Bạn đã Nộp bài thành công!',
                icon: 'success'
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
        hideLoading();
        
        Swal.fire({
            title: 'Lỗi:',
            text: error,
            icon: 'error'
        });
    });
};