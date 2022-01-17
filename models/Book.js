const mongoose = require('mongoose');
const { Schema } = mongoose;

/// id isnt need its automatically created
// authorid is just linking the authors for graphql
const bookSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	genre: {
		type: String,
		required: true,
	},
	authorId: {
		type: String,
	},
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
