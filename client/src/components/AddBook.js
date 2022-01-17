import React, { useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';

import { GET_AUTHORS, ADD_BOOK, GET_BOOKS } from '../queries/queries';

const AddBook = () => {
	const { loading, error, data } = useQuery(GET_AUTHORS);
	const [bookInfo, setbookInfo] = useState();
	const [addBook] = useMutation(ADD_BOOK, {
		refetchQueries: [GET_BOOKS],
	});
	// array of different queries you want to refetch after mutation

	function submitForm(e) {
		e.preventDefault();

		addBook({
			variables: {
				name: bookInfo.name,
				genre: bookInfo.genre,
				authorId: bookInfo.authorId,
			},
		});

		return { addBook, data };
	}

	const displayAuthors = () => {
		if (loading) {
			return <option disabled>Loading authors</option>;
		} else if (error) {
			return <option disabled>Error</option>;
		} else {
			return data.authors.map(author => {
				return (
					<option key={author.id} value={author.id}>
						{author.name}
					</option>
				);
			});
		}
	};

	return (
		<form
			id='add-book'
			onSubmit={e => {
				submitForm(e);
			}}>
			<div className='field'>
				<label>Book name:</label>
				<input
					type='text'
					onChange={e =>
						setbookInfo({ ...bookInfo, name: e.target.value })
					}
				/>
			</div>
			<div className='field'>
				<label>Genre:</label>
				<input
					type='text'
					onChange={e =>
						setbookInfo({ ...bookInfo, genre: e.target.value })
					}
				/>
			</div>
			<div className='field'>
				<label>Author:</label>
				<select
					onChange={e =>
						setbookInfo({ ...bookInfo, authorId: e.target.value })
					}>
					<option>Select author</option>
					{displayAuthors()}
				</select>
			</div>
			<button>+</button>
		</form>
	);
};

export default AddBook;
