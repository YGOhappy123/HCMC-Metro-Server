import { getNow } from '@/utils/timeHelpers'
import crypto from 'crypto'

const sortObject = (obj: Record<string, string>) => {
    const sortedObj: any = Object.entries(obj)
        .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
        .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
        .reduce((acc: any, [key, value]) => {
            acc[key] = value
            return acc
        }, {})

    return sortedObj
}

const paymentService = {
    generateVnpayPaymentUrl: (orderId: number, amount: number) => {
        const tmnCode = process.env.VNPAY_TMN_CODE!
        const secretKey = process.env.VNPAY_HASH_SECRET!
        const vnpUrl = process.env.VNPAY_SANDBOX_URL!

        let vnp_Params: Record<string, string> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId.toString(),
            vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
            vnp_OrderType: 'other',
            vnp_Amount: (amount * 100).toString(),
            vnp_ReturnUrl: `${process.env.CLIENT_URL}/thank-you`,
            vnp_IpAddr: '127.0.0.1',
            vnp_CreateDate: getNow().format('YYYYMMDDHHmmss'),
            vnp_ExpireDate: getNow().add(30, 'minute').format('YYYYMMDDHHmmss')
        }

        const sortedParams = sortObject(vnp_Params)
        const urlParams = new URLSearchParams()
        for (let [key, value] of Object.entries(sortedParams)) {
            urlParams.append(key, value as string)
        }

        const querystring = urlParams.toString()
        const hmac = crypto.createHmac('sha512', secretKey)
        const signed = hmac.update(querystring).digest('hex')

        urlParams.append('vnp_SecureHash', signed)
        const paymentUrl = `${vnpUrl}?${urlParams.toString()}`

        return paymentUrl
    },

    verifyVnpayPaymentSigned: (secureHash: string, vnpParams: Record<string, string>) => {
        const secretKey = process.env.VNPAY_HASH_SECRET!

        const sortedParams = sortObject(vnpParams)
        const urlParams = new URLSearchParams()
        for (let [key, value] of Object.entries(sortedParams)) {
            urlParams.append(key, value as string)
        }

        const querystring = urlParams.toString()
        const hmac = crypto.createHmac('sha512', secretKey)
        const signed = hmac.update(querystring).digest('hex')

        return signed === secureHash
    }
}

export default paymentService
