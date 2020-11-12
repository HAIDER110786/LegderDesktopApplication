const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    date:{
        type: String,
        required: true,
    },
    voucher:{
        type: String,
        required: true,
    },
    Particulars:{
        type: String,
        required: true,
    },
    Qty:{
        type: String,
        required: true,
    },
    Rate:{
        type: String,
        required: true,
    },
    Debit:{
        type: String,
        required: true,
    },
    Credit:{
        type: String,
        required: true,
    },
    Balance:{
        type: String,
        required: true,
    },    
    year:{
        type: String,
        required: true,
    },
    month_year:{
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Transactions',transactionSchema);