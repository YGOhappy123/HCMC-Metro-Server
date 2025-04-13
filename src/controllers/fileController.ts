import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { HttpException } from '@/errors/HttpException'
import { generateDataUriFromBuffer } from '@/utils/fileHelpers'
import errorMessage from '@/configs/errorMessage'
import successMessage from '@/configs/successMessage'
import fileService from '@/services/fileService'

const fileController = {
    uploadSingleImage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const image = (req.files as Express.Multer.File[])[0]
            const folder = req.body.folder ?? req.query.folder?.toString()
            const fileFormat = image.mimetype.split('/')[1]
            const dataUri = generateDataUriFromBuffer(fileFormat, image.buffer)
            const result = await fileService.uploadToCloudinary({
                base64: dataUri.base64 as string,
                fileFormat: fileFormat,
                folder: folder ?? 'hcmc-metro'
            })

            res.status(201).json({
                data: { imageUrl: result.url },
                message: successMessage.UPLOAD_IMAGE_SUCCESSFULLY
            })
        } catch (error) {
            next(error)
        }
    },

    deleteSingleImage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { imageUrl } = req.body
            await fileService.deleteFileByUrl(imageUrl)

            res.status(200).json({ message: successMessage.DELETE_IMAGE_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    }
}

export default fileController
