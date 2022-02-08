import { ApolloServer } from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import express from 'express';
import http from 'http';

import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlUploadExpress } from 'graphql-upload'
import moduleUpload from './modules/index.js'
import path from 'path';


const schema = makeExecutableSchema({
    typeDefs: [
        moduleUpload.typeDefs
    ],
    resolvers: [
        moduleUpload.resolvers
    ]
})

    ; (async function startApolloServer() {
        const app = express();
        app.use(graphqlUploadExpress())
        app.use(express.static(path.join(process.cwd(), 'uploads')))
        const httpServer = http.createServer(app);

        const server = new ApolloServer({
            schema,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground()]
        });

        await server.start();
        server.applyMiddleware({ app });

        await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    })()