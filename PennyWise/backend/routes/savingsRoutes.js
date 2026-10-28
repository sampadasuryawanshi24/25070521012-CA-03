const express = require('express');
const router = express.Router();
const {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addContribution,
} = require('../controllers/savingsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getSavingsGoals).post(createSavingsGoal);
router.route('/:id').put(updateSavingsGoal).delete(deleteSavingsGoal);
router.route('/:id/contribute').post(addContribution);

module.exports = router;
