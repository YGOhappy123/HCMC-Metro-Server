import express from 'express'
import verifyLogin from '@/middlewares/verifyLogin'
import fileController from '@/controllers/fileController'

const router = express.Router()

router.post('/upload-image', verifyLogin, fileController.uploadSingleImage)
router.post('/delete-image', verifyLogin, fileController.deleteSingleImage)

export default router
