import mongoose, { Document, Schema } from 'mongoose';
import { TASK_STATUS, TASK_PRIORITY } from '../config/constants';

export interface ITask extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: typeof TASK_STATUS[keyof typeof TASK_STATUS];
    priority?: typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];
    dueDate?: Date;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters'],
            maxlength: [200, 'Title must not exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description must not exceed 2000 characters'],
        },
        status: {
            type: String,
            enum: {
                values: Object.values(TASK_STATUS),
                message: '{VALUE} is not a valid status',
            },
            default: TASK_STATUS.PENDING,
        },
        priority: {
            type: String,
            enum: {
                values: Object.values(TASK_PRIORITY),
                message: '{VALUE} is not a valid priority',
            },
            default: TASK_PRIORITY.MEDIUM,
        },
        dueDate: {
            type: Date,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (_doc, ret) {
                delete (ret as { __v?: number }).__v;
                return ret;
            },
        },
    }
);

// Compound indexes for optimized queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, dueDate: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
