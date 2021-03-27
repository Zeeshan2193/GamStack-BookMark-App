const { ApolloServer, gql } = require('apollo-server-lambda');
const faunadb = require('faunadb'), 
  q = faunadb.query;

const typeDefs = gql`
  type Query {
 
    bookmark: [Bookmark!]
    
  }
  type Bookmark {
    id: ID!
    url: String!
    description: String!
  }

  type Mutation{
    addBookmark(url : String! , description: String!) : Bookmark
  }
`

const authors = [
  { id: 1, url: 'I LOVE YOU https://www.gatsbyjs.com/docs/quick-start/hett', description: "Link for Gatsby Website" },
  { id: 2, url: 'I LOVE YOU https://www.gatsbyjs.com/docs/quick-start/hett', description: "Link for Gatsby Website" },
  { id: 3, url: 'I LOVE YOU https://www.gatsbyjs.com/docs/quick-start/hett', description: "Link for Gatsby Website" },
]

const resolvers = {
  Query: {
    bookmark: async (root, args, context)=>{
      try{
        var client = new faunadb.Client({ secret: 'fnAEFUq80kACCRu_SVv7kTu3kkTvO6uqDgN5M2UQ' });
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda(x => q.Get(x))
          )
        );
      return result.data.map(d => {
        return {
          id:d.ts,
          url:d.data.url,
          description:d.data.description,
        }
      })
      }
      catch(err){
          console.log("Error", err)
      } 
    }
  },
  Mutation: {
    addBookmark : async (_, {url, description})=>{
      var client = new faunadb.Client({ secret: 'fnAEFUq80kACCRu_SVv7kTu3kkTvO6uqDgN5M2UQ' });
      //var client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
      //fnAD_C9rzdACCB4K9uV398lHXW3qKVgPq88OuF_V
      try {
        var result = await client.query(
          q.Create(
            q.Collection('links'),
            { data: { 
              url,
              description
             } },
          )
        );
        return result.ref.data
        console.log("Document Created and Inserted in Container: " + result.ref.id);
      } 
      catch (error){
          console.log('Error: ');
          console.log(error);
      }
  

      console.log('url----description', url, 'description', description);
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
