import gql from 'graphql-tag'
import { eventsFragment, eventFragment } from './fragments'

export const EventsQuery = gql`
    query EventsQuery($filterType: String!, $onlyFuture: Boolean, $latitude: Float, $longitude: Float, $proximity: Int, $first: Int, $skip: Int) {
        events(filterType: $filterType, onlyFuture: $onlyFuture, latitude: $latitude, longitude: $longitude, proximity: $proximity, first: $first, skip: $skip) {
            ...eventsFields
        }
    }
    ${eventsFragment}
`

export const EventQuery = gql`
	query EventQuery($id: Int!) {
		event(id: $id) {
			...eventFields
		}
    }
    ${eventFragment}
`
