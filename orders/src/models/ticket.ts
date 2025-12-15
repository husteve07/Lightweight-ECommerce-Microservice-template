import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";


interface TicketAttrs {
    title: string;
    price: number;
}



export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved() : Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            const { _id, ...rest } = ret;
            return { id: _id, ...rest };
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function() {
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await mongoose.model('Order').findOne({
        ticket: this,
        status: {
            $in: [
                'created',
                'awaiting:payment',
                'complete'
            ]
        }
    });     
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket }