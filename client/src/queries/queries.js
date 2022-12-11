import { gql } from '@apollo/client';

const GET_AUTHORS = gql`
	{
		authors {
			name
			id
		}
	}
`;
const GET_BOOKS = gql`
	{
		books {
			name
			id
		}
	}
`;

const GET_BOOK = gql`
	query ($id: ID) {
		book(id: $id) {
			id
			name
			genre
			author {
				id
				name
				age
				books {
					name
					id
				}
			}
		}
	}
`;

const ADD_BOOK = gql`
	mutation addBook($name: String!, $genre: String!, $authorId: String!) {
		AddBook(name: $name, genre: $genre, authorId: $authorId) {
			name
		}
	}
`;

//return name after adding little redundant but i think it needs to return something
export { GET_AUTHORS, ADD_BOOK, GET_BOOKS, GET_BOOK };
