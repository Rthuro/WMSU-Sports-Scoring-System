import express from 'express';
import { 
    getTournamentTeams,
    createTournamentTeam,
    updateTournamentTeam,
    deleteTournamentTeam
} from '../../controllers/tournaments/tournamentTeamsController.js';
const router = express.Router();

router.get('/:tournament_id', getTournamentTeams);
router.post('/', createTournamentTeam);
router.put('/:id', updateTournamentTeam);
router.delete('/:id', deleteTournamentTeam);

export default router;
