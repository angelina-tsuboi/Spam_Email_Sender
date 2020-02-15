const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //sets the type of promise as global
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false); //returning unmodified record
mongoose.set('useCreateIndex', true);

module.exports = {
    mongoose: mongoose
}