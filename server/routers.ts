import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Jobs procedures
  jobs: router({
    list: publicProcedure
      .input(z.object({
        type: z.string().optional(),
        state: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getJobs(input);
      }),
    
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        company: z.string(),
        location: z.string(),
        applyLink: z.string(),
        email: z.string().email().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createJobSubmission({
          id: crypto.randomUUID(),
          title: input.title,
          company: input.company,
          location: input.location,
          applyLink: input.applyLink,
          submittedByEmail: input.email,
          status: 'pending',
        });
      }),
  }),

  // Admin jobs procedures
  adminJobs: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
      return await db.getJobs({ type: 'all' });
    }),
    
    add: protectedProcedure
      .input(z.object({
        title: z.string(),
        company: z.string(),
        location: z.string(),
        salary: z.string().optional(),
        type: z.enum(['fresher', 'experienced', 'govt', 'non-it']),
        state: z.string().optional(),
        applyLink: z.string(),
        lastDate: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.createJob({
          id: crypto.randomUUID(),
          title: input.title,
          company: input.company,
          location: input.location,
          salary: input.salary,
          type: input.type,
          state: input.state || 'All India',
          applyLink: input.applyLink,
          lastDate: input.lastDate ? new Date(input.lastDate) : undefined,
          isVerified: true,
        });
      }),
    
    verify: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.updateJob(input.id, { isVerified: true });
      }),
    
    toggleHot: protectedProcedure
      .input(z.object({ id: z.string(), isHot: z.boolean() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.updateJob(input.id, { isHot: input.isHot });
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.deleteJob(input.id);
      }),
  }),

  // Resources procedures
  resources: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getResources(input?.category);
      }),
  }),

  // Admin resources procedures
  adminResources: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
      return await db.getResources();
    }),
    
    add: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.enum(['resume', 'pdf', 'roadmap', 'youtube', 'website']),
        link: z.string(),
        type: z.enum(['pdf', 'video', 'website', 'template']),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.createResource({
          id: crypto.randomUUID(),
          ...input,
        });
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.deleteResource(input.id);
      }),
  }),

  // Memes procedures
  memes: router({
    list: publicProcedure.query(async () => {
      return await db.getMemes();
    }),
  }),

  // Admin memes procedures
  adminMemes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
      return await db.getMemes();
    }),
    
    add: protectedProcedure
      .input(z.object({
        caption: z.string(),
        imageUrl: z.string().optional(),
        instagramLink: z.string().optional(),
        likesCount: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.createMeme({
          id: crypto.randomUUID(),
          ...input,
        });
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.deleteMeme(input.id);
      }),
  }),

  // Resume audits procedures
  resumeAudits: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        jobRole: z.string(),
        razorpayPaymentId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createResumeAudit({
          id: crypto.randomUUID(),
          name: input.name,
          email: input.email,
          jobRole: input.jobRole,
          razorpayPaymentId: input.razorpayPaymentId,
          paymentStatus: input.razorpayPaymentId ? 'paid' : 'free',
          status: 'pending',
        });
        
        // Notify owner
        await notifyOwner({
          title: 'New Resume Audit Request',
          content: `New resume audit from ${input.name} (${input.email}) for ${input.jobRole} role.`,
        });
        
        return { success: true };
      }),
  }),

  // Admin resume audits procedures
  adminResumeAudits: router({
    list: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return await db.getResumeAudits(input?.status);
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(['pending', 'in_review', 'done']),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.updateResumeAudit(input.id, { status: input.status });
      }),
    
    addNotes: protectedProcedure
      .input(z.object({
        id: z.string(),
        notes: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.updateResumeAudit(input.id, { notes: input.notes });
      }),
  }),

  // Job submissions procedures
  jobSubmissions: router({
    list: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return await db.getJobSubmissions(input?.status);
      }),
    
    approve: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        const submissions = await db.getJobSubmissions();
        const job = submissions.find(j => j.id === input.id);
        if (job) {
          await db.createJob({
            id: crypto.randomUUID(),
            title: job.title,
            company: job.company,
            location: job.location || '',
            applyLink: job.applyLink,
            type: 'fresher',
            isVerified: true,
          });
          await db.updateJobSubmission(input.id, { status: 'approved' });
        }
      }),
    
    reject: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.updateJobSubmission(input.id, { status: 'rejected' });
      }),
  }),

  // Interest signups procedures
  interestSignups: router({
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        service: z.enum(['referral', 'interview']),
        details: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createInterestSignup({
          id: crypto.randomUUID(),
          ...input,
        });
      }),
  }),

  // Resource request procedures
  resourceRequests: router({
    create: publicProcedure
      .input(z.object({
        topic: z.string().min(3).max(160),
        category: z.enum(['resume', 'interview', 'aptitude', 'coding', 'roadmap', 'career', 'other']),
        details: z.string().max(1200).optional(),
        name: z.string().max(120).optional(),
        email: z.string().email().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createResourceRequest({
          id: crypto.randomUUID(),
          topic: input.topic,
          category: input.category,
          details: input.details,
          name: input.name,
          email: input.email,
          status: 'new',
        });

        return { success: true };
      }),
  }),

  // Admin interest signups procedures
  adminInterestSignups: router({
    list: protectedProcedure
      .input(z.object({ service: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return await db.getInterestSignups(input?.service);
      }),
  }),

  // Admin resource request procedures
  adminResourceRequests: router({
    list: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return await db.getResourceRequests(input?.status);
      }),
  }),

  // Admin stats procedures
  adminStats: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
      const jobsData = await db.getJobs();
      const auditsData = await db.getResumeAudits();
      const signupsData = await db.getInterestSignups();
      const memesData = await db.getMemes();
      const resourcesData = await db.getResources();
      
      return {
        totalJobs: jobsData.length,
        totalAudits: auditsData.length,
        paidAudits: auditsData.filter(a => a.paymentStatus === 'paid').length,
        freeAudits: auditsData.filter(a => a.paymentStatus === 'free').length,
        totalSignups: signupsData.length,
        referralSignups: signupsData.filter(s => s.service === 'referral').length,
        interviewSignups: signupsData.filter(s => s.service === 'interview').length,
        totalMemes: memesData.length,
        totalResources: resourcesData.length,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
