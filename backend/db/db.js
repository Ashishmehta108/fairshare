import mongoose from "mongoose"


const connectToDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected ✅`)
    } catch (error) {
        console.error('MongoDB connection error:❌', error)
    }
}

export default connectToDb