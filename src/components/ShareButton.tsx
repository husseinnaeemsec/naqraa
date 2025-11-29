import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle, Facebook, Linkedin, Twitter, Mail, Send, X } from 'lucide-react';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

interface ShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  utmParams?: UTMParams;
}

interface SocialPlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  shareUrl: (url: string, title: string, description?: string) => string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: 'واتساب',
    icon: MessageCircle,
    color: 'bg-green-500 hover:bg-green-600',
    shareUrl: (url, title, description) => 
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${description || ''}\n${url}`)}`
  },
  {
    name: 'تيليجرام',
    icon: Send,
    color: 'bg-blue-500 hover:bg-blue-600',
    shareUrl: (url, title, description) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}\n${description || ''}`)}`
  },
  {
    name: 'فيسبوك',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    shareUrl: (url, title) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
  },
  {
    name: 'لينكد إن',
    icon: Linkedin,
    color: 'bg-blue-700 hover:bg-blue-800',
    shareUrl: (url, title, description) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || '')}`
  },
  {
    name: 'تويتر',
    icon: Twitter,
    color: 'bg-sky-500 hover:bg-sky-600',
    shareUrl: (url, title) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  {
    name: 'البريد الإلكتروني',
    icon: Mail,
    color: 'bg-gray-600 hover:bg-gray-700',
    shareUrl: (url, title, description) => 
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description || ''}\n\n${url}`)}`
  }
];

export default function ShareButton({
  url = window.location.href,
  title = 'نقرأ - منصة التعليم الإلكتروني',
  description = 'اكتشف المصادر التعليمية المجانية والدورات التفاعلية',
  className = '',
  variant = 'secondary',
  size = 'md',
  showText = true,
  utmParams
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build URL with UTM parameters
  const buildUrlWithUTM = (baseUrl: string) => {
    if (!utmParams) return baseUrl;
    
    const urlObj = new URL(baseUrl);
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value);
      }
    });
    return urlObj.toString();
  };

  const finalUrl = buildUrlWithUTM(url);

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    secondary: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-600'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5'
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: finalUrl,
        });
        setIsOpen(false);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const handleSocialShare = (platform: SocialPlatform) => {
    const shareUrl = platform.shareUrl(finalUrl, title, description);
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative z-[1]">
      <button
        className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Share2 className={iconSizes[size]} />
        {showText && 'مشاركة'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              {/* Share Popup Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md mx-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-5">
                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="size-5 text-gray-400" />
                  </button>

                  {/* Header */}
                  <div className="text-center pt-2">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Share2 className="size-6 text-emerald-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">مشاركة المحتوى</h4>
                    <p className="text-sm text-gray-600">
                      اختر منصة للمشاركة أو انسخ الرابط
                    </p>
                  </div>

                  {/* Native Share (if supported) */}
                  {navigator?.share !== undefined && (
                    <button
                      onClick={handleNativeShare}
                      className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Share2 className="size-5" />
                      مشاركة سريعة
                    </button>
                  )}

                  {/* Social Media Platforms */}
                  <div>
                    <h5 className="text-base font-semibold text-gray-900 mb-4">المنصات الاجتماعية</h5>
                    <div className="grid grid-cols-2 gap-3">
                      {socialPlatforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <button
                            key={platform.name}
                            onClick={() => handleSocialShare(platform)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${platform.color}`}
                          >
                            <Icon className="size-5" />
                            {platform.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Copy Link */}
                  <div>
                    <h5 className="text-base font-semibold text-gray-900 mb-3">نسخ الرابط</h5>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="text"
                        value={finalUrl}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-700 outline-none font-mono"
                      />
                      <button
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          copied 
                            ? 'bg-green-600 text-white' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="size-4" />
                            تم النسخ
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            نسخ
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Preview Info */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="font-semibold text-gray-800 line-clamp-1">{title}</div>
                        <div className="line-clamp-2 text-xs">{description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}