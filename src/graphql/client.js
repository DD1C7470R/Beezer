import {
    ApolloClient, gql,
    InMemoryCache,
} from "@apollo/client";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import {GET_QUEUED_SONGS} from "./queries";

const client = new ApolloClient({

    link: new GraphQLWsLink(
        createClient({
            url: 'wss://close-colt-65.hasura.app/v1/graphql',
            options: {
                reconnect: true
            },
            connectionParams: {
                headers: {
                    "x-hasura-admin-secret" : process.env.REACT_APP_HASURA_ADMIN_AUTH_KEY
                },
            }
        }),

    ),
    cache: new InMemoryCache(),
    typeDefs: gql`
       type Song{
            id: uuid!,
            title: String!
            artist: String!
            thumbnail: String!
            url: String!
            duration: Float!
        }
        input SongInput{
            id: uuid!,
            title: String!
            artist: String!
            thumbnail: String!
            url: String!
            duration: Float!
        }
        
        type Query{
            queue: [Song]!
        }
    type Mutation{
    addOrRemoveFromQueue(input: SongInput!): [Song]!
    }
    `,
    resolvers: {
        Mutation: {
            addOrRemoveFromQueue: (_, {input}, {cache}) => {
                const queryResult = cache.readQuery({
                    query: GET_QUEUED_SONGS
                })
                if (queryResult) {
                    const {queue} = queryResult;
                    const newQueue = queue.some(song => song.id === input.id) ?
                        queue.filter(song => song.id !== input.id)
                        : [...queue, input]
                    cache.writeQuery({
                        query:  GET_QUEUED_SONGS,
                        data: {queue: newQueue}
                    })
                    return newQueue
                }
                return [];
            }
        }
    }
})

const hasQueue = localStorage.getItem("queue");
const data = {
    queue: hasQueue ? JSON.parse(localStorage.getItem("queue")) : []
}
client.writeQuery({query: GET_QUEUED_SONGS, data})
export default client;
