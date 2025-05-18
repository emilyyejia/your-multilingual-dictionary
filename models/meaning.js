const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const meaningSchema = new Schema({
    explanation: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    contributor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meaning', meaningSchema);