import nodemailer, { SendMailOptions } from 'nodemailer'
import forgotPasswordTemplate from '@/templates/forgotPassword'
import googleRegistrationTemplate from '@/templates/googleRegistration'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_EMAIL_PASSWORD
    }
})

const sendEmail = (mailOptions: SendMailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, messageInfo) => {
            if (error) {
                reject(error)
            } else {
                resolve(messageInfo)
            }
        })
    })
}

const mailerService = {
    sendResetPasswordMail: async (emailTo: string, fullName: string, resetPasswordUrl: string) => {
        const title = 'HCMC Metro - Đặt lại mật khẩu'
        const mailOptions = {
            from: process.env.GOOGLE_EMAIL,
            to: emailTo,
            subject: title,
            html: forgotPasswordTemplate({
                title: title,
                fullName: fullName,
                resetPasswordUrl: resetPasswordUrl
            })
        }
        return await sendEmail(mailOptions)
    },

    sendGoogleRegistrationMail: async (emailTo: string, fullName: string, username: string, password: string, changePasswordUrl: string) => {
        const title = 'HCMC Metro - Đăng ký bằng tài khoản Google'
        const mailOptions = {
            from: process.env.GOOGLE_EMAIL,
            to: emailTo,
            subject: title,
            html: googleRegistrationTemplate({
                title: title,
                fullName: fullName,
                username: username,
                password: password,
                changePasswordUrl: changePasswordUrl
            })
        }
        return await sendEmail(mailOptions)
    }
}

export default mailerService
