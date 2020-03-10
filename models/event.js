import moment from 'moment';

class Event {
    constructor (id, ownerId, title, description, imageUri, price, eventDate) {
        this.id = id;
        this.ownerId = ownerId
        this.title = title;
        this.imageUri = imageUri;
        this.price = price;
        this.eventDate = eventDate;
        this.description = description;
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