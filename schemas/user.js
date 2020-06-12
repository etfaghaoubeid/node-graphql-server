const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList } = require('graphql')
const _ = require('lodash')
const axios = require('axios')
const users = [{ id: "1", name: "atigh", age: 30 }]
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields:()=>( {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        users: {
            type: new GraphQLList( UserType),
            async resolve(parentValue, args) {
                const { data } = await axios.get(`http://localhost:3000/companies/${parentValue.id}/users`);
                return data;
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        company:{
            type: CompanyType,
            async resolve(parentValue, args) {
                try {
                    const { data } = await axios.get(`http://localhost:3000/companies/${parentValue.companyId}`);
                    return data
                }catch(err){
                    console.log(err)
                }
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            async resolve(parentValue, args) {
                const {data} = await axios.get(`http://localhost:3000/users/${args.id}`)
                return data
                   
            }
        }, 
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } }, 
            async resolve(parentValue, args) {
                const { data } = await axios.get(`http://localhost:3000/companies/${args.id}`);
                return data;
            }
        }
    }
})
module.exports=new GraphQLSchema({
    query:RootQuery
})
