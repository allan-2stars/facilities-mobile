const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type User {
    _id:ID!
    email: String!
    password: String
    firstName: String!
    lastName: String!
    active: Boolean!
  }

  type Profile{
    parents: [User]
    courses:[Course]
    staff:[User]
    stdudents:[User]
    user:User
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

  type Course{
    staff: [User]
    name: String!
    difficulty: String!
    description: String
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
    firstName: String!
    lastName: String!
    active: Boolean!
  }

  input ProfileInput {
    parents: [String]
    courses:[String]
    staff:[String]
    stdudents:[String]

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

  input CourseInput{
    staff: [String]
    name: String!
    difficulty: String!
    description: String
    moreInfo: String
  }

  type RootQuery{
    users: [User!]
    profile: Profile!
    profilesPeek: [Profile!]
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createUser(userInput: UserInput): User
    createProfile(profileInput: ProfileInput): Profile
    createCourse(courseInput: CourseInput): Course
  }
  
  schema{
    query:RootQuery
    mutation:RootMutation
  }
`);
