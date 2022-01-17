import React, { useState } from 'react';

import { useQuery } from '@apollo/client';

import { GET_BOOKS } from '../queries/queries';

import BookDetails from './BookDetails';

const BookList = () => {
	const [selected, setSelected] = useState();
	const { loading, error, data, refetch } = useQuery(GET_BOOKS, {
		pollInterval: 1.8e6,
	});

	function displayBooks() {
		if (loading) {
			return <div>Loading books...</div>;
		} else if (error) {
			return <div>Error</div>;
		} else {
			return data.books.map(book => {
				return (
					<li key={book.id} onClick={() => setSelected(book.id)}>
						{book.name}
					</li>
				);
			});
		}
	}

	return (
		<div>
			<ul id='book-list'>{displayBooks()}</ul>
			<button className='refetcher' onClick={refetch}>
				Refetch!
			</button>
			<BookDetails bookId={selected} />
		</div>
	);
};

export default BookList;
