import express from 'express'
import stationController from '@/controllers/stationController'

const router = express.Router()

router.get('/metro-stations', stationController.getStations)

export default router
