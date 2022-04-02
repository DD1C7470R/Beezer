import {
    ApolloClient, gql,
    InMemoryCache,
} from "@apollo/client";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

// const link = new GraphQLWsLink(
//     createClient({
//         url: 'wss://close-colt-65.hasura.app/v1/graphql',
//     }),
// );


// const client = new GraphQLWsLink(
//         createClient({
//             url: 'wss://close-colt-65.hasura.app/v1/graphql',
//             options: {
//                 reconnect: true
//             },
//             // headers: {
//             //     "x-hasura-admin-secret" : "2iNTYTzIib9gg5W6EqVs3UqpiYwMP5y1YIN0sohPeUXInGUIyc0GQA2rKqGXGvoX"
//             // },
//             // cache: new InMemoryCache(),
//
//         }),
//         )
const client = new ApolloClient({

    link: new GraphQLWsLink(
        createClient({
            url: 'wss://close-colt-65.hasura.app/v1/graphql',
            options: {
                reconnect: true
            },
            connectionParams: {
                headers: {
                    "x-hasura-admin-secret" : "2iNTYTzIib9gg5W6EqVs3UqpiYwMP5y1YIN0sohPeUXInGUIyc0GQA2rKqGXGvoX"
                },
            }
        }),

    ),
    cache: new InMemoryCache(),
    typeDefs: gql`
        song:{
            id: UUID!,
            title: String!
            artist: String!
            thumbnail: String!
            url: String!
            duration: Float!
        }
    `
})
export default client;