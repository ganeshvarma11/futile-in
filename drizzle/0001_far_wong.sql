CREATE TABLE `interestSignups` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`name` text NOT NULL,
	`email` text NOT NULL,
	`service` enum('referral','interview') NOT NULL,
	`details` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `interestSignups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobSubmissions` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text,
	`applyLink` text NOT NULL,
	`submittedByEmail` text,
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `jobSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text NOT NULL,
	`salary` text,
	`type` enum('fresher','experienced','govt','non-it') NOT NULL,
	`state` text DEFAULT ('All India'),
	`applyLink` text NOT NULL,
	`lastDate` date,
	`isVerified` boolean DEFAULT false,
	`postedBy` text DEFAULT ('admin'),
	`isHot` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memes` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`caption` text NOT NULL,
	`imageUrl` text,
	`instagramLink` text,
	`likesCount` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `memes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`title` text NOT NULL,
	`description` text,
	`category` enum('resume','pdf','roadmap','youtube','website') NOT NULL,
	`link` text NOT NULL,
	`type` enum('pdf','video','website','template') NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resumeAudits` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`name` text NOT NULL,
	`email` text NOT NULL,
	`jobRole` text NOT NULL,
	`resumeUrl` text,
	`paymentStatus` enum('pending','paid','free') DEFAULT 'pending',
	`razorpayPaymentId` text,
	`status` enum('pending','in_review','done') DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `resumeAudits_id` PRIMARY KEY(`id`)
);
