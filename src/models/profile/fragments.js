import gql from 'graphql-tag'
import { friendshipFragment } from '../friendship/fragments'
import locationFragment from '../location/fragments'


export const profileFragment = gql`
    fragment profileFields on ProfileType {
        id
        profilePicture
        firstName
        lastName
        description
        gender
        birthDate
        email
        friends {
            ...friendshipFields
        }
        location {
            ...locationFields
        }
    }
    ${friendshipFragment}
    ${locationFragment}
`

export const basicProfileFragment = gql `
    fragment basicProfileFields on FriendshipType {
        id
        firstName
        lastName
    }
`
