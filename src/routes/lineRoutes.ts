import express from 'express'
import lineController from '@/controllers/lineController'

const router = express.Router()

router.get('/metro-lines', lineController.getLines)
router.get('/search', lineController.searchLines)

export default router
