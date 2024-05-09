const loginContentHTML = `
                <input type="text" class="client-info" placeholder="Tên đăng nhập" id="login-username">
                <input type="password" class="client-info" placeholder="Mật khẩu" id="login-password">
                <button class="submit-button" onclick="handleLogin()">Đăng nhập</button>

                <a href="/my-account/recovery" id="recovery">Khôi phục tài khoản</a>

                <div id="other-option-wrapper">
                    <span class="line"></span>
                    <p id="continue-with">Or continue with</p>
                    <span class="line"></span>
                </div>
                <div id="other-icon-wrapper">
                    <div class="other-icon" onclick="window.location.href = '/login/google?next=${redirectUrl}'">
                        <svg viewBox="0 0 256 262">
                            <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/>
                            <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/>
                            <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/>
                            <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/>
                        </svg>
                    </div>
                    <div class="other-icon" onclick="window.location.href = '/login/apple?next=${redirectUrl}'">
                        <svg viewBox="0 0 456.008 560.035">
                            <path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"/>
                        </svg>
                    </div>
                    <div class="other-icon" onclick="window.location.href = '/login/facebook?next=${redirectUrl}'">
                        <svg viewBox="0 0 1950 1950">
                            <path style="fill:#3A589E" d="M1946.6,988c0-536.5-435.3-971.7-971.7-971.7c-15.6,0-31.8,0.6-47.4,1.3C426.7,41.6,18.1,457.4,3.1,958.8V988c0,478.1,347.7,871.2,819.9,945.8v-643.5H573.3v-312h249.7V757.7c0-250.4,155-387.9,391.8-387.9c77.8,0.6,155.7,7.1,232.2,18.8v277h-136.2c-133.6,0-175.8,77.2-175.8,156.3v156.3h266.6l-42.2,312h-224.4c-0.6,214.7-1.3,428.8-2.6,643.5c63.6-8.4,406.7-59.7,635.7-369.7C1944.6,1324,1948.5,1071,1946.6,988L1946.6,988z"/>
                        </svg>
                    </div>
                </div>
`;




const signUpContentHTML = `
                <input type="text" id="sign-up-family-name" placeholder="Họ" class="client-info">
                <input type="text" id="sign-up-given-name" placeholder="Tên" class="client-info">
                <input type="text" id="sign-up-username" placeholder="Tên đăng nhập" class="client-info">
                <input type="password" id="sign-up-password" placeholder="Mật khẩu" class="client-info">

                <button class="submit-button" onclick="handleSignUp()">Đăng ký</button>
                
                <div id="other-option-wrapper">
                    <span class="line"></span>
                    <p id="continue-with">Or continue with</p>
                    <span class="line"></span>
                </div>
                <div id="other-icon-wrapper">
                    <div class="other-icon" onclick="window.location.href = '/login/google?next=${redirectUrl}'">
                        <svg viewBox="0 0 256 262">
                            <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/>
                            <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/>
                            <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/>
                            <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/>
                        </svg>
                    </div>
                    <div class="other-icon" onclick="window.location.href = '/login/apple?next=${redirectUrl}'">
                        <svg viewBox="0 0 456.008 560.035">
                            <path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"/>
                        </svg>
                    </div>
                    <div class="other-icon" onclick="window.location.href = '/login/facebook?next=${redirectUrl}'">
                        <svg viewBox="0 0 1950 1950">
                            <path style="fill:#3A589E" d="M1946.6,988c0-536.5-435.3-971.7-971.7-971.7c-15.6,0-31.8,0.6-47.4,1.3C426.7,41.6,18.1,457.4,3.1,958.8V988c0,478.1,347.7,871.2,819.9,945.8v-643.5H573.3v-312h249.7V757.7c0-250.4,155-387.9,391.8-387.9c77.8,0.6,155.7,7.1,232.2,18.8v277h-136.2c-133.6,0-175.8,77.2-175.8,156.3v156.3h266.6l-42.2,312h-224.4c-0.6,214.7-1.3,428.8-2.6,643.5c63.6-8.4,406.7-59.7,635.7-369.7C1944.6,1324,1948.5,1071,1946.6,988L1946.6,988z"/>
                        </svg>
                    </div>
                </div>
`;




function chooseTab(tabName) {
    var headerMenuHTML = '';
    var contentWrapperDiv = document.getElementById('content-wrapper');
    if (tabName === 'login') {
        headerMenuHTML = `
            <div class="header-active-button" onclick="chooseTab('login')">Đăng nhập</div>
            <div onclick="chooseTab('sign-up')">
                <p class="header-inactive-button">Đăng ký</p>
                <span class="header-inactive-line"></span>
            </div>
        `;
        contentWrapperDiv.innerHTML = loginContentHTML;
    }
    else {
        headerMenuHTML = `
            <div onclick="chooseTab('login')">
                <p class="header-inactive-button">Đăng nhập</p>
                <span class="header-inactive-line"></span>
            </div>
            <div class="header-active-button" onclick="chooseTab('sign-up')">Đăng ký</div>
        `;
        contentWrapperDiv.innerHTML = signUpContentHTML;
    }

    document.getElementById('header-menu').innerHTML = headerMenuHTML;
};


function handleLogin() {
    document.getElementById('loading-icon').style.display = 'block';

    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;

    if (username && password) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading-icon').style.display = 'none';

            if (data['status'] === 1) {
                Swal.fire({
                    title: "Đăng nhập thành công!",
                    icon: 'success'
                });

                console.log('re:', redirectUrl);

                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            }
            else {
                Swal.fire({
                    title: "Đăng nhập không thành công!",
                    text: data['message'],
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: "Lỗi:",
                text: error,
                icon: 'error'
            });
        });
    }
    else {
        Swal.fire({
            title: "Vui lòng nhập đầy đủ thông tin!",
            text: "Kiểm tra tên đăng nhập và mật khẩu của bạn",
            icon: 'info'
        });
    }
};



function handleSignUp() {
    document.getElementById('loading-icon').style.display = 'block';

    var family_name = document.getElementById('sign-up-family-name').value;
    var given_name = document.getElementById('sign-up-given-name').value;
    var username = document.getElementById('sign-up-username').value;
    var password = document.getElementById('sign-up-password').value;

    if (family_name && given_name && username && password) {
        fetch('/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                family_name: family_name,
                given_name: given_name,
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading-icon').style.display = 'none';
            
            if (data['status'] === 1) {
                
                var completeInfoUrl = '/sign-up/complete-info?next=' + encodeURIComponent(redirectUrl);

                Swal.fire({
                    title: "Đăng ký thành công!",
                    html: `Bạn vui lòng cập nhật thông tin tại <a href=${completeInfoUrl}>đây</a>`,
                    icon: "success"
                });

                setTimeout(function() {
                    window.location.href = completeInfoUrl;
                }, 2000);

            }
            else {
                Swal.fire({
                    title: "Đăng ký không thành công!",
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
    else {
        Swal.fire({
            title: "Vui lòng điền đầy đủ thông tin đăng ký!",
            text: "Bạn hãy kiểm tra lại tên, họ, tên người dùng và mật khẩu",
            icon: 'error'
        });
    }
};





document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loading-icon').style.display = 'none';
    if (action === 'sign_up') {
        chooseTab('sign_up');
    }
});