import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentDashboard = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // دالة لجلب مسودة جديدة لمنتج معين (لغرض التجربة سنستخدم ID ثابت)
  const generateNewDraft = async () => {
    setLoading(true);
    try {
      // استبدل 1 بـ ID منتج حقيقي من متجرك
      const response = await axios.post('http://localhost:3000/api/generate-caption', {
        product_id: 1 
      });
      
      if (response.data.success) {
        setCurrentCaption(response.data.caption);
        setDrafts([...drafts, response.data]);
      }
    } catch (error) {
      console.error("فشل في توليد المحتوى", error);
    } finally {
      setLoading(false);
    }
  };

  // دالة للموافقة على النص ونشره (محاكاة)
  const approveDraft = () => {
    alert(`تمت الموافقة على النص وحفظه للنشر! \n\n"${currentCaption}"`);
    // هنا يمكنك إضافة كود لإرسال طلب API لتغيير الحالة إلى 'approved'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-pink-600 p-6 text-white">
          <h1 className="text-2xl font-bold">🎨 صانع محتوى Habibi Picks</h1>
          <p className="text-pink-100 mt-1">ولد نصوصاً تونسية عاطفية بضغطة زر</p>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          
          {/* Text Editor Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              النص المقترح (قابل للتعديل):
            </label>
            <textarea
              value={currentCaption}
              onChange={(e) => setCurrentCaption(e.target.value)}
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-right"
              placeholder="اضغط على 'توليد نص جديد' للبدء..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={generateNewDraft}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? 'جاري التوليد...' : '✨ توليد نص جديد'}
            </button>

            <button
              onClick={approveDraft}
              disabled={!currentCaption}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                !currentCaption
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              ✅ اعتماد والنشر
            </button>
          </div>

          {/* History / Drafts List */}
          {drafts.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">المسودات السابقة:</h3>
              <div className="space-y-3">
                {drafts.map((draft, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-600">
                    <span className="font-bold text-pink-600">مسودة #{draft.draft_id}:</span> {draft.caption.substring(0, 50)}...
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDashboard;
