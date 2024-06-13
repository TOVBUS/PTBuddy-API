const express = require('express');
const router = express.Router();
const { ActivityRoutine } = require('../models/activityRoutine');

// CREATE - 새로운 루틴 생성
router.post('/', async (req, res) => {
  try {
    const newRoutine = await ActivityRoutine.create(req.body);
    res.status(201).json({ success: true, routine: newRoutine });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// READ - 모든 루틴 조회
router.get('/', async (req, res) => {
  try {
    const routines = await ActivityRoutine.findAll();
    res.status(200).json({ success: true, routines });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// READ - 특정 루틴 조회
router.get('/:id', async (req, res) => {
  try {
    const routine = await ActivityRoutine.findByPk(req.params.id);
    if (routine) {
      res.status(200).json({ success: true, routine });
    } else {
      res.status(404).json({ success: false, message: 'Routine not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE - 특정 루틴 업데이트
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await ActivityRoutine.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedRoutine = await ActivityRoutine.findByPk(req.params.id);
      res.status(200).json({ success: true, routine: updatedRoutine });
    } else {
      res.status(404).json({ success: false, message: 'Routine not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE - 특정 루틴 삭제
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ActivityRoutine.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ success: true, message: 'Routine deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Routine not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
