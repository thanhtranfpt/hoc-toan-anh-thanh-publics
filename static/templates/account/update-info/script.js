function addMoreExtraInfo(placeHolder) {
    var parentDiv = document.getElementById('extra-info');
    var childHTML = `
        <input type="text" placeholder="${placeHolder}" />
    `

    var newChild = document.createElement('input');
    newChild.setAttribute('type', 'text');
    newChild.setAttribute('placeholder', `${placeHolder}`);

    parentDiv.appendChild(newChild);
};


function chooseUserType(userType) {
    if (userType === 'phu_huynh') {
        var extraInfoLabel = 'Your children:';
        var inputPlaceHolder = 'Nhập Mã học viên của con em quý phụ huynh';
        var addMoreLabel = 'Thêm học viên';
    }
    else {
        var extraInfoLabel = 'Lớp học của bạn:';
        var inputPlaceHolder = 'Nhập Mã lớp học của bạn';
        var addMoreLabel = 'Thêm lớp học';
    }

    document.getElementById('extra-info-label').textContent = extraInfoLabel;

    document.querySelector('#extra-info > input').placeholder = inputPlaceHolder;

    var wrapperAddMore = document.getElementById('wrapper-add-more');
    wrapperAddMore.onclick = () => {
        addMoreExtraInfo(inputPlaceHolder);
    };

    document.querySelector('#wrapper-add-more > div').textContent = addMoreLabel;

};


function getThuTuHienThiTen() {
    var parentDiv = document.getElementById('thu-tu-hien-thi-ten-option');
    var children = parentDiv.children;

    for (let i = 0; i < children.length; i++) {
        var grandChildren = children[i].children;

        for (let j = 0; j < grandChildren.length; j++) {
            var grandChildElem = grandChildren[j];
            if (grandChildElem.tagName.toLowerCase() === 'input' && grandChildElem.checked) {
                var elemId = grandChildElem.id;
                return elemId.substring('check-'.length)
            }
        }
    }
};


function getGenderSelected() {
    var inputIds = ['check-male', 'check-female', 'check-other'];

    for (let i = 0; i < inputIds.length; i++) {
        var value = inputIds[i];
        var inputElem = document.getElementById(value);
        if (inputElem.checked) {
            return value.substring('check-'.length)
        }
    }
};


function getNationSelected() {
    var selection = document.getElementById('nation');
    var selected = selection.options[selection.selectedIndex].text;
    return selected
};


function getUserType() {
    var inputIds = ['check-user_type-hv', 'check-user_type-ph', 'check-user_type-gv', 'check-user_type-admin'];

    for (let i = 0; i < inputIds.length; i++) {
        var elemId = inputIds[i];
        if (document.getElementById(elemId).checked) {
            return elemId.substring('check-user_type-'.length)
        }
    }
};


function getExtraInfo() {
    var parentDiv = document.getElementById('extra-info');
    var children = parentDiv.children;

    var values = [];

    for (let i = 0; i < children.length; i++) {
        var childElem = children[i];
        if (childElem.tagName.toLowerCase() === 'input') {
            values.push(childElem.value);
        }
    }

    return values
};


function showFullName() {
    var value = getThuTuHienThiTen();

    var fullNameInput = document.getElementById('full-name');
    var familyName = document.getElementById('family-name').value;
    var givenName = document.getElementById('given-name').value;

    if (value === 'family_name_first') {
        fullNameInput.value = [familyName, givenName].join(' ');
    }
    else {
        fullNameInput.value = [givenName, familyName].join(' ');
    }
};


function tickThuTuHienThiTen() {
    if (user['family_name_first']) {
        document.getElementById('check-family_name_first').setAttribute('checked', 'true');
    }
    else {
        document.getElementById('check-given_name_first').setAttribute('checked', 'true');
    }
};


