import mongoose from 'mongoose';
import {User} from './user.js'
const Schema = mongoose.Schema;

const cvSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
            default: "Edit to add description"
        },
        isPrimary: {
            type: Boolean,
            default: false
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        file: {
			path: String,
			originalName: String,
			mimeType: String,
			size: Number
		},

    },
	{ timestamps: true }
);

cvSchema.statics.user_create = async function (user_id, {title, description}) {
    // user: Schema.Types.ObjectId
    // title: String
    const user = await User.findById(user_id)
    if (!user) {throw new Error("User does not exist")}
    if (!title) {throw new Error("title cannot be empty")}
    const cv = await this.create({title, description, user:user_id})
    return cv
}
export default mongoose.model('cv', cvSchema);