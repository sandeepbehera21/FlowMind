import { MongoClient, type Collection, type Document, type Filter, type OptionalUnlessRequiredId } from "mongodb";
import { env } from "../utils/env.js";
import { logger } from "../utils/logger.js";

export class DbService {
  private client?: MongoClient;

  async connect(): Promise<void> {
    if (this.client) return;
    this.client = new MongoClient(env.MONGODB_URI);
    await this.client.connect();
    logger.info("database.connected");
  }

  collection<T extends Document>(name: string): Collection<T> {
    if (!this.client) throw new Error("Database not connected");
    return this.client.db().collection<T>(name);
  }

  async upsert<T extends Document>(collectionName: string, id: string, doc: T): Promise<void> {
    await this.collection<T>(collectionName).updateOne({ id } as unknown as Filter<T>, { $set: doc }, { upsert: true });
  }

  async insertMany<T extends Document>(collectionName: string, docs: T[]): Promise<void> {
    if (docs.length === 0) return;
    await this.collection<T>(collectionName).insertMany(docs as OptionalUnlessRequiredId<T>[]);
  }

  isConnected(): boolean {
    return !!this.client;
  }
}

export const dbService = new DbService();
