-- CreateTable
CREATE TABLE "AiError" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorType" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "stackTrace" TEXT,
    "inputPreview" TEXT,
    "status" INTEGER,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiError_errorType_idx" ON "AiError"("errorType");

-- CreateIndex
CREATE INDEX "AiError_timestamp_idx" ON "AiError"("timestamp");

-- CreateIndex
CREATE INDEX "AiError_modelName_idx" ON "AiError"("modelName"); 