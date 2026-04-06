import express from 'express';
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
router.post('/', createTournament);
router.put('/:id', updateTournament);
router.delete('/:id', deleteTournament);

export default router;
