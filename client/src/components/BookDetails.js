import React from 'react';

import { useQuery } from '@apollo/client';

import { GET_BOOK } from '../queries/queries';

const BookDetails = ({ bookId }) => {
	function displayBookDetails() {
		if (loading) {
			return <div>Loading books...</div>;
		} else if (error) {
			return <div>Error</div>;
		} else {
			// return data.books.map(book => {
			// 	return <li key={book.id}>{book.name}</li>;
			// });
			return renderhelper(data.book);
		}
	}

	const renderhelper = book => {
		if (book) {
			console.log(book.name);
			return (
				<div>
					<h2>{book.name}</h2>
					<div>Genre: {book.genre}</div>
					<div>Author: {book.author.name}</div>
					<div>Author Age: {book.author.age}</div>
					<div>
						Books by the same author:
						<ul className='other-books'>
							{book.author.books.map(item => (
								<li key={item.id}>{item.name}</li>
							))}
						</ul>
					</div>
				</div>
			);
		} else {
			return <div>No Book Selected...</div>;
		}
	};

	const { loading, error, data } = useQuery(GET_BOOK, {
		pollInterval: 1.8e6,
		variables: {
			id: bookId,
		},
	});
	return (
		<div id='book-details'>
			Book Details here
			<div>{displayBookDetails()}</div>
		</div>
	);
};

export default BookDetails;
