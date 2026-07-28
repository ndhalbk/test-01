const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// إعداد الاتصال بقاعدة البيانات PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/habibi_picks',
});

// دالة مساعدة لاختيار كلمة عشوائية من بنك الكلمات
const getRandomKeyword = async (category) => {
  try {
    const res = await pool.query(
      'SELECT keyword_tn FROM emotional_keywords WHERE emotion_category = $1 ORDER BY RANDOM() LIMIT 1',
      [category]
    );
    return res.rows.length > 0 ? res.rows[0].keyword_tn : '';
  } catch (err) {
    console.error('Error fetching keyword:', err);
    return '';
  }
};

// Endpoint الرئيسي لتوليد المحتوى
app.post('/api/generate-caption', async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'product_id مطلوب' });
    }

    // 1. جلب بيانات المنتج والمشاعر المرتبطة به
    const productQuery = `
      SELECT p.name, p.price, p.description, pe.emotion_category 
      FROM products p
      JOIN product_emotions pe ON p.id = pe.product_id
      WHERE p.id = $1
      LIMIT 1
    `;
    const productRes = await pool.query(productQuery, [product_id]);
    
    if (productRes.rows.length === 0) {
      return res.status(404).json({ error: 'المنتج غير موجود أو لا توجد مشاعر مرتبطة به' });
    }

    const product = productRes.rows[0];
    const emotion = product.emotion_category;

    // 2. جلب كلمات مفتاحية تونسية مناسبة للشعور
    const keyword1 = await getRandomKeyword(emotion);
    const keyword2 = await getRandomKeyword('ندرة'); // دائماً نضيف عنصر الندرة

    // 3. صياغة النص
    const caption = `✨ ${product.name} ✨

يا بنات، هذي الحاجة ${keyword1} اللي تدوروا عليها! 😍

💰 السعر: ${product.price} دينار تونسي فقط.

📝 الوصف: ${product.description}

⚠️ تنبيه: ${keyword2}، ما تتأخروش في الطلب! 🏃‍♀️💨

#HabibiPicks #تونس #ستايل_تونسي #${emotion}`;

    // 4. حفظ المسودة في قاعدة البيانات
    const insertDraft = `
      INSERT INTO content_drafts (product_id, generated_caption, status)
      VALUES ($1, $2, 'pending')
      RETURNING id
    `;
    const draftRes = await pool.query(insertDraft, [product_id, caption.trim()]);

    res.json({
      success: true,
      draft_id: draftRes.rows[0].id,
      caption: caption.trim(),
      message: 'تم توليد النص بنجاح!'
    });

  } catch (err) {
    console.error('Error generating caption:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء توليد المحتوى' });
  }
});

// Endpoint لجلب كل المسودات
app.get('/api/drafts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM content_drafts ORDER BY created_at DESC'
    );
    res.json({ success: true, drafts: result.rows });
  } catch (err) {
    console.error('Error fetching drafts:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب المسودات' });
  }
});

// Endpoint لتحديث حالة المسودة
app.patch('/api/drafts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduled_for } = req.body;
    
    const updateQuery = `
      UPDATE content_drafts 
      SET status = COALESCE($1, status), scheduled_for = COALESCE($2, scheduled_for)
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [status, scheduled_for, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'المسودة غير موجودة' });
    }
    
    res.json({ success: true, draft: result.rows[0] });
  } catch (err) {
    console.error('Error updating draft:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث المسودة' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
});
