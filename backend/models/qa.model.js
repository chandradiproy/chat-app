import mongoose from 'mongoose';


const qaSchema = new mongoose.Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
},
{
    timestamps: true,
});

const QA = mongoose.model('QA', qaSchema);

export default QA;
