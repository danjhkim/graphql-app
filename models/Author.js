const mongoose = require('mongoose');
const { Schema } = mongoose;

/// id isnt need its automatically created
// authorid is just linking the authors for graphql
const authorSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	age: {
		type: Number,
	},
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
