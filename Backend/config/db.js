const mongoose = require('mongoose');

const DB_URL='mongodb+srv://safalmondal90:WkzU43TWgiXi37b5@mentoring.a2oq0.mongodb.net/MentoringDb'

exports. connectToDatabase=() => {
   mongoose.connect(DB_URL).then(() => {
    console.log('Connected to MongoDB');
   }).catch(() => {
    console.log('Error connecting to MongoDB');
   })
}