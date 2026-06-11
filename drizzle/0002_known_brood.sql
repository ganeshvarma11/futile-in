ALTER TABLE `interestSignups` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `jobSubmissions` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `state` text;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `postedBy` text;--> statement-breakpoint
ALTER TABLE `memes` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `resources` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `resumeAudits` MODIFY COLUMN `id` varchar(36) NOT NULL;