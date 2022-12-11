const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/Book');
const Author = require('../models/Author');

// defining types, like objects, strings graphql needs this
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

//! GraphQLNonNull is basically a required field

//dummy data
// the authorID is connecting the authoer id to the books
// even if the ids coincidentally are the same they are not linked
// var books = [
// 	{ name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '5' },
// 	{ name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
// 	{ name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
// 	{ name: 'The Hero Of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
// 	{ name: 'The Color of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
// 	{ name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
// ];

// var authors = [
// 	{ name: 'Patrick Rothfuss', age: 44, id: '5' },
// 	{ name: 'Brandon Sanderson', age: 42, id: '2' },
// 	{ name: 'Terry Pratchett', age: 66, id: '3' },
// ];

const BookType = new GraphQLObjectType({
	// booktype is called book
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: {
			type: GraphQLString,
		},
		genre: {
			type: GraphQLString,
		},
		author: {
			type: AuthorType,
			//parent refers to the parent so in this case BooktType
			resolve(parent, args) {
				// this resolve within the object it linking author info within a book API call
				// return _.find(authors, { id: parent.authorId });

				return Author.findById(parent.authorId);
			},
		},
	}),
});

//creating object AuthorType
//! remember this is where you create type relations when you want to search another object through Booktype
const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: {
			type: GraphQLString,
		},
		age: {
			type: GraphQLInt,
		},
		books: {
			// this means books are gonna be a new list of BookType
			//! GraphQLList is when u are a relational return but in list form as multiple entries
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// this resolve within the object it linking author info within a book API call
				// return _.filter(books, { authorId: parent.id });
				return Book.find({ authorId: parent.id });
			},
		},
	}),
});

//root queries the endpoint in which users can connect to the database.
// example from author? from book?  each field is gonna be a connecting point
// no need to wrap fields in function like before because order doesnt matter

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			// the args is what the client will send with the request so this is the id
			// used to retrieve the info
			//type GraphQLID is string essentially but reduces the need for quotes
			resolve(parent, args) {
				//code to get data from db
				// User.findOne({ id: id });
				// return _.find(books, { id: args.id });
				return Book.findById(args.id);
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			//type GraphQLID is string essential but reduces the need for quotes
			resolve(parent, args) {
				// const authorfind = _.find(authors, { id: args.id });

				return Author.findById(args.id);
			},
		},
		books: {
			// returning entire list of books
			type: new GraphQLList(BookType),

			resolve(parent, args) {
				// return books;
				return Book.find().sort({ createdAt: -1 });
			},
		},
		authors: {
			// returning entire list of authors
			type: new GraphQLList(AuthorType),

			resolve(parent, args) {
				return Author.find().sort({ createdAt: -1 });
			},
		},
	},
});
//TODO NOTE: mutations in graphql is adding, editing, removing data
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		AddAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name,
					age: args.age,
				});
				return author.save();
			},
		},
		AddBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId,
				});
				return book.save();
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
