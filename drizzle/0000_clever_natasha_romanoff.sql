CREATE TABLE `lmt_events` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`span` text NOT NULL,
	`version` integer NOT NULL,
	`payload` text NOT NULL,
	`author` text NOT NULL,
	`received_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lmt_owner_span_version` ON `lmt_events` (`owner`,`span`,`version`);--> statement-breakpoint
CREATE INDEX `lmt_owner_events` ON `lmt_events` (`owner`);