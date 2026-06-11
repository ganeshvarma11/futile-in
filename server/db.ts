import { eq, desc, or, like, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, jobs, InsertJob, resources, InsertResource, memes, InsertMeme, resumeAudits, InsertResumeAudit, jobSubmissions, InsertJobSubmission, interestSignups, InsertInterestSignup, resourceRequests, InsertResourceRequest } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Jobs queries
export async function getJobs(filters?: { type?: string; state?: string; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(jobs.isVerified, true)];
  
  if (filters?.type && filters.type !== 'all') {
    conditions.push(eq(jobs.type, filters.type as any));
  }
  if (filters?.state && filters.state !== 'All India') {
    conditions.push(eq(jobs.state, filters.state));
  }
  if (filters?.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(jobs.title, searchTerm),
        like(jobs.company, searchTerm),
        like(jobs.location, searchTerm)
      )!
    );
  }
  
  return await db.select().from(jobs).where(and(...conditions)).orderBy(desc(jobs.createdAt));
}

export async function getJobById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result[0];
}

export async function createJob(data: InsertJob) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(jobs).values(data);
}

export async function updateJob(id: string, data: Partial<InsertJob>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.update(jobs).set(data).where(eq(jobs.id, id));
}

export async function deleteJob(id: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.delete(jobs).where(eq(jobs.id, id));
}

// Resources queries
export async function getResources(category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (category && category !== 'all') {
    return await db.select().from(resources).where(eq(resources.category, category as any)).orderBy(desc(resources.createdAt));
  }
  return await db.select().from(resources).orderBy(desc(resources.createdAt));
}

export async function createResource(data: InsertResource) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(resources).values(data);
}

export async function deleteResource(id: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.delete(resources).where(eq(resources.id, id));
}

// Memes queries
export async function getMemes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(memes).orderBy(desc(memes.createdAt));
}

export async function createMeme(data: InsertMeme) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(memes).values(data);
}

export async function deleteMeme(id: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.delete(memes).where(eq(memes.id, id));
}

// Resume Audits queries
export async function getResumeAudits(status?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (status) {
    return await db.select().from(resumeAudits).where(eq(resumeAudits.status, status as any)).orderBy(desc(resumeAudits.createdAt));
  }
  return await db.select().from(resumeAudits).orderBy(desc(resumeAudits.createdAt));
}

export async function createResumeAudit(data: InsertResumeAudit) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(resumeAudits).values(data);
}

export async function updateResumeAudit(id: string, data: Partial<InsertResumeAudit>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.update(resumeAudits).set(data).where(eq(resumeAudits.id, id));
}

// Job Submissions queries
export async function getJobSubmissions(status?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (status) {
    return await db.select().from(jobSubmissions).where(eq(jobSubmissions.status, status as any)).orderBy(desc(jobSubmissions.createdAt));
  }
  return await db.select().from(jobSubmissions).orderBy(desc(jobSubmissions.createdAt));
}

export async function createJobSubmission(data: InsertJobSubmission) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(jobSubmissions).values(data);
}

export async function updateJobSubmission(id: string, data: Partial<InsertJobSubmission>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.update(jobSubmissions).set(data).where(eq(jobSubmissions.id, id));
}

// Interest Signups queries
export async function getInterestSignups(service?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (service) {
    return await db.select().from(interestSignups).where(eq(interestSignups.service, service as any)).orderBy(desc(interestSignups.createdAt));
  }
  return await db.select().from(interestSignups).orderBy(desc(interestSignups.createdAt));
}

export async function createInterestSignup(data: InsertInterestSignup) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(interestSignups).values(data);
}

// Resource request queries
export async function getResourceRequests(status?: string) {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return await db.select().from(resourceRequests).where(eq(resourceRequests.status, status as any)).orderBy(desc(resourceRequests.createdAt));
  }
  return await db.select().from(resourceRequests).orderBy(desc(resourceRequests.createdAt));
}

export async function createResourceRequest(data: InsertResourceRequest) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(resourceRequests).values(data);
}
