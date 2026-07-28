import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentDashboard = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [productId, setProductId] = useState(1);
  const [message, setMessage] = useState(null);

  // دالة لجلب مسودة جديدة لمنتج معين
  const generateNewDraft = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await axios.post('/api/generate-caption', {
        product_id: parseInt(productId)
      });
      
      if (response.data.success) {
        setCurrentCaption(response.data.caption);
        setDrafts(prev => [response.data, ...prev]);
        setMessage({ type: 'success', text: response.data.message });
      }
    } catch (error) {
      console.error("فشل في توليد المحتوى", error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'فشل في توليد المحتوى' 
      });
    } finally {
      setLoading(false);
    }
  };

  // دالة للموافقة على النص
  const approveDraft = async () => {
    if (!currentCaption) return;
    
    try {
      // هنا يمكن إضافة كود لإرسال طلب API لتغيير الحالة إلى 'approved'
      setMessage({ type: 'success', text: 'تمت الموافقة على النص وحفظه للنشر!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الاعتماد' });
    }
  };

  // جلب المسودات السابقة عند التحميل
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get('/api/drafts');
        if (response.data.success) {
          setDrafts(response.data.drafts);
        }
      } catch (error) {
        console.error('فشل في جلب المسودات', error);
      }
    };
    fetchDrafts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-pink-600 p-6 text-white">
          <h1 className="text-2xl font-bold">🎨 صانع محتوى Habibi Picks</h1>
          <p className="text-pink-100 mt-1">ولد نصوصاً تونسية عاطفية بضغطة زر</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 space-y-6">
          
          {/* Product ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              معرف المنتج:
            </label>
            <input
              type="number"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-right"
              placeholder="أدخل معرف المنتج"
            />
          </div>

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
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {drafts.map((draft) => (
                  <div 
                    key={draft.id} 
                    className="p-4 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setCurrentCaption(draft.generated_caption)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-pink-600">مسودة #{draft.id}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        draft.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        draft.status === 'approved' ? 'bg-green-100 text-green-700' :
                        draft.status === 'published' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {draft.status === 'pending' ? 'قيد الانتظار' :
                         draft.status === 'approved' ? 'مُعتمد' :
                         draft.status === 'published' ? 'منشور' : draft.status}
                      </span>
                    </div>
                    <p className="line-clamp-2">{draft.generated_caption}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(draft.created_at).toLocaleString('ar-TN')}
                    </p>
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
