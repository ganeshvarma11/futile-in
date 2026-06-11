import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, date, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Jobs table
export const jobs = mysqlTable("jobs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  type: mysqlEnum("type", ["fresher", "experienced", "govt", "non-it"]).notNull(),
  state: text("state"),
  applyLink: text("applyLink").notNull(),
  lastDate: date("lastDate"),
  isVerified: boolean("isVerified").default(false),
  postedBy: text("postedBy"),
  isHot: boolean("isHot").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

// Resources table
export const resources = mysqlTable("resources", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["resume", "pdf", "roadmap", "youtube", "website"]).notNull(),
  link: text("link").notNull(),
  type: mysqlEnum("type", ["pdf", "video", "website", "template"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

// Resume Audits table
export const resumeAudits = mysqlTable("resumeAudits", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  jobRole: text("jobRole").notNull(),
  resumeUrl: text("resumeUrl"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "free"]).default("pending"),
  razorpayPaymentId: text("razorpayPaymentId"),
  status: mysqlEnum("status", ["pending", "in_review", "done"]).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type ResumeAudit = typeof resumeAudits.$inferSelect;
export type InsertResumeAudit = typeof resumeAudits.$inferInsert;

// Job Submissions table
export const jobSubmissions = mysqlTable("jobSubmissions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  applyLink: text("applyLink").notNull(),
  submittedByEmail: text("submittedByEmail"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type JobSubmission = typeof jobSubmissions.$inferSelect;
export type InsertJobSubmission = typeof jobSubmissions.$inferInsert;

// Interest Signups table
export const interestSignups = mysqlTable("interestSignups", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: mysqlEnum("service", ["referral", "interview"]).notNull(),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type InterestSignup = typeof interestSignups.$inferSelect;
export type InsertInterestSignup = typeof interestSignups.$inferInsert;

// Resource Requests table
export const resourceRequests = mysqlTable("resourceRequests", {
  id: varchar("id", { length: 36 }).primaryKey(),
  topic: text("topic").notNull(),
  category: mysqlEnum("category", ["resume", "interview", "aptitude", "coding", "roadmap", "career", "other"]).notNull(),
  details: text("details"),
  name: text("name"),
  email: text("email"),
  status: mysqlEnum("status", ["new", "reviewed", "published"]).default("new"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type ResourceRequest = typeof resourceRequests.$inferSelect;
export type InsertResourceRequest = typeof resourceRequests.$inferInsert;

// Memes table
export const memes = mysqlTable("memes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  caption: text("caption").notNull(),
  imageUrl: text("imageUrl"),
  instagramLink: text("instagramLink"),
  likesCount: int("likesCount").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Meme = typeof memes.$inferSelect;
export type InsertMeme = typeof memes.$inferInsert;
