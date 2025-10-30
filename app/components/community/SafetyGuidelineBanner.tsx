import { Shield, Heart, AlertCircle } from "lucide-react";

export function SafetyGuidelineBanner() {
  return (
    <div className="glass-strong rounded-2xl shadow-soft p-6 mb-8 border border-primary-200 bg-gradient-to-r from-primary-50 to-lavender-50">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-lavender-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-h4 text-neutral-900 mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary-600" />
            서로 존중하는 커뮤니티
          </h3>
          <p className="text-body text-neutral-700 leading-relaxed mb-3">
            마음쉼표는 모두가 안전하게 감정을 나눌 수 있는 공간입니다.
            서로를 존중하고 배려하는 마음으로 소통해주세요.
          </p>

          {/* Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-start gap-2">
              <span className="text-mint-600 font-bold text-sm">✓</span>
              <p className="text-body-sm text-neutral-600">
                공감과 위로의 말
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-mint-600 font-bold text-sm">✓</span>
              <p className="text-body-sm text-neutral-600">
                경험 공유와 조언
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-mint-600 font-bold text-sm">✓</span>
              <p className="text-body-sm text-neutral-600">
                따뜻한 격려와 응원
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-4 p-3 bg-white/50 rounded-lg border-l-4 border-orange-500">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-neutral-700">
                <span className="font-semibold text-orange-600">부적절한 내용</span>은
                신고 후 관리자에 의해 삭제될 수 있습니다.
                (비방, 욕설, 개인정보 노출, 광고 등)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
