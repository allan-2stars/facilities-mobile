import { gql } from 'apollo-boost';

// create new user mutation
export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $password: String!
    $role: String!
    $active: Boolean!
  ) {
    createUser(
      userInput: {
        email: $email
        password: $password
        role: $role
        active: $active
      }
    ) {
      email
      role
      _id
    }
  }
`;
