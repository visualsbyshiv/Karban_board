    const mongoose = require('mongoose');

    const taskSchema = new mongoose.Schema({
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        title: {
            type: String,
            required: [true, "Title is Required"],
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'done'],
            default: 'todo',
        },
        index: {
            type: Number,
            default: 0
        },
        priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
    },

        { timestamps: true });

    module.exports = mongoose.model('task', taskSchema); 