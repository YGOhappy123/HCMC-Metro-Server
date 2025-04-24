type WelcomeNewAdminTemplateProps = {
    title: string
    fullName: string
    username: string
    password: string
    changePasswordUrl: string
}

const welcomeNewAdminTemplate = ({ title, fullName, username, password, changePasswordUrl }: WelcomeNewAdminTemplateProps) => `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
            body {
                position: relative;
                height: 100vh;
                margin: 0;
                text-align: center;
            }
            
            .container {
                width: 100%;
                max-width: 700px;
                height: 100%;
                padding: 35px;
                border-radius: 5px;
                background-color: #BAD9F4;
                color: #282525;
            }

            .card {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                transform: translate(-50%, -50%);
            }

            h1, b {
                color: #265B9E;
            }

            h1 span {
                color: #D64A33;
            }

            button {
                padding: 1em 6em;
                border: 0;
                border-radius: 5px;
                transition: all 0.3s ease-in;
                background-color: #3981CA;
                color: #FFFFFF;
                font-weight: 500;
            }

            button:hover {
                background-color: #245898;
            }

            .spacing {
                margin-top: 3rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <img height="60" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/HCMC_Metro_logo.svg/1024px-HCMC_Metro_logo.svg.png" />
                <h1>Xin chào <span>${fullName}</span></h1>
                <p>Chúc mừng bạn đã trở thành một admin chính thức!</p>
                <p>Chào mừng bạn đến với HCMC Metro</p>
                <div class="spacing">
                    <p>Chúng tôi đã cấp cho bạn một tên đăng nhập và mật khẩu ngẫu nhiên</p>
                    <p>Tên đăng nhập: <b>${username}</b></p>
                    <p>Mật khẩu: <b>${password}</b></p>
                </div>
                <div class="spacing">
                    <p>Để thay đổi mật khẩu, hãy ấn vào nút bên dưới 👇🏻</p>
                    <a href="${changePasswordUrl}" target="_blank">
                        <button style="cursor: pointer">
                            Thay đổi mật khẩu
                        </button>
                    </a>
                </div>
                <p class="spacing" style="margin-bottom: 0">
                    Cảm ơn bạn đã ủng hộ HCMC Metro, chúc bạn một ngày tốt lành!
                </p>
            </div>
        </div>
    </body>
</html>
`

export default welcomeNewAdminTemplate
