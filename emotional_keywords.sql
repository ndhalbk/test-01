-- 1. جدول الكلمات المفتاحية العاطفية (Emotional Keywords Bank)
CREATE TABLE emotional_keywords (
    id SERIAL PRIMARY KEY,
    keyword_tn VARCHAR(100) NOT NULL, -- الكلمة باللهجة التونسية (مثلاً: دلع، سترة)
    emotion_category VARCHAR(50) NOT NULL, -- تصنيف الشعور (مثلاً: فخامة، حنان، ثقة)
    usage_count INT DEFAULT 0, -- لمتابعة أكثر الكلمات نجاحاً
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول ربط المنتجات بالمشاعر (Product-Emotion Mapping)
CREATE TABLE product_emotions (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL, -- معرف المنتج من جدول products الحالي
    emotion_category VARCHAR(50) NOT NULL,
    intensity_score INT CHECK (intensity_score BETWEEN 1 AND 10), -- قوة الشعور المطلوب
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 3. جدول مسودات المحتوى المولدة (Generated Content Drafts)
CREATE TABLE content_drafts (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    generated_caption TEXT NOT NULL, -- النص المقترح باللهجة التونسية
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, scheduled, published
    scheduled_for TIMESTAMP WITH TIME ZONE, -- وقت النشر المخطط
    engagement_metrics JSONB, -- لتخزين اللايكات والتعليقات لاحقاً
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- إضافة بعض البيانات التجريبية (Seed Data) للهجة التونسية
INSERT INTO emotional_keywords (keyword_tn, emotion_category) VALUES 
('يا بنات', 'نداء'),
('على ذوقك', 'تخصيص'),
('سترة', 'فخامة'),
('دلع', 'أنوثة'),
('الكمية محدودة', 'ندرة'),
('ما يتفوتش', 'عجلة'),
('حاجة تونسية أصيلة', 'هوية');
