import moment from 'moment';

class Event {
    constructor (id, ownerId, title, description, imageUri, price, eventDate, eventTime, location, attendees = {}, comments = {}) {
        this.id = id;
        this.ownerId = ownerId
        this.title = title;
        this.imageUri = imageUri;
        this.price = price;
        this.eventDate = eventDate;
        this.description = description;
        this.eventTime = eventTime;
        this.location = location
        this.attendees = attendees
        this.comments = comments
    }

    get readableDate(){
        /*return this.date.toLocaleDateString('en-EN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });*/
        return moment(this.eventDate).format('MMM Do YYYY')
    }
}

export default Event;