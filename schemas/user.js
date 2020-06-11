const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = require('graphql')
const _ = require('lodash')
const users = [{ id: "1", name: "atigh", age: 30 }]
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id:{type: GraphQLString} },
            resolve(parentValue, args){
                return _.find(users, {id:args.id})
            }
        }
    }
})
module.exports=new GraphQLSchema({
    query:RootQuery
})
