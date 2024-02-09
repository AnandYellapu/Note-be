// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const taskController = require('../controllers/taskController');

router.use(authenticateToken);

router.get('/', taskController.getTasks);
router.post('/create', taskController.createTask);
router.put('/:id/update', taskController.updateTask);
router.delete('/:id/delete', taskController.deleteTask);
router.post('/:id/undo', taskController.undoTaskDeletion);

module.exports = router;