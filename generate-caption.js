const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// إعداد الاتصال بقاعدة البيانات PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// دالة مساعدة لاختيار كلمة عشوائية من بنك الكلمات
const getRandomKeyword = async (category) => {
  const res = await pool.query(
    'SELECT keyword_tn FROM emotional_keywords WHERE emotion_category = $1 ORDER BY RANDOM() LIMIT 1',
    [category]
  );
  return res.rows.length > 0 ? res.rows[0].keyword_tn : '';
};

// Endpoint الرئيسي لتوليد المحتوى
router.post('/generate-caption', async (req, res) => {
  try {
    const { product_id } = req.body;

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
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }

    const product = productRes.rows[0];
    const emotion = product.emotion_category;

    // 2. جلب كلمات مفتاحية تونسية مناسبة للشعور
    const keyword1 = await getRandomKeyword(emotion);
    const keyword2 = await getRandomKeyword('ندرة'); // دائماً نضيف عنصر الندرة

    // 3. صياغة النص (هنا نستخدم منطقاً بسيطاً، ويمكن استبداله بـ AI API لاحقاً)
    const caption = `
      ✨ ${product.name} ✨
      
      يا بنات، هذي الحاجة ${keyword1} اللي تدوروا عليها! 😍
      
      💰 السعر: ${product.price} دينار تونسي فقط.
      
      📝 الوصف: ${product.description}
      
      ⚠️ تنبيه: ${keyword2}، ما تتأخروش في الطلب! 🏃‍♀️💨
      
      #HabibiPicks #تونس #ستايل_تونسي #${emotion}
    `;

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
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء توليد المحتوى' });
  }
});

module.exports = router;
