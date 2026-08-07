import mongoose from 'mongoose'

const Schema = mongoose.Schema

const postSchema = new Schema(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		authorName: {
			type: String,
			required: true
		},
		title: {
			type: String,
			default: ''
		},
		content: {
			type: String,
			required: true
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'user'
			}
		],
		comments: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: 'user'
				},
				userName: String,
				text: String,
				createdAt: {
					type: Date,
					default: Date.now
				}
			}
		],
		saves: [
			{
				type: Schema.Types.ObjectId,
				ref: 'user'
			}
		]
	},
	{ timestamps: true }
)

// FR-10: Virtual property or method for engagement counts
postSchema.methods.getEngagementCounts = function () {
	return {
		totalLikes: this.likes ? this.likes.length : 0,
		totalComments: this.comments ? this.comments.length : 0,
		totalSaves: this.saves ? this.saves.length : 0
	}
}

export default mongoose.model('post', postSchema)
