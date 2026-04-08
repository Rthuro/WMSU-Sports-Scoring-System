import express from 'express';
import { validate } from "../middleware/validate.js";
import { createTournamentSchema } from "../validators/tournamentSchema.js";
import {
    getTournaments,
    getTournamentById,
    getTournamentBySport,
    getTournamentsByEvent,
    createTournament,
    updateTournament,
    deleteTournament
} from '../controllers/tournamentController.js';

const router = express.Router();

router.get('/', getTournaments);
router.get('/:id', getTournamentById);
router.get('/:sport_id', getTournamentBySport);
router.get('/:event_id', getTournamentsByEvent);
router.post('/', validate(createTournamentSchema), createTournament);
router.put('/:id', updateTournament);
router.delete('/:id', deleteTournament);

export default router;
