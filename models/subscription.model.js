import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
{
    subscriber: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
},
    { timestamps: true }
);

export const subscriptionModel = mongoose.model("subscription", subscriptionSchema);