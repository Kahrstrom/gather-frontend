import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Tooltip from '@material-ui/core/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import StarIcon from '@material-ui/icons/Star'
import NotInterestedIcon from '@material-ui/icons/NotInterested'
import CheckIcon from '@material-ui/icons/Check'
import EditIcon from '@material-ui/icons/Edit'
import { withStyles } from '@material-ui/core/styles'
import { toDate } from 'date-fns'

import { DeleteEventMutation } from 'models/event/mutations'
import { CreateParticipantMutation, UpdateParticipantMutation } from 'models/participant/mutations'
import { EventsQuery } from 'models/event/queries'
import YesNoAlert from '../../../../YesNoAlert/YesNoAlert'

const styles = theme => (
    {
        oldEvent: {
            marginRight: theme.spacing.unit*4,
            color: 'rgba(0,0,0,0.3)'
        },
        hovered: {
            backgroundColor: '#EBEBEB',
        }
    }
)

class EventListItem extends Component {

    state = {
        anchorEl: null,
        participant: null,
        deleteAlertOpen: false,
    }

    handleEditEvent(event) {
        this.handleCloseMenu()
        this.props.history.push(`/events/${event.id}/edit`)
    }

    handleOpenMenu(event) {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleCloseMenu() {
        this.setState({ anchorEl: null })
    }

    handleOpenDeleteAlert() {
        this.setState({deleteAlertOpen: true})
    }

    handleCloseDeleteAlert() {
        this.setState({deleteAlertOpen: false})
        this.handleCloseMenu()
    }

    async handleDelete() {
        try {
            await this.props.DeleteEventMutation({
                variables: {
                    id: this.props.event.id,
                },
                update: (store, { data: { deleteEvent: { id } } } ) => {

                    const variables = JSON.parse(localStorage.getItem('eventFilter'))

                    const { events } = store.readQuery({
                        query: EventsQuery,
                        variables
                    })

                    store.writeQuery({
                        query: EventsQuery,
                        data: { events: events.filter(event => event.id != id) },
                        variables
                    })
                }
            })
        } catch(e) {
            console.log(e)
        }
    }

    async handleEventParticipation(status) {
        try {
            if (this.state.participant) {
                await this.updateParticipant(this.state.participant.id, status)
            }
            else {
                await this.createParticipant(status)
            }
            this.handleCloseMenu()
        } catch (e) {
            console.log(e)
        }
    }

    async createParticipant(status) {
        try {
            await this.props.CreateParticipantMutation({
                variables: {
                    id: this.props.event.id,
                    status
                }
            })
            this.handleCloseMenu()
        } catch (e) {
            throw new Error(e)
        }
    }

    async updateParticipant(id, status) {
        try {
            await this.props.UpdateParticipantMutation({
                variables: {
                    id: id,
                    status
                }
            })
            this.handleCloseMenu()
        } catch (e) {
            throw new Error(e)
        }
    }

    componentWillMount() {

        const participant = this.props.event.participants.find(participant => (
            participant.user.id === this.props.session.id
        ))
        this.setState({
            ...this.state,
            participant
        })

    }

    render() {
        const { classes, event, session, hovered } = this.props

        const {
            title,
            startDate,
            startTime,
            minParticipants,
            maxParticipants,
            participants,
            location: {
                city
            },
        } = event

        const { anchorEl } = this.state
        const open = Boolean(anchorEl)
        const secondaryText = `${city} - ${startDate} ${startTime.substring(0,5)}`
        const nbrGoing = participants.filter(participant => participant.status === 'GOING').length
        const tooltip = `${nbrGoing} ${nbrGoing === 1 ? 'is' : 'are'} going to this event for ${minParticipants} to ${maxParticipants} participants!`
        return (
            <div>
                <ListItem className={hovered ? classes.hovered : ''} onClick={() => this.props.handleSelectEvent(event)} onMouseEnter={() => this.props.handleMouseEnter(event)} onMouseLeave={() => this.props.handleMouseLeave()} button>
                    <Tooltip title={tooltip} placement="right">
                        <Avatar>{maxParticipants}</Avatar>
                    </Tooltip>
                    <ListItemText primary={title} secondary={secondaryText} />
                    { toDate(event.startDate) < new Date() && <Chip label="Old event" className={classes.oldEvent} /> }
                    <ListItemSecondaryAction>
                        { session.id &&
                        <IconButton aria-owns={open ? `menu-event-item-${event.id}` : null}
                            aria-haspopup="true"
                            onClick={this.handleOpenMenu.bind(this)}
                            color="inherit">
                            <MoreVertIcon />
                        </IconButton>
                        }
                        {
                            session.id === event.organizer.id
                            ? this.renderOrganizerList(event, anchorEl, open)
                            : this.renderUserList(event, anchorEl, open)
                        }
                    </ListItemSecondaryAction>
                </ListItem>
                {this.renderDeleteAlert()}
            </div>
        )
    }

    renderDeleteAlert() {
        return (
            <YesNoAlert
                open={this.state.deleteAlertOpen}
                title="Are you sure?"
                description="This will permanently delete this event"
                handleYes={this.handleDelete.bind(this)}
                handleNo={this.handleCloseDeleteAlert.bind(this)}
            />
        )
    }

    renderOrganizerList(event, anchorEl, open) {
        return (
            <Menu
                id={`menu-event-item-${event.id}`}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={this.handleCloseMenu.bind(this)}>
                <MenuItem onClick={this.handleOpenDeleteAlert.bind(this)}>
                    <ListItemIcon>
                        <DeleteForeverIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Delete" />
                </MenuItem>
                <MenuItem onClick={() => this.handleEditEvent(event)}>
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Edit" />
                </MenuItem>
            </Menu>
        )
    }

    renderUserList(event, anchorEl, open) {
        return (
            <Menu
                id={`menu-event-item-${event.id}`}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={this.handleCloseMenu.bind(this)}>
                <MenuItem onClick={() => this.handleEventParticipation('INTERESTED')}>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="This looks interesting!" />
                </MenuItem>
                <MenuItem onClick={() => this.handleEventParticipation('GOING')}>
                    <ListItemIcon>
                        <CheckIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="I'm going!" />
                </MenuItem>
                <MenuItem onClick={() => this.handleEventParticipation('NOTGOING')}>
                    <ListItemIcon>
                        <NotInterestedIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Not going :(" />
                </MenuItem>
            </Menu>
        )
    }
}

export default withRouter(withStyles(styles)(compose(
    graphql(DeleteEventMutation, { name: 'DeleteEventMutation' }),
    graphql(CreateParticipantMutation, { name: 'CreateParticipantMutation' }),
    graphql(UpdateParticipantMutation, { name: 'UpdateParticipantMutation' }),
)(EventListItem)))