function uploadAvatarImage(event) {
    var file = event.target.files[0];
    var formData = new FormData();
    formData.append('image', file);

    if (file) {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn thay đổi ảnh đại diện này không ?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Có, hãy thay đổi!"
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('loading-icon').style.display = 'block';

                fetch('/uploads/image', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('loading-icon').style.display = 'none';
                    
                    if (data['status'] === 1) {
                        Swal.fire({
                            title: 'Chúc mừng!',
                            text: 'Ảnh đại diện của bạn đã được đổi thành công.',
                            icon: 'success'
                        });
                        document.getElementById('user-avatar').src = data['image']['url'];
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


function tickGender(genderChosen) {
    document.getElementById(`check-${genderChosen}`).setAttribute('checked', 'true');
};


function selectNation(nationSelected) {
    // // Select the <select> element
    // var selectElement = document.getElementById("mySelect");
    
    // // Set the index of the option you want to select (0-based index)
    // var selectedIndex = 1; // This will select the second option
    
    // // Set the selected index
    // selectElement.selectedIndex = selectedIndex;


    // Select the <select> element
    var selectElement = document.getElementById("nation");

    // Set the value you want to select
    var selectedValue = nationSelected;

    // Iterate through options to find the one with the matching value
    for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === selectedValue) {
            // Set the selected property of the matching option to true
            selectElement.options[i].selected = true;
            break; // Exit loop since we found the matching option
        }
    }
};


async function changePassword() {
    var { value: oldPassword } = await Swal.fire({
        title: "Thay đổi Mật khẩu:",
        input: "password",
        inputPlaceholder: "Nhập mật khẩu hiện tại của bạn",
        showCancelButton: true,
        inputAttributes: {
            maxlength: "255",
            autocapitalize: "off",
            autocorrect: "off"
        }
    });
    if (oldPassword) {
        var { value: newPassword } = await Swal.fire({
            title: "Thay đổi Mật khẩu:",
            input: "password",
            inputPlaceholder: "Nhập mật khẩu mới của bạn",
            showCancelButton: true,
            inputAttributes: {
                maxlength: "255",
                autocapitalize: "off",
                autocorrect: "off"
            }
        });

        if (newPassword) {
            showLoading();

            fetch('/my-account/update/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            })
            .then(response => response.json())
            .then(data => {
                hideLoading();
                
                if (data['status'] === 1) {
                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Mật khẩu của bạn đã được cập nhật, hãy nhớ kỹ mật khẩu mới này nhé.',
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
    }
};




document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loading-icon').style.display = 'none';
    tickThuTuHienThiTen();
    showFullName();
    tickGender(user['gender']);
    selectNation(user['address']['postal_code']);

    var form = document.getElementById('main-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        document.getElementById('loading-icon').style.display = 'block';

        var familyNameFirst = getThuTuHienThiTen() === 'family_name_first';

        var data = {
            personal_info: {
                family_name_first: familyNameFirst,
                family_name: document.getElementById('family-name').value,
                given_name: document.getElementById('given-name').value,
                avatar: document.getElementById('user-avatar').src,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                dob: document.getElementById('dob').value,
                gender: getGenderSelected(),
                address: {
                    line_1: document.getElementById('address-line-1').value,
                    line_2: document.getElementById('address-line-2').value,
                    // 'lines': [document.getElementById('address-line-1').value, document.getElementById('address-line-2').value].join('; '),
                    nation: getNationSelected(),
                    city: document.getElementById('city').value,
                    region: document.getElementById('region').value,
                    postal_code: document.getElementById('postal-code').value
                }
            }
        };

        fetch('/my-account/update-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(results => {
            document.getElementById('loading-icon').style.display = 'none';

            if (results['status'] == 1) {
                Swal.fire({
                    title: 'Cập nhật thành công!',
                    icon: 'success'
                });
                setTimeout(function() {
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    }
                }, 2000);
            }
            else if (results['status'] == 2) {
                Swal.fire({
                    title: results['message']['title'],
                    text: results['message']['details'],
                    icon: 'info'
                });
                setTimeout(function() {
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    }
                }, 5000);
            }
            else if (results['status'] === 0) {
                Swal.fire({
                    title: 'Failed.',
                    text: results['message'],
                    icon: 'error'
                });
            }
            else {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: results['message'],
                    icon: 'question'
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