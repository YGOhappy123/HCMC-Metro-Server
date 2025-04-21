import { getPathValidation } from '@/validations/ticketValidations'
import express from 'express'
import stationController from '@/controllers/stationController'

const router = express.Router()

router.get('/metro-lines', stationController.getLines)
router.get('/metro-stations', stationController.getStations)
router.get('/metro-path', getPathValidation, stationController.getPathBetweenStations)
router.get('/metro-path-enriched', getPathValidation, stationController.getEnrichedPathBetweenStations)

export default router
