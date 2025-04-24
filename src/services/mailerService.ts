import nodemailer, { SendMailOptions } from 'nodemailer'
import forgotPasswordTemplate from '@/templates/forgotPassword'
import googleRegistrationTemplate from '@/templates/googleRegistration'
import welcomeNewStaffTemplate from '@/templates/welcomeNewStaff'
import welcomeNewAdminTemplate from '@/templates/welcomeNewAdmin'

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
    },

    sendWelcomeNewStaffMail: async (
        emailTo: string,
        fullName: string,
        workingDate: string,
        station: string,
        username: string,
        password: string,
        changePasswordUrl: string
    ) => {
        const title = 'HCMC Metro - Chào mừng nhân viên mới'
        const mailOptions = {
            from: process.env.GOOGLE_EMAIL,
            to: emailTo,
            subject: title,
            html: welcomeNewStaffTemplate({
                title: title,
                fullName: fullName,
                workingDate: workingDate,
                station: station,
                username: username,
                password: password,
                changePasswordUrl: changePasswordUrl
            })
        }
        return await sendEmail(mailOptions)
    },

    sendWelcomeNewAdminMail: async (emailTo: string, fullName: string, username: string, password: string, changePasswordUrl: string) => {
        const title = 'HCMC Metro - Chào mừng admin mới'
        const mailOptions = {
            from: process.env.GOOGLE_EMAIL,
            to: emailTo,
            subject: title,
            html: welcomeNewAdminTemplate({
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
