# futile.in Project TODO

## Database & Backend
- [x] Create Drizzle schema for jobs, resources, memes, resume_audits, job_submissions, interest_signups tables
- [x] Generate and apply database migrations
- [x] Create tRPC procedures for jobs CRUD
- [x] Create tRPC procedures for resources CRUD
- [x] Create tRPC procedures for memes CRUD
- [x] Create tRPC procedures for resume_audits management
- [x] Create tRPC procedures for job_submissions handling
- [x] Create tRPC procedures for interest_signups
- [x] Create tRPC procedures for admin stats
- [ ] Create tRPC procedures for admin password verification
- [ ] Set up Razorpay payment integration endpoints

## Global Components
- [ ] Build Navbar component with mobile hamburger menu
- [ ] Build Footer component with links
- [ ] Build responsive layout wrapper

## Pages
- [x] Home page with hero, featured jobs, memes, services grid, PrepBros CTA
- [x] Jobs page (stub)
- [x] Memes page (stub)
- [x] Resources page (stub)
- [x] Services page (stub)
- [x] PrepBros page (stub)
- [x] Admin panel (stub)

## Features
- [ ] Implement Razorpay payment flow for ₹149 resume audit
- [ ] Resume upload to file storage after payment
- [ ] Owner notification emails for new audit submissions
- [ ] Job submission form and modal
- [ ] Interest signup forms for referral and mock interview
- [ ] Admin job verification and hot badge management
- [ ] Admin resume audit status tracking
- [ ] Admin resource and meme management
- [ ] CSV export for interest signups
- [ ] Stats dashboard showing totals

## Styling & UX
- [x] Apply dark theme (#0f0f0f background, #E85D26 accent)
- [ ] Mobile responsive design on all pages
- [ ] Sticky mobile bottom bar with WhatsApp CTA
- [ ] Loading states and error handling
- [ ] Empty states for all grids

## Testing & Deployment
- [ ] Test all database operations
- [ ] Test payment flow with Razorpay
- [ ] Test admin panel functionality
- [ ] Test mobile responsiveness
- [ ] Create checkpoint for delivery
