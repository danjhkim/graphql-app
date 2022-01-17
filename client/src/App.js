import React from 'react';
import BookList from './components/BookList';
import AddBook from './components/AddBook';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
	uri: '/graphql',
	cache: new InMemoryCache(),
});

function App() {
	return (
		<ApolloProvider client={client}>
			<div id='main'>
				<h1>
					Simple Reading List App with Frontend Apollo and Backend
					GraphQL!
				</h1>
				<BookList />
				<AddBook />
			</div>
		</ApolloProvider>
	);
}

export default App;
