var gvClassesName = null;



function thanhToanHocPhi() {
    Swal.fire({
        title: 'Thanh toán Học phí',
        html: `
                Quý phụ huynh thanh toán học phí cho con em mình vui lòng chuyển khoản với nội dung như sau:<br><br>
                <strong>STK: </strong> 0389086735 <br>
                <strong>CTK: </strong> TRAN XUAN THANH <br>
                <strong>Ngân hàng: </strong> Quân Đội (MB Bank) <br>
                <strong>Nội dung: </strong> &lt;Mã HV&gt;_HP_&lt;Tháng học&gt;_2025 <br>
                <i>Ví dụ: MinhQuanVH_HP_T4_2025 </i><br><br><br>
                <i>Hoặc quét mã QR sau để chuyển khoản: </i><br><br>
                <img src="https://firebasestorage.googleapis.com/v0/b/hoctoananhthanh-6642d.appspot.com/o/TRAN_XUAN_THANH_0389086735_MB_Bank.jpg?alt=media" style="width: 80%; height: auto;">
            `,
        icon: 'info'
    });
};
  
  
function contact() {
    Swal.fire({
        title: 'Contact',
        html: `<i>Email: </i> <a href="mailto:xuanthanhtran2462@gmail.com">xuanthanhtran2462@gmail.com</a> <br>
                <i>Facebook: </i> <a href="https://facebook.com/TXTPTTB">Thành Trần (fb.com/TXTPTTB)</a> <br>
                <i>Phone: </i> <a href="tel:+84389086735">038 908 6735</a>`,
        icon: 'success'
    });
};
  
  
async function addChildren() {
    var { value: childId } = await Swal.fire({
        title: "Thêm Học viên:",
        input: "text",
        inputPlaceholder: "Nhập Mã học viên của con em quý phụ huynh",
        showCancelButton: true,
        inputAttributes: {
            maxlength: "255",
            autocapitalize: "off",
            autocorrect: "off"
        }
    });
    if (childId) {
        showLoading();
        fetch('/phu-huynh/add-children', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                children_ids: [childId]
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();

            if (data['status'] === 1) {
                Swal.fire({
                    title: 'Thành công!',
                    text: data['message'],
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
            Swal.fire({
                title: 'Lỗi:',
                text: error,
                icon: 'error'
            });
        });
    }
};
  
  
async function dangKyLopHocMoi() {
    var { value: classId } = await Swal.fire({
        title: "Đăng ký Lớp học mới:",
        input: "text",
        inputPlaceholder: "Nhập Mã lớp học của bạn",
        showCancelButton: true,
        inputAttributes: {
            maxlength: "255",
            autocapitalize: "off",
            autocorrect: "off"
        }
    });
    if (classId) {
        showLoading();
        fetch('/dang-ky-lop-moi', {
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

            if (data['status'] === 1) {
                Swal.fire({
                    title: 'Thành công!',
                    text: data['message'],
                    icon: 'success'
                });
            }
            else if (data['status'] === 2) {
                Swal.fire({
                title: data['message']['title'],
                text: data['message']['details'],
                icon: 'info'
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
    }
};
  
  
async function addClass() {
    var { value: classId } = await Swal.fire({
        title: "Thêm lớp học:",
        input: "text",
        inputPlaceholder: "Nhập Mã lớp học của bạn",
        showCancelButton: true,
        inputAttributes: {
            maxlength: "255",
            autocapitalize: "off",
            autocorrect: "off"
        }
    });
    if (classId) {
        showLoading();
        fetch('/teaching/add-class', {
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
            
            if (data['status'] === 1) {
                Swal.fire({
                    title: 'Chúc mừng!',
                    text: data['message'],
                    icon: 'success'
                });
            }
            else if (data['status'] === 2) {
                Swal.fire({
                title: data['message']['title'],
                text: data['message']['details'],
                icon: 'info'
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
    }
};
  
  
  
  
  


async function gvViewClassInfo() {
    if (gvClassesName === null) {
        showLoading();

        try {
            var response = await fetch('/teaching/classes/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            var data = await response.json();

            hideLoading();

            var statusCode = data['status'];
            if (statusCode !== 1) {
                return Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'error'
                });
            }

            else {
                gvClassesName = data['classes_name'];
            }

        }
        catch (error) {
            hideLoading();

            return Swal.fire({
                title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                text: error,
                icon: 'error'
            });
        }
    }

    var { value: classIdChosen } = await Swal.fire({
        title: "Xem thông tin lớp học:",
        input: "select",
        inputOptions: gvClassesName,
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
        showLoading();

        fetch('/teaching/classes/get-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                class_id: classIdChosen
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();

            var statusCode = data['status'];

            if (statusCode !== 1) {
                return Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'error'
                })
            }

            else {
                var classInfo = data['class_info'];
                Swal.fire({
                    title: classInfo['mon_hoc'],
                    html: `
                            Thông tin lớp học:<br><br>
                            <strong>Bảng Đánh giá Học viên: </strong> <a href="${classInfo['bang_dghv_link']}" target="_blank">${classInfo['bang_dghv_link']}</a> <br>
                            <strong>Syllabus: </strong> <a href="${classInfo['syllabus_link']}" target="_blank">${classInfo['syllabus_link']}</a> <br>
                            `,
                    icon: 'info'
                });
            }
        })
        .catch(error => {
            hideLoading();

            Swal.fire({
                title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                text: error,
                icon: 'error'
            });
        });
    }
};





async function gvUpdateClassInfo() {
    if (gvClassesName === null) {
        showLoading();

        try {
            var response = await fetch('/teaching/classes/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            var data = await response.json();

            hideLoading();

            var statusCode = data['status'];
            if (statusCode !== 1) {
                return Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'error'
                });
            }

            else {
                gvClassesName = data['classes_name'];
            }

        }
        catch (error) {
            hideLoading();

            return Swal.fire({
                title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                text: error,
                icon: 'error'
            });
        }
    }

    var { value: classIdChosen } = await Swal.fire({
        title: "Cập nhật thông tin lớp học:",
        input: "select",
        inputOptions: gvClassesName,
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
        var { value: formValues } = await Swal.fire({
            title: "Cập nhật thông tin Lớp học:",
            html: `
            <input id="new-class-name-input" class="swal2-input" placeholder="Tên lớp học mới">
            <input id="new-bang-dghv-sheet-id-input" class="swal2-input" placeholder="Bảng Đánh giá HV mới: Google Sheet ID">
            <input id="new-syllabus-sheet-id-input" class="swal2-input" placeholder="Syllabus mới: Google Sheet ID">
            `,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Cập nhật",
            focusConfirm: false,
            preConfirm: () => {
                return {
                    class_id: classIdChosen,
                    new_class_name: document.getElementById('new-class-name-input').value,
                    new_bang_dghv_sheet_id: document.getElementById('new-bang-dghv-sheet-id-input').value,
                    new_syllabus_sheet_id: document.getElementById('new-syllabus-sheet-id-input').value,
                };
            }
        });
        if (formValues) {
            showLoading();

            fetch('/teaching/classes/update-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues)
            })
            .then(response => response.json())
            .then(data => {
                hideLoading();

                if (data['status'] === 1) {
                    Swal.fire({
                        title: 'Cập nhật thông tin Lớp học thành công!',
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
        }
    }
};