import mongoose from "mongoose";
import { config } from "dotenv";

config();

class DatabaseService {
  constructor() {
    this.uri = process.env.BASE_URI;
  }
  async connect() {
    try {
      await mongoose.connect(this.uri);
      console.log(`MongoDB connect successfully`);
    } catch (err) {
      return err;
    }
  }
}

const databaseService = new DatabaseService();

export default databaseService;