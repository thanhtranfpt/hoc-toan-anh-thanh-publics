(function ($) {
    'use strict';
    /*==================================================================
        [ Daterangepicker ]*/
    try {
        $('.js-datepicker').daterangepicker({
            "singleDatePicker": true,
            "showDropdowns": true,
            "autoUpdateInput": false,
            locale: {
                format: 'DD/MM/YYYY'
            },
        });
    
        var myCalendar = $('.js-datepicker');
        var isClick = 0;
    
        $(window).on('click',function(){
            isClick = 0;
        });
    
        $(myCalendar).on('apply.daterangepicker',function(ev, picker){
            isClick = 0;
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
    
        });
    
        $('.js-btn-calendar').on('click',function(e){
            e.stopPropagation();
    
            if(isClick === 1) isClick = 0;
            else if(isClick === 0) isClick = 1;
    
            if (isClick === 1) {
                myCalendar.focus();
            }
        });
    
        $(myCalendar).on('click',function(e){
            e.stopPropagation();
            isClick = 1;
        });
    
        $('.daterangepicker').on('click',function(e){
            e.stopPropagation();
        });
    
    
    } catch(er) {console.log(er);}
    /*[ Select 2 Config ]
        ===========================================================*/
    
    try {
        var selectSimple = $('.js-select-simple');
    
        selectSimple.each(function () {
            var that = $(this);
            var selectBox = that.find('select');
            var selectDropdown = that.find('.select-dropdown');
            selectBox.select2({
                dropdownParent: selectDropdown
            });
        });
    
    } catch (err) {
        console.log(err);
    }
    

})(jQuery);




// --------------========================------------------------------
function chooseSubject() {
    var selection = document.getElementById('subject');
    var selected = selection.options[selection.selectedIndex].text;

    if (selected === 'Khác') {
        document.getElementById('other-subject-part').style.display = 'block';
        document.getElementById('other-subject').setAttribute('required', 'true');
    }
    else {
        document.getElementById('other-subject-part').style.display = 'none';
        document.getElementById('other-subject').removeAttribute('required');
    }
};

function chooseGrade() {
    var selection = document.getElementById('grade');
    var selected = selection.options[selection.selectedIndex].text;

    if (selected === 'Khác') {
        document.getElementById('other-grade-part').style.display = 'block';
        document.getElementById('other-grade').setAttribute('required', 'true');
    }
    else {
        document.getElementById('other-grade-part').style.display = 'none';
        document.getElementById('other-grade').removeAttribute('required');
    }
};

function chooseProgram() {
    var selection = document.getElementById('program');
    var selected = selection.options[selection.selectedIndex].text;

    if (selected === 'Khác') {
        document.getElementById('other-program-part').style.display = 'block';
        document.getElementById('other-program').setAttribute('required', 'true');
    }
    else {
        document.getElementById('other-program-part').style.display = 'none';
        document.getElementById('other-program').removeAttribute('required');
    }
};



function getSubjectName() {
    var selection = document.getElementById('subject');
    var selected = selection.options[selection.selectedIndex].text;

    if (selected === 'Choose option') {
        return false
    }

    if (selected === 'Khác') {
        selected = document.getElementById('other-subject').value;
    }

    return selected
};

function getGrade() {
    var selection = document.getElementById('grade');
    var selected = selection.options[selection.selectedIndex].text;

    if (selected === 'Choose option') {
        return false
    }

    if (selected === 'Khác') {
        selected = document.getElementById('other-grade').value;
    }

    return selected
};

function getProgram() {
    var selection = document.getElementById('program');
    var selected = selection.options[selection.selectedIndex].text;

    if (selected === 'Choose program') {
        return false
    }

    if (selected === 'Khác') {
        selected = document.getElementById('other-program').value;
    }

    return selected
};





document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('main-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        var subjectName = getSubjectName();
        if (subjectName === false) {
            return Swal.fire({
                title: 'Vui lòng điền đầy đủ thông tin đăng ký',
                text: 'Choose Subject!'
            });
        }

        var grade = getGrade();
        if (grade === false) {
            return Swal.fire({
                title: 'Vui lòng điền đầy đủ thông tin đăng ký',
                text: 'Choose Grade!'
            })
        }

        var program = getProgram();
        if (program === false) {
            return Swal.fire({
                title: 'Vui lòng điền đầy đủ thông tin đăng ký',
                text: 'Chọn Chương trình học!'
            })
        }


        var data = {
            class_name: document.getElementById('class-name').value,
            subject: subjectName,
            grade: grade,
            program: program,
            bang_dghv_sheet_id: document.getElementById('bang-dghv-sheet-id').value,
            syllabus_sheet_id: document.getElementById('syllabus-sheet-id').value,
            khai_giang_date: document.getElementById('khai-giang-date').value
        };


        showLoading();
        
        fetch('/teaching/create-new-class', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(results => {
            hideLoading();

            var statusCode = results['status'];

            if (statusCode === 1) {
                Swal.fire({
                    title: 'Tạo Lớp học mới thành công!',
                    text: 'Mã lớp học của bạn là: ' + results['class_info']['id'],
                    icon: 'success'
                });
            }
            else if (statusCode === 0) {
                Swal.fire({
                    title: 'Tạo lớp học mới chưa thành công!',
                    text: results['message'],
                    icon: 'error'
                });
            }
            else if (statusCode === 2) {
                Swal.fire({
                    title: results['message']['title'],
                    text: results['message']['details'],
                    icon: 'info'
                });
            }
            else {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: results['message'],
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