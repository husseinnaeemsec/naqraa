import { useState } from 'react';

interface NewsletterFormData {
  email: string;
  wants_course_updates: boolean;
  wants_new_content: boolean;
  wants_promotions: boolean;
  wants_announcements: boolean;
}

export default function NewsletterDemo() {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    wants_course_updates: true,
    wants_new_content: true,
    wants_promotions: true,
    wants_announcements: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('http://localhost:8000/api/newsletters/subscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: formData.email.trim(),
          source: 'demo_page'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully subscribed! Please check your email for a welcome message.');
        setMessageType('success');
        setFormData(prev => ({ ...prev, email: '' }));
      } else {
        setMessage(data.email?.[0] || data.message || 'An error occurred during subscription');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Connection error. Please try again later.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-12 text-white">
            <h1 className="text-3xl font-bold mb-4">Newsletter Subscription Demo</h1>
            <p className="text-emerald-100 text-lg">
              Subscribe to receive the latest courses, learning tips, and exclusive content from Naqraa
            </p>
          </div>
          
          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              {/* Preferences */}
              <div>
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700 mb-4">
                    Email Preferences
                  </legend>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.wants_course_updates}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          wants_course_updates: e.target.checked 
                        }))}
                        disabled={isSubmitting}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        📚 Course updates and new releases
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.wants_new_content}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          wants_new_content: e.target.checked 
                        }))}
                        disabled={isSubmitting}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        💡 Learning tips and study strategies
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.wants_promotions}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          wants_promotions: e.target.checked 
                        }))}
                        disabled={isSubmitting}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        🎯 Special offers and promotions
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.wants_announcements}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          wants_announcements: e.target.checked 
                        }))}
                        disabled={isSubmitting}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        🚨 Important announcements and news
                      </span>
                    </label>
                  </div>
                </fieldset>
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      ✉️ Subscribe to Newsletter
                    </>
                  )}
                </button>
              </div>
              
              {/* Success/Error Message */}
              {message && (
                <div className={`p-4 rounded-lg text-sm ${
                  messageType === 'success' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {messageType === 'success' ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    )}
                    {message}
                  </div>
                </div>
              )}
            </form>
            
            {/* Features Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-2">Weekly Newsletter</h4>
                  <p className="text-sm text-gray-600">Curated content and learning resources delivered to your inbox.</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-2">Course Alerts</h4>
                  <p className="text-sm text-gray-600">Be the first to know about new courses and updates.</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-2">Exclusive Content</h4>
                  <p className="text-sm text-gray-600">Access to subscriber-only resources and early previews.</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-2">Special Offers</h4>
                  <p className="text-sm text-gray-600">Get exclusive discounts and promotional opportunities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}