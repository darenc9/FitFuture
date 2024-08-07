//install mongoose once decided on DB
const mongoose = require('mongoose');

const routineHistorySchema = new mongoose.Schema({
  routineHistoryId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  routineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  userId: String,
  completed: Array, //array is of workout ids to signify which are completed
});

const RoutineHistory = mongoose.model('RoutineHistory', routineHistorySchema);

module.exports = RoutineHistory;
