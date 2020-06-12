const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql')
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
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser:{
            type:UserType,
            args: {
                id:{type:GraphQLString},
                name: { type: new GraphQLNonNull( GraphQLString) },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLInt },
            },
            async resolve(parentValue, { name, age, companyId }) {
                const { data } =await axios.post('http://localhost:3000/users', { name, age, companyId });
                return data;
            }
        },
        deleteUser: {
            type:UserType,
            args: {
                id:{type:new GraphQLNonNull( GraphQLString)}
            },
            async resolve(parentValue, { id }) {
                const { data } = axios.delete(`http://localhost:3000/users/${id}`);
                return data;
            }
        }, 
        editUser: {
            type: UserType, 
            args: {
                id: { type: new GraphQLNonNull( GraphQLString) }, 
                name: { type: GraphQLString },
                age:{type:GraphQLInt},
                companyId:{type:GraphQLInt}
            },
            async resolve(parentValue, { id, name, companyId,age }) {
                const { data } = await axios.patch(`http://localhost:3000/users/${id}`, { name, companyId, age})
                return data;
                
            }
        }
    }
})
module.exports=new GraphQLSchema({
    query: RootQuery,
    mutation,
})
