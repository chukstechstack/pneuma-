import { 
  pgTable, 
  serial, 
  text, 
  uuid, 
  integer, 
  timestamp, 
  index, 
  unique, 
  pgEnum, 
  json, 
  varchar, 
  boolean
} from "drizzle-orm/pg-core";


export const interactionTypeEnum = pgEnum("interaction_type_enum", ["like", "repost", "share"]);


export const profiles = pgTable(
  "profiles",
  {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().unique(),
    username: text("username").notNull(),
    password: text("password"),
    fullName: text("full_name").notNull(), // Combined into a single required column
    country: text("country"),
    email: text("email").notNull().unique(),
    googleId: text("google_id"),
    avatarUrl: text("avatar_url"),
    followersCount: integer("followers_count").default(0),
    followingCount: integer("following_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_profiles_email").on(table.email),
    index("idx_profiles_uuid").on(table.uuid),
  ]
);

// 2. CONTENT TABLE
export const content = pgTable(
  "content",
  {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().unique(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    img: text("img"),
    category: text("category").notNull(),
    tags: text("tags").array().notNull(),
    userId: integer("user_id").references(() => profiles.id, { onDelete: "cascade" }),
    likesCount: integer("likes_count").default(0),
    repostsCount: integer("reposts_count").default(0),
    sharesCount: integer("shares_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_content_user_id").on(table.userId),
    index("idx_content_uuid").on(table.uuid),
    index("idx_content_tags").on(table.tags),
    index("idx_content_created_at_desc").on(table.createdAt.desc()),
    index("idx_content_user_created_at").on(table.userId, table.createdAt.desc()),
  ]
);

// 3. SESSION TABLE
export const session = pgTable(
  "session",
  {
    sid: varchar("sid").primaryKey().notNull(),
    sess: json("sess").notNull(),
    expire: timestamp("expire", { precision: 6 }).notNull(),
  },
  (table) => [
    index("IDX_session_expire").on(table.expire),
  ]
);

// 4. INTERACTIONS TABLE
export const interactions = pgTable(
  "interactions",
  {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().unique(),
    userId: integer("user_id").references(() => profiles.id, { onDelete: "cascade" }),
    contentId: integer("content_id").references(() => content.id, { onDelete: "cascade" }),
    interactionType: interactionTypeEnum("interaction_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("interactions_user_id_content_id_interaction_type_key").on(table.userId, table.contentId, table.interactionType),
    index("idx_interactions_user_id").on(table.userId),
    index("idx_interactions_content_id").on(table.contentId),
    index("idx_interactions_lookup_composite").on(table.userId, table.contentId, table.interactionType),
  ]
);

// 5. FOLLOWS TABLE
export const follows = pgTable(
  "follows",
  {
    id: serial("id").primaryKey(),
    followerId: integer("follower_id").references(() => profiles.id, { onDelete: "cascade" }),
    followingId: integer("following_id").references(() => profiles.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("follows_follower_id_following_id_key").on(table.followerId, table.followingId),
    index("idx_follows_follower_following").on(table.followerId, table.followingId),
    index("idx_follows_reverse_lookup").on(table.followingId, table.followerId),
  ]
);

// 6. CONVERSATIONS TABLE
export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  }
);

// 7. CONVERSATION PARTICIPANTS TABLE
export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    id: serial("id").primaryKey(),
    conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("conversation_participants_conversation_id_user_id_key").on(table.conversationId, table.userId),
  ]
);

// 8. MESSAGES TABLE
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    senderId: integer("sender_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    messageText: text("message_text").notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  }
);