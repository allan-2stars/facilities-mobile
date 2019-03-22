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
    courses:[Course]
    tutor:[User]
    students:[User]
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
    title: String!
    difficulty: String!
    description: String
    moreInfo: String
  }

  type CourseAssigning{
    course: Course!
    tutor: User!
    assignedAt: String!
    updatedAt: String!
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
    courses: [String]
    tutor: [String]
    students: [String]

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
    title: String!
    difficulty: String!
    description: String
    moreInfo: String
  }
  input CourseAssigningInput{
    courseId: ID!
    tutorId: ID!
  }

  type RootQuery{
    users: [User!]
    profile: Profile!
    profilesPeek: [Profile!]
    courseAssigning:[CourseAssigning!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createUser(userInput: UserInput): User
    createProfile(profileInput: ProfileInput): Profile
    createCourse(courseInput: CourseInput): Course
    assignCourse(courseAssigningInput: CourseAssigningInput): CourseAssigning!
  }
  
  schema{
    query:RootQuery
    mutation:RootMutation
  }
`);
