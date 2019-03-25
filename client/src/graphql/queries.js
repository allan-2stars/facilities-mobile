import { gql } from 'apollo-boost';

// Login query
export const LOG_IN = gql`
  query($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;
