const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type User {
    _id:ID!
    email: String!
    password: String
    active: Boolean!
  }

  type Profile{
    user: User!
    firstName: String!
    lastName: String!
    jobTitle: String
    contact: String!
    role: String!
    emergencyContact: String
    relationship: String
    gender: String!
    grade: String
    class: String
    charactor: String
    moreInfo: String
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    email: String!
    password: String!
    active: Boolean!
  }

  input ProfileInput {
    firstName: String!
    lastName: String!
    jobTitle: String
    contact: String!
    role: String!
    emergencyContact: String
    relationship: String
    gender: String!
    grade: String
    class: String
    charactor: String
    moreInfo: String
  }

  type RootQuery{
    users: [User!]
    profile: Profile!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createUser(userInput: UserInput): User
    createProfile(profileInput: ProfileInput): Profile
  }
  
  schema{
    query:RootQuery
    mutation:RootMutation
  }
`);
