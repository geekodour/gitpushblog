Title: This is a sample post title, this is served from '/drafts'

### How to use `create-react-app` with GraphQL & Apollo

The easiest way to get started with React apps that are using a GraphQL backend is with [`create-react-app`](https://github.com/facebookincubator/create-react-app) and [Apollo](http://dev.apollodata.com/).
In this tutorial we will learn how to build an Instagram app, where users can view and post images. The complete code for this tutorial is available on [GitHub](https://github.com/graphcool-examples/react-graphql/tree/master/quickstart-with-apollo).

### Getting your GraphQL endpoint

For this tutorial you'll need a GraphQL project with the following schema:

```graphql
type Post {
  id: ID!
  description: String!
  imageUrl: String!
}
```
