const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  purchaseDate: { 
    type: Date, 
    default: Date.now 
  },
  ticketType: { 
    type: String, 
    required: true 
  },
  userDetails: { 
    type: Object, 
    required: true 
  }
});

module.exports = mongoose.model('Ticket', TicketSchema);
