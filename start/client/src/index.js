import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { Query, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import Pages from "./pages";
import Login from './pages/login';
import {resolvers, typeDefs} from './resolvers';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const cache = new InMemoryCache();
const link = new HttpLink({
    uri: 'http://localhost:4000/',
    headers: {
        authorization: localStorage.getItem('token'),
    },
});
const client = new ApolloClient({
    cache,
    link,
    resolvers,
    typeDefs,
});

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems: [],
    },
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Query query={IS_LOGGED_IN}>
            {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
        </Query>
    </ApolloProvider>, document.getElementById('root'));