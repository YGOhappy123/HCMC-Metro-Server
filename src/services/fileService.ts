import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!
})

interface UploadOptions {
    base64: string
    fileFormat: string
    folder: string
}

const fileService = {
    uploadToCloudinary: async ({ base64, fileFormat, folder }: UploadOptions): Promise<UploadApiResponse> => {
        const { uploader } = cloudinary
        const uploadResult = await uploader.upload(`data:image/${fileFormat};base64,${base64}`, {
            folder,
            image_metadata: true
        })

        return uploadResult
    },

    deleteFileByUrl: async (imageUrl: string): Promise<UploadApiResponse> => {
        const { uploader, api, url } = cloudinary

        const parts = url(imageUrl, { type: 'fetch' }).split('/')
        const publicId = parts[parts.length - 1].split('.')[0]
        const folderName = parts[parts.length - 2]

        let fullPublicId = publicId

        if (folderName) {
            const { folders } = await api.root_folders()
            const matchingFolders = folders.filter((folder: any) => folder.name === folderName || folder.path === folderName)
            if (matchingFolders.length > 0) {
                fullPublicId = `${folderName}/${publicId}`
            }
        }

        return await uploader.destroy(fullPublicId)
    }
}

export default fileService
