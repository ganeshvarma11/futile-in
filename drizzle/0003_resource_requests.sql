CREATE TABLE `resourceRequests` (
	`id` varchar(36) NOT NULL,
	`topic` text NOT NULL,
	`category` enum('resume','interview','aptitude','coding','roadmap','career','other') NOT NULL,
	`details` text,
	`name` text,
	`email` text,
	`status` enum('new','reviewed','published') DEFAULT 'new',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `resourceRequests_id` PRIMARY KEY(`id`)
);
