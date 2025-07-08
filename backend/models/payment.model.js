import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    clgName: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true
    },
    paymentId: {
        type: String,
        required: function () {
            return this.paymentMethod === 'Online';
        }
    }
}, { timestamps: true });

const PaymentModel = mongoose.model('Payment', paymentSchema);
export default PaymentModel;
