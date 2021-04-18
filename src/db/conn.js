const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mernweb', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(() => {
    console.log('connected to database');
}).catch(err => {
    console.log('Error'+err);
});