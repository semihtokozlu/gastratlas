-- AI görsel üretimi politikası (K5) açıldı — Image tablosuna açıklama alanı ekleniyor.
ALTER TABLE "Image" ADD COLUMN "isAiGenerated" BOOLEAN NOT NULL DEFAULT false;
