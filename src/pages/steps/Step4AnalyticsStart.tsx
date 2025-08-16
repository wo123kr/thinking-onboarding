import React, { useState, useEffect } from "react";
import { PartyPopper, X, Trophy, Star } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

interface Step4Props {
  onComplete: () => void;
  appData: {
    appId: string;
    dataUrl: string;
    selectedVersion: "saas" | "private" | null;
  };
}

export const Step4AnalyticsStart: React.FC<Step4Props> = ({
  onComplete,
  appData,
}) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [understood, setUnderstood] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // 테마 색상 가져오기
  const theme = colors;

  useEffect(() => {
    if (understood && !hasCompleted) {
      onComplete();
      setCelebrationShown(true);
      setHasCompleted(true);

      // 팝업이 표시될 때 화면 중앙으로 부드럽게 스크롤
      setTimeout(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPosition = Math.max(0, (documentHeight - windowHeight) / 2);

        window.scrollTo({
          top: scrollPosition,
          left: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [understood, hasCompleted, onComplete]);

  // 현재 언어 확인 - translation keys를 통해 안정적으로 감지
  const detectLanguage = () => {
    // step4.mission 키로 언어 감지 (각 언어별 고유 문자열 사용)
    const missionText = t('step4.mission');
    if (missionText.includes('미션') || missionText.includes('단계')) return 'ko';
    if (missionText.includes('Mission') || missionText.includes('Quest')) return 'en';
    return 'zh'; // 중국어 또는 기본값
  };
  const currentLanguage = detectLanguage();

  // Thinking Engine 튜토리얼 단계들 - 언어별 텍스트
  const getTutorialSteps = () => {
    if (currentLanguage === "en") {
      return [
        {
          step: "1",
          title: "Access Thinking Engine",
          desc: "First, access the Thinking Engine platform",
          icon: "🌐",
          color: "#3b82f6",
          details: [
            "Visit https://te-web-naver.thinkingdata.kr/ and complete login process",
            "Familiarize yourself with the main dashboard layout and navigation",
            "Select your target project from the project dropdown menu",
            "Verify data connection status and environment configuration",
            "Review available modules and features in the main navigation",
          ],
        },
        {
          step: "2",
          title: "Find More Menu",
          desc: "Click the 9-dot (3x3 grid) button in the top right corner",
          icon: "⚙️",
          color: "#8b5cf6",
          details: [
            "Locate the top right corner of the Thinking Engine interface",
            "Look for the 9-dot grid icon (3x3 layout) - this is the 'More' menu",
            "Click the grid icon to reveal additional platform features",
            "Browse through available modules like Template Center, Settings, etc.",
            "Note the organized layout of advanced analytics tools",
          ],
        },
        {
          step: "3",
          title: "Use Template Center",
          desc: "Utilize pre-built dashboards from Template Center",
          icon: "📊",
          color: "#06b6d4",
          details: [
            "Navigate to 'Template Center' from the More menu (9-dot grid)",
            "Explore pre-built dashboard templates categorized by use case",
            "Review templates for Overview, Real-time Dashboard, User Analysis, etc.",
            "Preview template layouts and included metrics before selection",
            "Apply suitable templates to your project with one-click deployment",
            "Customize template parameters to match your specific business needs",
          ],
        },
        {
          step: "4",
          title: "Create Metrics with Event Analysis",
          desc: "Create core metrics like DAU and payment amounts using Event Analysis",
          icon: "📈",
          color: "#10b981",
          details: [
            "Access 'Event Analysis' from the main Analytics menu",
            "Configure DAU metrics by selecting user login/activity events",
            "Set up payment analysis using transaction events and revenue fields",
            "Create funnels to track user conversion from signup to purchase",
            "Build cohort analyses to understand user retention patterns",
            "Set up automated alerts for key metric thresholds and anomalies",
          ],
        },
      ];
    } else if (currentLanguage === "zh") {
      return [
        {
          step: "1",
          title: "访问 Thinking Engine",
          desc: "首先访问 Thinking Engine 平台",
          icon: "🌐",
          color: "#3b82f6",
          details: [
            "访问 https://te-web-naver.thinkingdata.kr/ 并完成登录流程",
            "熟悉主仪表板的布局和导航结构",
            "从项目下拉菜单中选择目标分析项目",
            "验证数据连接状态和环境配置",
            "浏览主导航中可用的模块和功能",
          ],
        },
        {
          step: "2",
          title: "查找更多菜单",
          desc: "点击右上角的9个点（3x3网格）按钮",
          icon: "⚙️",
          color: "#8b5cf6",
          details: [
            "定位 Thinking Engine 界面右上角位置",
            "寻找9个点组成的网格图标(3x3布局) - 这是'更多'菜单",
            "点击网格图标显示额外的平台功能",
            "浏览模板中心、设置等各种可用模块",
            "了解高级分析工具的有序布局结构",
          ],
        },
        {
          step: "3",
          title: "使用模板中心",
          desc: "利用模板中心的预构建仪表板",
          icon: "📊",
          color: "#06b6d4",
          details: [
            "从更多菜单(9点网格)访问'模板中心'",
            "探索按用例分类的预构建仪表板模板",
            "查看概览、实时仪表板、用户分析等模板类别",
            "选择前预览模板布局和包含的指标",
            "一键部署适合项目的模板到您的项目",
            "根据具体业务需求自定义模板参数",
          ],
        },
        {
          step: "4",
          title: "使用事件分析创建指标",
          desc: "使用事件分析功能创建DAU、支付金额等核心指标",
          icon: "📈",
          color: "#10b981",
          details: [
            "从主分析菜单访问'事件分析'功能",
            "通过选择用户登录/活动事件配置DAU指标",
            "使用交易事件和收入字段设置支付分析",
            "创建漏斗分析跟踪从注册到购买的用户转化",
            "构建队列分析了解用户保留模式",
            "为关键指标阈值和异常设置自动警报",
          ],
        },
      ];
    } else {
      // 기본값 (한국어)
      return [
        {
          step: "1",
          title: "Thinking Engine 접속",
          desc: "먼저 Thinking Engine 플랫폼에 접속하세요",
          icon: "🌐",
          color: "#3b82f6",
          details: [
            "https://te-web-naver.thinkingdata.kr/ 접속하여 로그인 완료",
            "메인 대시보드 레이아웃과 네비게이션 구조 파악",
            "프로젝트 드롭다운에서 분석할 프로젝트 선택",
            "데이터 연결 상태 및 환경 설정 확인",
            "메인 네비게이션에서 사용 가능한 모듈과 기능 둘러보기",
          ],
        },
        {
          step: "2",
          title: "더보기 메뉴 찾기",
          desc: "화면 우측 상단의 9개 점(3x3 격자) 버튼을 클릭하세요",
          icon: "⚙️",
          color: "#8b5cf6",
          details: [
            "Thinking Engine 인터페이스의 우측 상단 모서리 위치 확인",
            "9개 점으로 구성된 격자 아이콘(3x3 배열) 찾기 - 이것이 '더보기' 메뉴입니다",
            "격자 아이콘을 클릭하여 추가 플랫폼 기능들 표시",
            "템플릿 센터, 설정 등 다양한 모듈들 살펴보기",
            "고급 분석 도구들의 체계적인 배치 구조 파악",
          ],
        },
        {
          step: "3",
          title: "템플릿 센터 이용",
          desc: "템플릿 센터에서 미리 제작된 대시보드를 활용하세요",
          icon: "📊",
          color: "#06b6d4",
          details: [
            "더보기 메뉴(9개 점 격자)에서 '템플릿 센터' 접근",
            "용도별로 분류된 미리 제작된 대시보드 템플릿들 탐색",
            "개요, 실시간 대시보드, 사용자 분석 등 템플릿 카테고리 확인",
            "선택 전 템플릿 레이아웃과 포함된 지표들 미리보기",
            "프로젝트에 적합한 템플릿을 원클릭으로 배포 및 적용",
            "비즈니스 요구사항에 맞게 템플릿 매개변수 커스터마이징",
          ],
        },
        {
          step: "4",
          title: "이벤트 분석으로 지표 생성",
          desc: "이벤트 분석 기능으로 DAU, 결제금액 등 핵심 지표를 만들어보세요",
          icon: "📈",
          color: "#10b981",
          details: [
            "메인 분석 메뉴에서 '이벤트 분석' 기능 접근",
            "사용자 로그인/활동 이벤트를 선택하여 DAU 지표 구성",
            "거래 이벤트와 수익 필드를 활용한 결제 분석 설정",
            "가입부터 구매까지 사용자 전환 과정 추적하는 퍼널 생성",
            "사용자 유지율 패턴 이해를 위한 코호트 분석 구축",
            "핵심 지표 임계값과 이상 징후에 대한 자동 알림 설정",
          ],
        },
      ];
    }
  };

  const tutorialSteps = getTutorialSteps();

  return (
    <div style={{ color: theme.text }}>
      {/* 게이밍 스타일 Step Title - Step 3과 동일한 형태 */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
            padding: "20px",
            background: "rgba(245, 158, 11, 0.1)",
            borderRadius: "16px",
            border: `1px solid ${theme.cardBorder}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 배경 장식 */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-20%",
              width: "100px",
              height: "100px",
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))",
              borderRadius: "50%",
              filter: "blur(30px)",
            }}
          />

          <div
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(245, 158, 11, 0.4)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Trophy size={28} color="white" />
          </div>
          <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              {t("step4.mission")}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  padding: "4px 12px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {t("step4.questType")}
              </span>
              <Star size={16} color="#f59e0b" />
              <span
                style={{
                  color: "#f59e0b",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {t("step4.reward")}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "24px",
            padding: "16px",
            background: `rgba(245, 158, 11, 0.05)`,
            borderRadius: "12px",
            border: `1px solid rgba(245, 158, 11, 0.2)`,
          }}
        >
          <p
            style={{
              fontSize: "16px",
              color: theme.text,
              margin: 0,
              fontWeight: "600",
            }}
          >
            {t("step4.warning")}
          </p>
        </div>
      </div>

      {/* Tutorial Steps */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          {tutorialSteps.map((step, index) => (
            <div
              key={index}
              style={{
                padding: "24px",
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: "20px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(20px)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 12px 30px rgba(0, 0, 0, 0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 24px rgba(0, 0, 0, 0.2)";
              }}
            >
              {/* 배경 장식 */}
              <div
                style={{
                  position: "absolute",
                  top: "-30%",
                  right: "-10%",
                  width: "150px",
                  height: "150px",
                  background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`,
                  borderRadius: "50%",
                  filter: "blur(40px)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "60px",
                    height: "60px",
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                    borderRadius: "20px",
                    boxShadow: `0 8px 20px ${step.color}40`,
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {step.step}
                </div>

                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      margin: "0 0 8px 0",
                      color: theme.text,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {step.icon} {step.title}
                  </h4>

                  <p
                    style={{
                      fontSize: "14px",
                      color: theme.textSecondary,
                      lineHeight: "1.5",
                      margin: "0 0 16px 0",
                    }}
                  >
                    {step.desc}
                  </p>

                  <div
                    style={{
                      background: `${step.color}10`,
                      borderRadius: "12px",
                      padding: "16px",
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    <ul
                      style={{
                        fontSize: "13px",
                        color: theme.text,
                        lineHeight: "1.5",
                        margin: 0,
                        paddingLeft: "16px",
                      }}
                    >
                      {step.details.map((detail, idx) => (
                        <li key={idx} style={{ marginBottom: "6px" }}>
                          <span style={{ fontWeight: "500" }}>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Usage Guides */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          {/* Template Center Usage Guide */}
          <div
            style={{
              padding: "24px",
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: "20px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-30%",
                left: "-10%",
                width: "120px",
                height: "120px",
                background:
                  "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))",
                borderRadius: "50%",
                filter: "blur(30px)",
              }}
            />

            <h4
              style={{
                fontSize: "20px",
                fontWeight: "700",
                margin: "0 0 20px 0",
                color: theme.text,
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              📊{" "}
              {currentLanguage === "en"
                ? "Template Center - Advanced Usage"
                : currentLanguage === "zh"
                ? "模板中心 - 高级使用"
                : "템플릿 센터 - 고급 활용법"}
            </h4>

            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: "14px",
                lineHeight: "1.6",
                color: theme.text,
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <h5 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                  color: "#06b6d4"
                }}>
                  {currentLanguage === "en"
                    ? "🎯 Key Features"
                    : currentLanguage === "zh"
                    ? "🎯 核心功能"
                    : "🎯 핵심 기능"}
                </h5>
                <ul style={{ margin: 0, paddingLeft: "20px", color: theme.textSecondary }}>
                  <li>{currentLanguage === "en"
                    ? "Access 20+ industry-specific dashboard templates"
                    : currentLanguage === "zh"
                    ? "访问20+行业特定仪表板模板"
                    : "20개 이상의 산업별 대시보드 템플릿 접근"}
                  </li>
                  <li>{currentLanguage === "en"
                    ? "One-click deployment with automatic data mapping"
                    : currentLanguage === "zh"
                    ? "一键部署自动数据映射"
                    : "자동 데이터 매핑과 원클릭 배포"}
                  </li>
                  <li>{currentLanguage === "en"
                    ? "Customizable widgets and metric configurations"
                    : currentLanguage === "zh"
                    ? "可定制小部件和指标配置"
                    : "위젯과 지표 설정 커스터마이징 가능"}
                  </li>
                </ul>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <h5 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                  color: "#06b6d4"
                }}>
                  {currentLanguage === "en"
                    ? "💡 Pro Tips"
                    : currentLanguage === "zh"
                    ? "💡 专业技巧"
                    : "💡 활용 팁"}
                </h5>
                <ul style={{ margin: 0, paddingLeft: "20px", color: theme.textSecondary }}>
                  <li>{currentLanguage === "en"
                    ? "Start with Overview template for general insights"
                    : currentLanguage === "zh"
                    ? "从概览模板开始获得整体洞察"
                    : "전반적인 인사이트를 위해 개요 템플릿부터 시작"}
                  </li>
                  <li>{currentLanguage === "en"
                    ? "Combine multiple templates for comprehensive analysis"
                    : currentLanguage === "zh"
                    ? "结合多个模板进行综合分析"
                    : "종합적인 분석을 위해 여러 템플릿 조합 활용"}
                  </li>
                  <li>{currentLanguage === "en"
                    ? "Save custom configurations as personal templates"
                    : currentLanguage === "zh"
                    ? "将自定义配置保存为个人模板"
                    : "커스텀 설정을 개인 템플릿으로 저장"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Event Analysis Usage Guide */}
          <div
            style={{
              padding: "24px",
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: "20px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-30%",
                right: "-10%",
                width: "120px",
                height: "120px",
                background:
                  "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))",
                borderRadius: "50%",
                filter: "blur(30px)",
              }}
            />

            <h4
              style={{
                fontSize: "20px",
                fontWeight: "700",
                margin: "0 0 20px 0",
                color: theme.text,
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              📈{" "}
              {currentLanguage === "en"
                ? "Event Analysis - Advanced Usage"
                : currentLanguage === "zh"
                ? "事件分析 - 高级使用"
                : "이벤트 분석 - 고급 활용법"}
            </h4>

            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: "14px",
                lineHeight: "1.6",
                color: theme.text,
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <h5 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                  color: "#10b981"
                }}>
                  {currentLanguage === "en"
                    ? "📊 Core Metrics Setup"
                    : currentLanguage === "zh"
                    ? "📊 核心指标设置"
                    : "📊 핵심 지표 설정"}
                </h5>
                <ul style={{ margin: 0, paddingLeft: "20px", color: theme.textSecondary }}>
                  <li>{currentLanguage === "en"
                    ? "DAU: Track unique users with login/session events"
                    : currentLanguage === "zh"
                    ? "DAU：通过登录/会话事件跟踪独立用户"
                    : "DAU: 로그인/세션 이벤트로 순 사용자 추적"}
                  </li>
                  <li>{currentLanguage === "en"
                    ? "Revenue: Sum payment amounts with purchase events"
                    : currentLanguage === "zh"
                    ? "收入：通过购买事件汇总支付金额"
                    : "매출: 구매 이벤트로 결제 금액 합계"}
                  </li>
                  <li>{currentLanguage === "en"
                    ? "Conversion: Calculate funnel rates between key actions"
                    : currentLanguage === "zh"
                    ? "转化：计算关键行为间的漏斗转化率"
                    : "전환율: 주요 액션 간 퍼널 비율 계산"}
                  </li>
                </ul>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <h5 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                  color: "#10b981"
                }}>
                  {currentLanguage === "en"
                    ? "⚡ Advanced Techniques"
                    : currentLanguage === "zh"
                    ? "⚡ 高级技巧"
                    : "⚡ 고급 기법"}
                </h5>
                <ul style={{ margin: 0, paddingLeft: "20px", color: theme.textSecondary }}>
                  <li>{currentLanguage === "en"
                    ? "Segment users by custom properties for deeper insights"
                    : currentLanguage === "zh"
                    ? "按自定义属性细分用户以获得更深入的洞察"
                    : "커스텀 속성으로 사용자 세분화하여 깊은 인사이트 확보"}
                  </li>
                  <li>{currentLanguage === "en"
                    ? "Set up automated alerts for metric anomalies"
                    : currentLanguage === "zh"
                    ? "为指标异常设置自动警报"
                    : "지표 이상 현상에 대한 자동 알림 설정"}
                  </li>
                  <li>{currentLanguage === "en"
                    ? "Create custom cohorts for retention analysis"
                    : currentLanguage === "zh"
                    ? "创建自定义队列进行留存分析"
                    : "리텐션 분석을 위한 커스텀 코호트 생성"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            padding: "24px",
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(20px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 배경 장식 */}
          <div
            style={{
              position: "absolute",
              top: "-40%",
              left: "-20%",
              width: "180px",
              height: "180px",
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(245, 158, 11, 0.4)",
              }}
            >
              <Star size={24} color="white" />
            </div>
            <h4
              style={{
                fontSize: "24px",
                fontWeight: "700",
                margin: 0,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🎯{" "}
              {currentLanguage === "en"
                ? "Practical Guide Complete!"
                : currentLanguage === "zh"
                ? "实战指南完成！"
                : "실전 가이드 완료!"}
            </h4>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "15px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                margin: "0 0 16px 0",
                color: theme.text,
                lineHeight: "1.5",
              }}
            >
              {currentLanguage === "en"
                ? "Now you're ready to use Thinking Engine's core features directly. Follow the tutorial below to start your analysis!"
                : currentLanguage === "zh"
                ? "现在您已准备好直接使用 Thinking Engine 的核心功能。按照下面的教程开始您的分析！"
                : "이제 Thinking Engine의 핵심 기능들을 직접 사용해볼 준비가 되었습니다. 아래 튜토리얼을 따라 실제 분석을 시작해보세요!"}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <span
                style={{
                  padding: "4px 12px",
                  background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {currentLanguage === "en"
                  ? "Template"
                  : currentLanguage === "zh"
                  ? "模板"
                  : "템플릿"}
              </span>
              <span style={{ color: theme.text }}>
                📊{" "}
                {currentLanguage === "en"
                  ? "Quick start with pre-built dashboards"
                  : currentLanguage === "zh"
                  ? "使用预构建仪表板快速开始"
                  : "미리 제작된 대시보드로 빠른 시작"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <span
                style={{
                  padding: "4px 12px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {currentLanguage === "en"
                  ? "Analysis"
                  : currentLanguage === "zh"
                  ? "分析"
                  : "분석"}
              </span>
              <span style={{ color: theme.text }}>
                📈{" "}
                {currentLanguage === "en"
                  ? "Create core metrics like DAU and payment amounts"
                  : currentLanguage === "zh"
                  ? "创建DAU、支付金额等核心指标"
                  : "DAU, 결제금액 등 핵심 지표 생성"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 게이밍 스타일 Completion */}
      <div
        style={{
          padding: "24px",
          background: colors.cardBg,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          borderRadius: "20px",
          border: `1px solid ${colors.cardBorder}`,
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-20%",
            width: "120px",
            height: "120px",
            background: understood
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))"
              : "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
            borderRadius: "50%",
            filter: "blur(30px)",
            transition: "all 0.3s ease",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: understood
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: understood
                ? "0 8px 20px rgba(16, 185, 129, 0.4)"
                : "0 8px 20px rgba(139, 92, 246, 0.4)",
              transition: "all 0.3s ease",
            }}
          >
            {understood ? (
              <Trophy size={24} color="white" />
            ) : (
              <Star size={24} color="white" />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                cursor: "pointer",
              }}
              onClick={() => setUnderstood(!understood)}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  border: `2px solid ${
                    understood ? colors.success : theme.cardBorder
                  }`,
                  background: understood ? colors.success : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {understood && (
                  <div
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
              <span
                style={{
                  color: theme.text,
                  fontSize: "16px",
                  fontWeight: "600",
                  lineHeight: "1.5",
                  flex: 1,
                }}
              >
                {understood
                  ? t("step4.finalMissionComplete")
                  : t("step4.analysisStepComplete")}
              </span>
            </div>
            {understood && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px 16px",
                  background: `${colors.success}15`,
                  borderRadius: "12px",
                  border: `1px solid ${colors.success}30`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: colors.success,
                    fontWeight: "600",
                  }}
                >
                  <Trophy size={16} />
                  {t("step4.finalRewardEarned")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 게이밍 스타일 Celebration Modal */}
      {celebrationShown && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              padding: "48px",
              borderRadius: "24px",
              maxWidth: "600px",
              margin: "20px",
              textAlign: "center",
              boxShadow:
                "0 20px 50px rgba(139, 92, 246, 0.3), 0 0 100px rgba(59, 130, 246, 0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 배경 장식 */}
            <div
              style={{
                position: "absolute",
                top: "-30%",
                left: "-20%",
                width: "150px",
                height: "150px",
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                borderRadius: "50%",
                filter: "blur(40px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-30%",
                right: "-20%",
                width: "120px",
                height: "120px",
                background:
                  "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))",
                borderRadius: "50%",
                filter: "blur(40px)",
              }}
            />

            <button
              onClick={() => setCelebrationShown(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.1)",
                border: `1px solid ${theme.cardBorder}`,
                cursor: "pointer",
                padding: "8px",
                borderRadius: "12px",
                color: theme.textSecondary,
                fontSize: "0",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255, 255, 255, 0.2)";
                (e.currentTarget as HTMLElement).style.color = theme.text;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255, 255, 255, 0.1)";
                (e.currentTarget as HTMLElement).style.color =
                  theme.textSecondary;
              }}
            >
              <X size={20} />
            </button>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "24px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  borderRadius: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 25px rgba(245, 158, 11, 0.4)",
                  animation: "pulse 2s infinite",
                }}
              >
                <PartyPopper size={40} color="white" />
              </div>
            </div>
            <h4
              style={{
                fontSize: "32px",
                fontWeight: "800",
                margin: "0 0 20px 0",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                position: "relative",
                zIndex: 1,
              }}
            >
              {t("step4.congratulationsQuestComplete")}
            </h4>
            <p
              style={{
                fontSize: "18px",
                margin: "0 0 36px 0",
                lineHeight: "1.6",
                color: theme.textSecondary,
                position: "relative",
                zIndex: 1,
              }}
            >
              <strong style={{ color: theme.text }}>
                {t("step4.quickStartComplete")}
              </strong>
              <br />
              {t("step4.exploreDataAnalysisWorld")}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "24px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  padding: "12px 20px",
                  background: `${colors.success}15`,
                  borderRadius: "12px",
                  border: `1px solid ${colors.success}30`,
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: theme.success,
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {t("step4.rewardEarned500XP")}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
                position: "relative",
                zIndex: 1,
              }}
            >
              <button
                onClick={() => window.location.hash = ""}
                style={{
                  padding: "14px 28px",
                  border: `2px solid ${theme.cardBorder}`,
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: theme.text,
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 20px rgba(139, 92, 246, 0.3)";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255, 255, 255, 0.1)";
                }}
              >
                {t("step4.goHome")}
              </button>
              <button
                onClick={() =>
                  window.open("https://te-web-naver.thinkingdata.kr/", "_blank")
                }
                style={{
                  padding: "14px 28px",
                  border: "none",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 24px rgba(139, 92, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 16px rgba(139, 92, 246, 0.3)";
                }}
              >
                {t("step4.startAnalysis")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
