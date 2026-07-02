-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VISITOR', 'USER', 'EDITOR', 'HISTORIAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'AI_REVIEW', 'EDITOR_REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('G', 'KG', 'ML', 'L', 'TSP', 'TBSP', 'CUP', 'PIECE', 'PINCH', 'SLICE', 'BUNCH');

-- CreateEnum
CREATE TYPE "AlternativeType" AS ENUM ('HISTORICAL', 'MODERN', 'VEGAN', 'VEGETARIAN', 'GLUTEN_FREE', 'LACTOSE_FREE', 'ECONOMIC', 'LOCAL', 'SAME_AROMA', 'SAME_TEXTURE');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('MANUSCRIPT', 'BOOK', 'ACADEMIC_PAPER', 'ARCHIVE', 'ORAL_HISTORY', 'WEBSITE');

-- CreateEnum
CREATE TYPE "AIJobType" AS ENUM ('CHEF_CHAT', 'CONTENT_GENERATION', 'HISTORICAL_VALIDATION', 'TRANSLATION', 'SEO_WRITING', 'ALTERNATIVE_EXPLANATION', 'IMAGE_GENERATION', 'QUALITY_CONTROL');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'DONE', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'CONTENT', 'NEWSLETTER', 'MODERATION');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'ARCHIVE', 'ROLE_CHANGE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'tr',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "userId" UUID,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "iso2" CHAR(2) NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryTranslation" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CountryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionTranslation" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RegionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "regionId" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityTranslation" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CityTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Civilization" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startYear" INTEGER,
    "endYear" INTEGER,

    CONSTRAINT "Civilization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CivilizationTranslation" (
    "id" TEXT NOT NULL,
    "civilizationId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CivilizationTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dynasty" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "civilizationId" TEXT NOT NULL,
    "startYear" INTEGER,
    "endYear" INTEGER,

    CONSTRAINT "Dynasty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DynastyTranslation" (
    "id" TEXT NOT NULL,
    "dynastyId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DynastyTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Era" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "civilizationId" TEXT,
    "dynastyId" TEXT,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,

    CONSTRAINT "Era_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EraTranslation" (
    "id" TEXT NOT NULL,
    "eraId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "EraTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "eraId" TEXT,
    "recipeId" TEXT,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEventTranslation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "TimelineEventTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuisine" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Cuisine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuisineTranslation" (
    "id" TEXT NOT NULL,
    "cuisineId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CuisineTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryTranslation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagTranslation" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TagTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeTag" (
    "recipeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "RecipeTag_pkey" PRIMARY KEY ("recipeId","tagId")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "cuisineId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "cityId" TEXT,
    "eraId" TEXT,
    "civilizationId" TEXT,
    "categoryId" TEXT,
    "authorId" TEXT NOT NULL,
    "heroImageId" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "prepMinutes" INTEGER NOT NULL,
    "cookMinutes" INTEGER NOT NULL,
    "restMinutes" INTEGER,
    "servings" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeTranslation" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "history" TEXT,
    "metaTitle" TEXT,
    "metaDesc" TEXT,

    CONSTRAINT "RecipeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "durationMinutes" INTEGER,

    CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeStepTranslation" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,

    CONSTRAINT "RecipeStepTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "seasonality" TEXT,
    "isAllergen" BOOLEAN NOT NULL DEFAULT false,
    "nutritionPer100g" JSONB,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientTranslation" (
    "id" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "IngredientTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientAlternative" (
    "id" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "alternativeId" TEXT NOT NULL,
    "type" "AlternativeType" NOT NULL,
    "ratio" DECIMAL(6,3) NOT NULL DEFAULT 1.0,
    "aiExplanation" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IngredientAlternative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unit" "Unit" NOT NULL,
    "note" TEXT,
    "groupLabel" TEXT,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nutrition" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "proteinG" DECIMAL(6,2) NOT NULL,
    "fatG" DECIMAL(6,2) NOT NULL,
    "carbsG" DECIMAL(6,2) NOT NULL,
    "fiberG" DECIMAL(6,2),
    "sugarG" DECIMAL(6,2),
    "sodiumMg" INTEGER,
    "isAiEstimated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Nutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricalSource" (
    "id" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "year" INTEGER,
    "url" TEXT,
    "reliability" INTEGER NOT NULL DEFAULT 3,
    "notes" TEXT,

    CONSTRAINT "HistoricalSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeSource" (
    "recipeId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "citation" TEXT,

    CONSTRAINT "RecipeSource_pkey" PRIMARY KEY ("recipeId","sourceId")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT,
    "storagePath" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "blurDataUrl" TEXT,
    "credit" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "userId" UUID NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId","recipeId")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionRecipe" (
    "collectionId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionRecipe_pkey" PRIMARY KEY ("collectionId","recipeId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptHistory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "template" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIJob" (
    "id" TEXT NOT NULL,
    "type" "AIJobType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "promptHistoryId" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "costUsd" DECIMAL(10,5),
    "result" JSONB,
    "error" TEXT,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AIJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'tr',
    "token" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "detail" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" UUID,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Author_userId_key" ON "Author"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Country_slug_key" ON "Country"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Country_iso2_key" ON "Country"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "CountryTranslation_countryId_locale_key" ON "CountryTranslation"("countryId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE INDEX "Region_countryId_idx" ON "Region"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "RegionTranslation_regionId_locale_key" ON "RegionTranslation"("regionId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE INDEX "City_countryId_idx" ON "City"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "CityTranslation_cityId_locale_key" ON "CityTranslation"("cityId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Civilization_slug_key" ON "Civilization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CivilizationTranslation_civilizationId_locale_key" ON "CivilizationTranslation"("civilizationId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Dynasty_slug_key" ON "Dynasty"("slug");

-- CreateIndex
CREATE INDEX "Dynasty_civilizationId_idx" ON "Dynasty"("civilizationId");

-- CreateIndex
CREATE UNIQUE INDEX "DynastyTranslation_dynastyId_locale_key" ON "DynastyTranslation"("dynastyId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Era_slug_key" ON "Era"("slug");

-- CreateIndex
CREATE INDEX "Era_startYear_idx" ON "Era"("startYear");

-- CreateIndex
CREATE UNIQUE INDEX "EraTranslation_eraId_locale_key" ON "EraTranslation"("eraId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "TimelineEvent_slug_key" ON "TimelineEvent"("slug");

-- CreateIndex
CREATE INDEX "TimelineEvent_year_idx" ON "TimelineEvent"("year");

-- CreateIndex
CREATE UNIQUE INDEX "TimelineEventTranslation_eventId_locale_key" ON "TimelineEventTranslation"("eventId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Cuisine_slug_key" ON "Cuisine"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CuisineTranslation_cuisineId_locale_key" ON "CuisineTranslation"("cuisineId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_locale_key" ON "CategoryTranslation"("categoryId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TagTranslation_tagId_locale_key" ON "TagTranslation"("tagId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_slug_key" ON "Recipe"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_heroImageId_key" ON "Recipe"("heroImageId");

-- CreateIndex
CREATE INDEX "Recipe_cuisineId_status_publishedAt_idx" ON "Recipe"("cuisineId", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "Recipe_countryId_eraId_idx" ON "Recipe"("countryId", "eraId");

-- CreateIndex
CREATE INDEX "Recipe_status_scheduledAt_idx" ON "Recipe"("status", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTranslation_recipeId_locale_key" ON "RecipeTranslation"("recipeId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeStep_recipeId_sortOrder_key" ON "RecipeStep"("recipeId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeStepTranslation_stepId_locale_key" ON "RecipeStepTranslation"("stepId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_slug_key" ON "Ingredient"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientTranslation_ingredientId_locale_key" ON "IngredientTranslation"("ingredientId", "locale");

-- CreateIndex
CREATE INDEX "IngredientAlternative_ingredientId_type_idx" ON "IngredientAlternative"("ingredientId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientAlternative_ingredientId_alternativeId_type_key" ON "IngredientAlternative"("ingredientId", "alternativeId", "type");

-- CreateIndex
CREATE INDEX "RecipeIngredient_ingredientId_idx" ON "RecipeIngredient"("ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipeId_sortOrder_key" ON "RecipeIngredient"("recipeId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Nutrition_recipeId_key" ON "Nutrition"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Gallery_recipeId_key" ON "Gallery"("recipeId");

-- CreateIndex
CREATE INDEX "Collection_userId_idx" ON "Collection"("userId");

-- CreateIndex
CREATE INDEX "Comment_recipeId_status_idx" ON "Comment"("recipeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PromptHistory_name_version_key" ON "PromptHistory"("name", "version");

-- CreateIndex
CREATE INDEX "AIJob_type_status_createdAt_idx" ON "AIJob"("type", "status", "createdAt");

-- CreateIndex
CREATE INDEX "AIJob_entityType_entityId_idx" ON "AIJob"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_token_key" ON "NewsletterSubscriber"("token");

-- CreateIndex
CREATE INDEX "AdminLog_userId_createdAt_idx" ON "AdminLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "AuditLog"("entityType", "entityId", "createdAt");

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryTranslation" ADD CONSTRAINT "CountryTranslation_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionTranslation" ADD CONSTRAINT "RegionTranslation_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityTranslation" ADD CONSTRAINT "CityTranslation_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CivilizationTranslation" ADD CONSTRAINT "CivilizationTranslation_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dynasty" ADD CONSTRAINT "Dynasty_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynastyTranslation" ADD CONSTRAINT "DynastyTranslation_dynastyId_fkey" FOREIGN KEY ("dynastyId") REFERENCES "Dynasty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Era" ADD CONSTRAINT "Era_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Era" ADD CONSTRAINT "Era_dynastyId_fkey" FOREIGN KEY ("dynastyId") REFERENCES "Dynasty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EraTranslation" ADD CONSTRAINT "EraTranslation_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "Era"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "Era"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEventTranslation" ADD CONSTRAINT "TimelineEventTranslation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TimelineEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuisineTranslation" ADD CONSTRAINT "CuisineTranslation_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "Cuisine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagTranslation" ADD CONSTRAINT "TagTranslation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "Cuisine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "Era"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTranslation" ADD CONSTRAINT "RecipeTranslation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStepTranslation" ADD CONSTRAINT "RecipeStepTranslation_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "RecipeStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientTranslation" ADD CONSTRAINT "IngredientTranslation_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientAlternative" ADD CONSTRAINT "IngredientAlternative_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientAlternative" ADD CONSTRAINT "IngredientAlternative_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrition" ADD CONSTRAINT "Nutrition_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSource" ADD CONSTRAINT "RecipeSource_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSource" ADD CONSTRAINT "RecipeSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "HistoricalSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionRecipe" ADD CONSTRAINT "CollectionRecipe_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionRecipe" ADD CONSTRAINT "CollectionRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIJob" ADD CONSTRAINT "AIJob_promptHistoryId_fkey" FOREIGN KEY ("promptHistoryId") REFERENCES "PromptHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIJob" ADD CONSTRAINT "AIJob_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
