const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wordSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meanings: {
    type: [Schema.Types.ObjectId],
    ref: 'Meaning',
    required: true,
  },
}, {
  // Mongoose will maintain a createdAt & updatedAt property
  timestamps: true
});

module.exports = mongoose.model("Word", wordSchema);
