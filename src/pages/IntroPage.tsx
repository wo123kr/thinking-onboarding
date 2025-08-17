import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Database,
  BarChart,
  Shield,
  Star,
  Activity,
  Settings,
  CheckCircle,
  AlertTriangle,
  TableProperties,
  ChevronUp,
} from "lucide-react";
import { StepProgress } from "../components/StepProgress";
import { Layout } from "../components/Layout";
import { AdvancedIdleRPG } from "../components/AdvancedIdleRPG";
import { Checkbox } from "../components/Checkbox";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

// 이미지 경로 (GitHub Pages 배포용)
const sdkImage = `${process.env.PUBLIC_URL}/img/sdk.png`;
const architectureImage = `${process.env.PUBLIC_URL}/img/아키텍처.png`;
const tableStructureImage = `${process.env.PUBLIC_URL}/img/테이블 구조.png`;

type StepType =
  | "overview"
  | "data-structure"
  | "tracking-policy"
  | "data-simulation"
  | "data-utilization";

interface StepCompletion {
  overview: boolean;
  "data-structure": boolean;
  "tracking-policy": boolean;
  "data-simulation": boolean;
  "data-utilization": boolean;
}

export const IntroPage: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  // 현재 활성 단계 상태
  const [currentStep, setCurrentStep] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [stepCompletion, setStepCompletion] = useState<StepCompletion>({
    overview: false,
    "data-structure": false,
    "tracking-policy": false,
    "data-simulation": false,
    "data-utilization": false,
  });

  // 테마 색상 가져오기
  const theme = colors;

  // 완료된 스텝 수 계산
  const completedCount = Object.values(stepCompletion).filter(Boolean).length;
  const totalCount = Object.keys(stepCompletion).length;
  const progressPercentage = (completedCount / totalCount) * 100;

  // JSON 로그 컨테이너 ref
  const logContainerRef = useRef<HTMLDivElement>(null);

  // 데이터 수집 시뮬레이션 상태 (Step 4용)
  const [eventLogs, setEventLogs] = useState<any[]>([]);
  const [currentUser] = useState<any>({
    user_id: "TD001",
    "#account_id": "e926bc78-fbc9-4d20-856c-bb3ab18dbd37",
    "#uuid": "550e8400-e29b-41d4-a716-446655440000",
    active_time: new Date().toISOString(),
    reg_time: new Date().toISOString(),
    session_count: 1,
  });
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  // 사용자 배달 앱 통계
  const [userStats, setUserStats] = useState({
    level: 1,
    gold: 100,
    attack: 20,
    defense: 10,
    hp: 100,
    maxHp: 100,
    exp: 0,
    maxExp: 100,
    monsters_defeated: 0,
    character_class: "전사",
  });

  // 로그 업데이트 시 자동 스크롤
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [eventLogs]);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300); // 300px 스크롤하면 버튼 표시
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    // 부드러운 스크롤로 한번에 맨 위로
    window.scrollTo({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  };

  // 레벨 달성 체크 - 새로운 레벨 달성 시 이벤트 생성
  useEffect(() => {
    // 5, 10, 15, 20... 레벨 달성시 마일스톤 이벤트 생성
    if (userStats.level > 1 && userStats.level % 5 === 0) {
      const eventId = `evt_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const timestamp = new Date()
        .toISOString()
        .replace("T", " ")
        .replace("Z", ".000");
      const uuid = `${Math.random().toString(36).substr(2, 8)}-${Math.random()
        .toString(36)
        .substr(2, 4)}-${Math.random()
        .toString(36)
        .substr(2, 4)}-${Math.random()
        .toString(36)
        .substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`;

      const milestoneEvent = {
        event_id: eventId,
        user_id: currentUser.user_id,
        event_name: "level_milestone_achieved",
        timestamp: timestamp,
        json: {
          "#account_id": currentUser["#account_id"],
          "#time": timestamp,
          "#uuid": uuid,
          "#type": "track",
          "#event_name": "level_milestone_achieved",
          properties: {
            "#lib_version": "2.0.3",
            "#lib": "tga_javascript_sdk",
            "#data_source": "Client_SDK",
            milestone_level: userStats.level,
            character_class: userStats.character_class,
            total_gold: userStats.gold,
            monsters_defeated: userStats.monsters_defeated,
            user_id: currentUser.user_id,
            session_id: `session_${Date.now()}`,
            platform: "web",
            browser: "Chrome",
            os: "MacOS",
            "#ip": "192.168.1.1",
            "#country": "KR",
            current_level: userStats.level,
            current_gold: userStats.gold,
            attack_power: userStats.attack,
          },
        },
      };

      setEventLogs((prev) => [...prev.slice(-19), milestoneEvent]);
      setCurrentAction(
        `🎉 레벨 ${userStats.level} 달성! ${userStats.character_class} 클래스로 더욱 강해졌습니다!`
      );
      setTimeout(() => setCurrentAction(null), 3000);
    }
  }, [
    userStats.level,
    userStats.character_class,
    userStats.gold,
    userStats.monsters_defeated,
    userStats.attack,
    currentUser,
  ]);

  // 스텝 정의
  const steps = [
    {
      id: 1,
      key: "overview" as StepType,
      title: t("intro.step.overview"),
      icon: <Zap size={20} />,
      completed: stepCompletion.overview,
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      description: t("intro.step.overview.description"),
    },
    {
      id: 2,
      key: "data-structure" as StepType,
      title: t("intro.step.dataStructure"),
      icon: <Settings size={20} />,
      completed: stepCompletion["data-structure"],
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      description: t("intro.step.dataStructure.description"),
    },
    {
      id: 3,
      key: "tracking-policy" as StepType,
      title: t("intro.step.trackingPolicy"),
      icon: <Database size={20} />,
      completed: stepCompletion["tracking-policy"],
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
      description: t("intro.step.trackingPolicy.description"),
    },
    {
      id: 4,
      key: "data-simulation" as StepType,
      title: t("intro.step.dataSimulation"),
      icon: <Activity size={20} />,
      completed: stepCompletion["data-simulation"],
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      description: t("intro.step.dataSimulation.description"),
    },
    {
      id: 5,
      key: "data-utilization" as StepType,
      title: t("intro.step.dataUtilization"),
      icon: <BarChart size={20} />,
      completed: stepCompletion["data-utilization"],
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      description: t("intro.step.dataUtilization.description"),
    },
  ];

  // 스텝 완료 처리 함수
  const handleStepComplete = (stepKey: StepType) => {
    setStepCompletion((prev) => ({
      ...prev,
      [stepKey]: true,
    }));
  };

  const handleNext = () => {
    const currentStepKey = steps[currentStep - 1]?.key;
    if (currentStep < 5 && stepCompletion[currentStepKey]) {
      setCurrentStep((prev) => prev + 1);
      // React 상태 업데이트 후에 스크롤하도록 대기
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      // React 상태 업데이트 후에 스크롤하도록 대기
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleStepChange = (stepId: number) => {
    // Only allow navigation to completed steps or the next incomplete step
    const step = steps.find((s) => s.id === stepId);
    const canNavigate = step?.completed || stepId === currentStep;
    if (canNavigate) {
      setCurrentStep(stepId);
      // React 상태 업데이트 후에 스크롤하도록 대기
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const canGoNext = stepCompletion[steps[currentStep - 1]?.key];
  const canGoPrev = currentStep > 1;

  // 이벤트 생성 함수 (Step 4용)
  const generateEvent = (eventType: string, data: any) => {
    const eventId = `evt_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const timestamp = new Date()
      .toISOString()
      .replace("T", " ")
      .replace("Z", ".000");
    const uuid = `${Math.random().toString(36).substr(2, 8)}-${Math.random()
      .toString(36)
      .substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random()
      .toString(36)
      .substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`;

    const eventData = {
      event_id: eventId,
      user_id: currentUser.user_id,
      event_name: eventType,
      timestamp: timestamp,
      json: {
        "#account_id": currentUser["#account_id"],
        "#time": timestamp,
        "#uuid": uuid,
        "#type": "track",
        "#event_name": eventType,
        properties: {
          "#lib_version": "2.0.3",
          "#lib": "tga_javascript_sdk",
          "#data_source": "Client_SDK",
          ...data,
          user_id: currentUser.user_id,
          session_id: `session_${Date.now()}`,
          platform: "web",
          browser: "Chrome",
          os: "MacOS",
          "#ip": "192.168.1.1",
          "#country": "KR",
          character_level: userStats.level,
          gold_amount: userStats.gold,
          attack_power: userStats.attack,
          defense_power: userStats.defense,
          current_hp: userStats.hp,
          max_hp: userStats.maxHp,
          exp_points: userStats.exp,
          monsters_defeated: userStats.monsters_defeated,
        },
      },
    };

    setEventLogs((prev) => [...prev.slice(-19), eventData]);

    // 액션 표시
    setCurrentAction(`🎮 ${eventType} 이벤트 생성됨`);
    setTimeout(() => setCurrentAction(null), 3000);
  };

  // Step 1: Overview (Thinking Engine 개발중)
  const renderStep1Overview = () => (
    <div>
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "800",
          color: theme.text,
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        {t("intro.overview.title")}
      </h2>

      <p
        style={{
          fontSize: "18px",
          color: theme.textSecondary,
          textAlign: "center",
          marginBottom: "32px",
          lineHeight: "1.6",
          maxWidth: "800px",
          margin: "0 auto 32px",
        }}
      >
        {t("intro.overview.subtitle")}
        <br />
        <strong style={{ color: theme.text }}>
          {t("intro.overview.subtitleHighlight")}
        </strong>
        {t("intro.overview.subtitleEnd")}
      </p>

      {/* 핵심 가치 제안 */}
      <div
        style={{
          background:
            theme.cardBg === "#ffffff"
              ? "rgba(139, 92, 246, 0.05)"
              : "rgba(139, 92, 246, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "16px",
          }}
        >
          {t("intro.overview.valueProposition")}
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.8",
            marginBottom: "24px",
          }}
        >
          {t("intro.overview.processDescription")}
          <br />
          {t("intro.overview.processDetail")}
          <br />
          {t("intro.overview.processDetail2")}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              label: t("intro.overview.stats.clients"),
              value: "1,500+",
              color: "#8b5cf6",
            },
            {
              label: t("intro.overview.stats.products"),
              value: "8,000+",
              color: "#3b82f6",
            },
            {
              label: t("intro.overview.stats.gameModels"),
              value: "13+",
              subtitle: t("intro.overview.stats.analysisModels"),
              color: "#10b981",
            },
          ].map((stat, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: stat.color,
                  textShadow: `0 0 10px ${stat.color}40`,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: theme.text,
                  fontWeight: "600",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </div>
              {stat.subtitle && (
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    marginTop: "2px",
                  }}
                >
                  {stat.subtitle}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 핵심 기능 */}
      <h3
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: theme.text,
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {t("intro.overview.featuresTitle")}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            icon: <BarChart size={28} />,
            title: t("intro.overview.feature1.title"),
            desc: t("intro.overview.feature1.desc"),
            color: "#8b5cf6",
            details: [
              t("intro.overview.feature1.detail1"),
              t("intro.overview.feature1.detail2"),
              t("intro.overview.feature1.detail3"),
            ],
          },
          {
            icon: <Activity size={28} />,
            title: t("intro.overview.feature2.title"),
            desc: t("intro.overview.feature2.desc"),
            color: "#3b82f6",
            details: [
              t("intro.overview.feature2.detail1"),
              t("intro.overview.feature2.detail2"),
              t("intro.overview.feature2.detail3"),
            ],
          },
          {
            icon: <Settings size={28} />,
            title: t("intro.overview.feature3.title"),
            desc: t("intro.overview.feature3.desc"),
            color: "#10b981",
            details: [
              t("intro.overview.feature3.detail1"),
              t("intro.overview.feature3.detail2"),
              t("intro.overview.feature3.detail3"),
            ],
          },
          {
            icon: <Star size={28} />,
            title: t("intro.overview.feature4.title"),
            desc: t("intro.overview.feature4.desc"),
            color: "#f59e0b",
            details: [
              t("intro.overview.feature4.detail1"),
              t("intro.overview.feature4.detail2"),
              t("intro.overview.feature4.detail3"),
            ],
          },
          {
            icon: <Shield size={28} />,
            title: t("intro.overview.feature5.title"),
            desc: t("intro.overview.feature5.desc"),
            color: "#ef4444",
            details: [
              t("intro.overview.feature5.detail1"),
              t("intro.overview.feature5.detail2"),
              t("intro.overview.feature5.detail3"),
            ],
          },
          {
            icon: <Database size={28} />,
            title: t("intro.overview.feature6.title"),
            desc: t("intro.overview.feature6.desc"),
            color: "#06b6d4",
            details: [
              t("intro.overview.feature6.detail1"),
              t("intro.overview.feature6.detail2"),
              t("intro.overview.feature6.detail3"),
            ],
          },
        ].map((feature, index) => (
          <div
            key={index}
            style={{
              background: theme.cardBg,
              borderRadius: "20px",
              padding: "28px",
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 상단 컬러 라인 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: feature.color,
              }}
            />

            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: feature.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: "white",
                boxShadow: `0 8px 20px ${feature.color}40`,
              }}
            >
              {feature.icon}
            </div>
            <h4
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: theme.text,
                margin: "0 0 12px 0",
                lineHeight: "1.3",
              }}
            >
              {feature.title}
            </h4>
            <p
              style={{
                fontSize: "15px",
                color: theme.textSecondary,
                lineHeight: "1.6",
                margin: "0 0 16px 0",
              }}
            >
              {feature.desc}
            </p>

            <div style={{ marginTop: "16px" }}>
              {feature.details.map((detail, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: feature.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      color: theme.textSecondary,
                      fontWeight: "500",
                    }}
                  >
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 주요 활용 분야 */}
      <div
        style={{
          background: theme.cardBg,
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          {t("intro.overview.industryTitle")}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              industry: t("intro.overview.industry1.name"),
              icon: "🎯",
              effects: [
                t("intro.overview.industry1.effect1"),
                t("intro.overview.industry1.effect2"),
                t("intro.overview.industry1.effect3"),
                t("intro.overview.industry1.effect4"),
              ],
              result: t("intro.overview.industry1.result"),
            },
            {
              industry: t("intro.overview.industry2.name"),
              icon: "📈",
              effects: [
                t("intro.overview.industry2.effect1"),
                t("intro.overview.industry2.effect2"),
                t("intro.overview.industry2.effect3"),
                t("intro.overview.industry2.effect4"),
              ],
              result: t("intro.overview.industry2.result"),
            },
            {
              industry: t("intro.overview.industry3.name"),
              icon: "🎬",
              effects: [
                t("intro.overview.industry3.effect1"),
                t("intro.overview.industry3.effect2"),
                t("intro.overview.industry3.effect3"),
                t("intro.overview.industry3.effect4"),
              ],
              result: t("intro.overview.industry3.result"),
            },
          ].map((sector, index) => (
            <div
              key={index}
              style={{
                background:
                  theme.cardBg === "#ffffff"
                    ? "rgba(0, 0, 0, 0.02)"
                    : "rgba(255, 255, 255, 0.05)",
                borderRadius: "16px",
                padding: "24px",
                border: `1px solid ${theme.cardBorder}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontSize: "32px" }}>{sector.icon}</span>
                <h4
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: theme.text,
                    margin: 0,
                  }}
                >
                  {sector.industry}
                </h4>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 16px 0",
                }}
              >
                {sector.effects.map((effect, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      marginBottom: "8px",
                      fontSize: "14px",
                      color: theme.textSecondary,
                      lineHeight: "1.4",
                    }}
                  >
                    <span
                      style={{
                        color: "#10b981",
                        fontSize: "16px",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      ✓
                    </span>
                    {effect}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "8px",
                  borderLeft: "3px solid #10b981",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: theme.text,
                    fontWeight: "600",
                    margin: 0,
                    lineHeight: "1.4",
                  }}
                >
                  💡 {sector.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "32px",
          padding: "20px",
          background: theme.cardBg,
          borderRadius: "16px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Checkbox
          checked={stepCompletion.overview}
          onChange={() => handleStepComplete("overview")}
          label={
            <span
              style={{
                color: theme.text,
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "1.5",
              }}
            >
              {t("intro.overview.checkboxLabel")}
            </span>
          }
        />
      </div>
    </div>
  );

  // Step 2: Data Structure (데이터 구조)
  const renderStep2DataStructure = () => (
    <div>
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "800",
          color: theme.text,
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        {t("intro.dataStructure.title")}
      </h2>

      <p
        style={{
          fontSize: "18px",
          color: theme.textSecondary,
          textAlign: "center",
          marginBottom: "32px",
          lineHeight: "1.6",
          maxWidth: "800px",
          margin: "0 auto 32px",
        }}
      >
        {t("intro.dataStructure.subtitle")}{" "}
        <strong style={{ color: theme.text }}>
          {t("intro.dataStructure.subtitleHighlight")}
        </strong>{" "}
        <strong style={{ color: theme.text }}>
          {t("intro.dataStructure.subtitleHighlight2")}
        </strong>
        <br />
        {t("intro.dataStructure.subtitleEnd")}
      </p>

      {/* SDK 통합 플로우 */}
      <div
        style={{
          background:
            theme.cardBg === "#ffffff"
              ? "rgba(59, 130, 246, 0.05)"
              : "rgba(59, 130, 246, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Settings size={28} style={{ color: "#3b82f6" }} />
          {t("intro.dataStructure.sdkTitle")}
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <img
            src={sdkImage}
            alt="SDK 통합 플로우"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          {t("intro.dataStructure.sdkDescription")}{" "}
          <strong>{t("intro.dataStructure.sdkDescription2")}</strong>
          {t("intro.dataStructure.sdkDescription3")}
          <br />
          {t("intro.dataStructure.sdkDescription4")}{" "}
          <strong>{t("intro.dataStructure.sdkDescription5")}</strong>
          {t("intro.dataStructure.sdkDescription6")}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {[
            {
              title: t("intro.dataStructure.sdk1.title"),
              desc: t("intro.dataStructure.sdk1.desc"),
              icon: "📱",
              color: "#3b82f6",
            },
            {
              title: t("intro.dataStructure.sdk2.title"),
              desc: t("intro.dataStructure.sdk2.desc"),
              icon: "🖥️",
              color: "#10b981",
            },
            {
              title: t("intro.dataStructure.sdk3.title"),
              desc: t("intro.dataStructure.sdk3.desc"),
              icon: "🚌",
              color: "#f59e0b",
            },
            {
              title: t("intro.dataStructure.sdk4.title"),
              desc: t("intro.dataStructure.sdk4.desc"),
              icon: "📦",
              color: "#8b5cf6",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background:
                  theme.cardBg === "#ffffff"
                    ? `rgba(${
                        item.color === "#3b82f6"
                          ? "59, 130, 246"
                          : item.color === "#10b981"
                          ? "16, 185, 129"
                          : item.color === "#f59e0b"
                          ? "245, 158, 11"
                          : "139, 92, 246"
                      }, 0.05)`
                    : `rgba(${
                        item.color === "#3b82f6"
                          ? "59, 130, 246"
                          : item.color === "#10b981"
                          ? "16, 185, 129"
                          : item.color === "#f59e0b"
                          ? "245, 158, 11"
                          : "139, 92, 246"
                      }, 0.1)`,
                borderRadius: "12px",
                padding: "16px",
                border: `1px solid ${item.color}30`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                {item.icon}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  lineHeight: "1.4",
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 시스템 아키텍처 */}
      <div
        style={{
          background:
            theme.cardBg === "#ffffff"
              ? "rgba(16, 185, 129, 0.05)"
              : "rgba(16, 185, 129, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Database size={28} style={{ color: "#10b981" }} />
          {t("intro.dataStructure.architectureTitle")}
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <img
            src={architectureImage}
            alt="시스템 아키텍처"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          {t("intro.dataStructure.archDescription")}{" "}
          <strong>{t("intro.dataStructure.archDescription2")}</strong>
          {t("intro.dataStructure.archDescription3")}{" "}
          <strong>{t("intro.dataStructure.archDescription4")}</strong>
          {t("intro.dataStructure.archDescription5")}
          <br />
          <strong>{t("intro.dataStructure.archDescription6")}</strong>
          {t("intro.dataStructure.archDescription7")}{" "}
          <strong>{t("intro.dataStructure.archDescription8")}</strong>
          {t("intro.dataStructure.archDescription9")}
          <br />
          <strong>{t("intro.dataStructure.archDescription10")}</strong>
          {t("intro.dataStructure.archDescription11")}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {[
            {
              title: t("intro.dataStructure.arch1.title"),
              desc: t("intro.dataStructure.arch1.desc"),
              icon: "📡",
              color: "#3b82f6",
            },
            {
              title: t("intro.dataStructure.arch2.title"),
              desc: t("intro.dataStructure.arch2.desc"),
              icon: "🔄",
              color: "#10b981",
            },
            {
              title: t("intro.dataStructure.arch3.title"),
              desc: t("intro.dataStructure.arch3.desc"),
              icon: "⚡",
              color: "#f59e0b",
            },
            {
              title: t("intro.dataStructure.arch4.title"),
              desc: t("intro.dataStructure.arch4.desc"),
              icon: "🏭",
              color: "#8b5cf6",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background:
                  theme.cardBg === "#ffffff"
                    ? `rgba(${
                        item.color === "#3b82f6"
                          ? "59, 130, 246"
                          : item.color === "#10b981"
                          ? "16, 185, 129"
                          : item.color === "#f59e0b"
                          ? "245, 158, 11"
                          : "139, 92, 246"
                      }, 0.05)`
                    : `rgba(${
                        item.color === "#3b82f6"
                          ? "59, 130, 246"
                          : item.color === "#10b981"
                          ? "16, 185, 129"
                          : item.color === "#f59e0b"
                          ? "245, 158, 11"
                          : "139, 92, 246"
                      }, 0.1)`,
                borderRadius: "12px",
                padding: "16px",
                border: `1px solid ${item.color}30`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                {item.icon}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  lineHeight: "1.4",
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 테이블 구조 */}
      <div
        style={{
          background:
            theme.cardBg === "#ffffff"
              ? "rgba(245, 158, 11, 0.05)"
              : "rgba(245, 158, 11, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <TableProperties size={28} style={{ color: "#f59e0b" }} />
          {t("intro.dataStructure.tableTitle")}
        </h3>

        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.6",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          {t("intro.dataStructure.tableDescription")}{" "}
          <strong>{t("intro.dataStructure.tableDescription2")}</strong>
          {t("intro.dataStructure.tableDescription3")}
          <br />
          {t("intro.dataStructure.tableDescription4")}{" "}
          <strong>{t("intro.dataStructure.tableDescription5")}</strong>
          {t("intro.dataStructure.tableDescription6")}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <img
            src={tableStructureImage}
            alt="테이블 구조"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>

        {/* 테이블 상세 설명 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            marginBottom: "40px",
          }}
        >
          {/* Users Table */}
          <div
            style={{
              background:
                theme.cardBg === "#ffffff"
                  ? "rgba(59, 130, 246, 0.05)"
                  : "rgba(59, 130, 246, 0.1)",
              borderRadius: "20px",
              padding: "32px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 배경 그래디언트 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
                borderRadius: "50%",
                transform: "translate(30%, -30%)",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                }}
              >
                👤
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: theme.text,
                    margin: 0,
                    textAlign: "left",
                  }}
                >
                  {t("intro.dataStructure.usersTableTitle")}
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#3b82f6",
                    margin: 0,
                    textAlign: "left",
                  }}
                >
                  {t("intro.dataStructure.usersTableSubtitle")}
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: "15px",
                color: theme.textSecondary,
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              <strong>{t("intro.dataStructure.usersTableDescription")}</strong>{" "}
              {t("intro.dataStructure.usersTableDescription2")}
            </p>

            <div
              style={{
                background:
                  theme.cardBg === "#ffffff"
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <h5
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {t("intro.dataStructure.coreColumns")}
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {[
                  "user_id",
                  "account_id",
                  "distinct_id",
                  "name",
                  "email",
                  "age",
                  "gender",
                  "location",
                  "signup_date",
                  "last_login",
                  "user_level",
                  "custom_props",
                ].map((column, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "12px",
                      fontFamily: "monospace",
                      color: "#3b82f6",
                      fontWeight: "600",
                      background: "rgba(59, 130, 246, 0.1)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {column}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {[
                t("intro.dataStructure.usersTable.tag1"),
                t("intro.dataStructure.usersTable.tag2"),
                t("intro.dataStructure.usersTable.tag3"),
                t("intro.dataStructure.usersTable.tag4"),
              ].map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: "11px",
                    background: "rgba(59, 130, 246, 0.15)",
                    color: "#3b82f6",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Events Table */}
          <div
            style={{
              background:
                theme.cardBg === "#ffffff"
                  ? "rgba(139, 92, 246, 0.05)"
                  : "rgba(139, 92, 246, 0.1)",
              borderRadius: "20px",
              padding: "32px",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 배경 그래디언트 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))",
                borderRadius: "50%",
                transform: "translate(30%, -30%)",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                }}
              >
                ⚡
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: theme.text,
                    margin: 0,
                    textAlign: "left",
                  }}
                >
                  {t("intro.dataStructure.eventsTableTitle")}
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#8b5cf6",
                    margin: 0,
                    textAlign: "left",
                  }}
                >
                  {t("intro.dataStructure.eventsTableSubtitle")}
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: "15px",
                color: theme.textSecondary,
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              {t("intro.dataStructure.eventsTableDescription")}{" "}
              <strong>
                {t("intro.dataStructure.eventsTableDescription2")}
              </strong>
            </p>

            <div
              style={{
                background:
                  theme.cardBg === "#ffffff"
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <h5
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {t("intro.dataStructure.coreColumns")}
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {[
                  "event_id",
                  "user_id",
                  "event_name",
                  "timestamp",
                  "session_id",
                  "page_url",
                  "device_type",
                  "os_version",
                  "browser",
                  "ip_address",
                  "properties",
                  "custom_events",
                ].map((column, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "12px",
                      fontFamily: "monospace",
                      color: "#8b5cf6",
                      fontWeight: "600",
                      background: "rgba(139, 92, 246, 0.1)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {column}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {[
                t("intro.dataStructure.eventsTable.tag1"),
                t("intro.dataStructure.eventsTable.tag2"),
                t("intro.dataStructure.eventsTable.tag3"),
                t("intro.dataStructure.eventsTable.tag4"),
              ].map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: "11px",
                    background: "rgba(139, 92, 246, 0.15)",
                    color: "#8b5cf6",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 테이블 관계도 */}
        <div
          style={{
            background:
              theme.cardBg === "#ffffff"
                ? "rgba(245, 158, 11, 0.05)"
                : "rgba(245, 158, 11, 0.1)",
            borderRadius: "20px",
            padding: "32px",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px",
              }}
            >
              🔗
            </div>
            <h4
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: theme.text,
                margin: 0,
              }}
            >
              {t("intro.dataStructure.relationshipTitle")}
            </h4>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: "24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>👤</div>
              <h5
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: theme.text,
                  margin: "0 0 8px 0",
                }}
              >
                Users Table
              </h5>
              <p
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  margin: "0 0 12px 0",
                }}
              >
                user_id = "U001"
                <br />
                name = "{t("intro.dataStructure.exampleName")}"
                <br />
                age = 28
              </p>
              <div
                style={{
                  background: "#3b82f6",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "600",
                  display: "inline-block",
                }}
              >
                {t("intro.dataStructure.staticData")}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "2px",
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                }}
              />
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  fontWeight: "600",
                  padding: "4px 8px",
                  background: "rgba(245, 158, 11, 0.1)",
                  borderRadius: "8px",
                }}
              >
                {t("intro.dataStructure.connection")}
              </div>
              <div
                style={{
                  width: "60px",
                  height: "2px",
                  background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
                }}
              />
            </div>

            <div
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚡</div>
              <h5
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: theme.text,
                  margin: "0 0 8px 0",
                }}
              >
                Events Table
              </h5>
              <p
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  margin: "0 0 12px 0",
                }}
              >
                user_id = "U001"
                <br />
                event = "{t("intro.dataStructure.exampleEvent")}"
                <br />
                timestamp = "14:30:25"
              </p>
              <div
                style={{
                  background: "#8b5cf6",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "600",
                  display: "inline-block",
                }}
              >
                {t("intro.dataStructure.dynamicData")}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              padding: "16px",
              background: "rgba(245, 158, 11, 0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: theme.text,
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              💡 <strong>{t("intro.dataStructure.combinedPower")}</strong>{" "}
              {t("intro.dataStructure.combinedPowerDesc1")}
              <br />
              <strong>{t("intro.dataStructure.combinedPowerDesc2")}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 유저 식별체계 */}
      <div
        style={{
          background:
            theme.cardBg === "#ffffff"
              ? "rgba(139, 92, 246, 0.05)"
              : "rgba(139, 92, 246, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid rgba(139, 92, 246, 0.2)",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Settings size={28} style={{ color: "#3b82f6" }} />
          {t("intro.dataStructure.userIdTitle")}
        </h3>

        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          {t("intro.dataStructure.userIdDescription")}{" "}
          <strong>{t("intro.dataStructure.userIdDescription2")}</strong>
          {t("intro.dataStructure.userIdDescription3")}
          <br />
          {t("intro.dataStructure.userIdDescription4")}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              title: t("intro.dataStructure.accountId.title"),
              purpose: t("intro.dataStructure.accountId.purpose"),
              desc: t("intro.dataStructure.accountId.desc"),
              icon: "👤",
              color: "#3b82f6",
              example: t("intro.dataStructure.accountId.example"),
              when: t("intro.dataStructure.accountId.when"),
              pros: [
                t("intro.dataStructure.accountId.pro1"),
                t("intro.dataStructure.accountId.pro2"),
                t("intro.dataStructure.accountId.pro3"),
              ],
            },
            {
              title: t("intro.dataStructure.distinctId.title"),
              purpose: t("intro.dataStructure.distinctId.purpose"),
              desc: t("intro.dataStructure.distinctId.desc"),
              icon: "🔍",
              color: "#10b981",
              example: t("intro.dataStructure.distinctId.example"),
              when: t("intro.dataStructure.distinctId.when"),
              pros: [
                t("intro.dataStructure.distinctId.pro1"),
                t("intro.dataStructure.distinctId.pro2"),
                t("intro.dataStructure.distinctId.pro3"),
              ],
            },
            {
              title: t("intro.dataStructure.userId.title"),
              purpose: t("intro.dataStructure.userId.purpose"),
              desc: t("intro.dataStructure.userId.desc"),
              icon: "🔐",
              color: "#f59e0b",
              example: t("intro.dataStructure.userId.example"),
              when: t("intro.dataStructure.userId.when"),
              pros: [
                t("intro.dataStructure.userId.pro1"),
                t("intro.dataStructure.userId.pro2"),
                t("intro.dataStructure.userId.pro3"),
              ],
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background:
                  theme.cardBg === "#ffffff"
                    ? `rgba(${
                        item.color === "#3b82f6"
                          ? "59, 130, 246"
                          : item.color === "#10b981"
                          ? "16, 185, 129"
                          : "245, 158, 11"
                      }, 0.05)`
                    : `rgba(${
                        item.color === "#3b82f6"
                          ? "59, 130, 246"
                          : item.color === "#10b981"
                          ? "16, 185, 129"
                          : "245, 158, 11"
                      }, 0.1)`,
                borderRadius: "16px",
                padding: "24px",
                border: `1px solid ${item.color}30`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 상단 컬러 라인 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: item.color,
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "24px" }}>{item.icon}</div>
                <div>
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: theme.text,
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: item.color,
                      margin: 0,
                    }}
                  >
                    {item.purpose}
                  </p>
                </div>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  color: theme.textSecondary,
                  lineHeight: "1.5",
                  marginBottom: "16px",
                }}
              >
                {item.desc}
              </p>

              <div
                style={{
                  background:
                    theme.cardBg === "#ffffff"
                      ? "rgba(0, 0, 0, 0.03)"
                      : "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    margin: "0 0 4px 0",
                  }}
                >
                  {t("intro.example")}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.text,
                    margin: 0,
                    fontFamily: "monospace",
                  }}
                >
                  {item.example}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: item.color,
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    fontWeight: "600",
                  }}
                >
                  {t("intro.dataStructure.usageTime")}: {item.when}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                {item.pros.map((pro, proIndex) => (
                  <span
                    key={proIndex}
                    style={{
                      fontSize: "11px",
                      background: `${item.color}20`,
                      color: item.color,
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {pro}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ID 연결 플로우 */}
        <div
          style={{
            background:
              theme.cardBg === "#ffffff"
                ? "rgba(139, 92, 246, 0.05)"
                : "rgba(139, 92, 246, 0.1)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#8b5cf6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
              }}
            >
              🔗
            </div>
            <h4
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: theme.text,
                margin: 0,
              }}
            >
              {t("intro.dataStructure.idFlowTitle")}
            </h4>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
              alignItems: "center",
              gap: "16px",
              textAlign: "center",
            }}
          >
            {/* Step 1 */}
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("intro.dataStructure.flow.step1")}
              </div>
              <div
                style={{
                  background: "#10b981",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  fontFamily: "monospace",
                }}
              >
                #distinct_id
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#10b981",
                  marginTop: "4px",
                  fontFamily: "monospace",
                }}
              >
                {t("intro.dataStructure.flow.label1")}
              </div>
            </div>

            {/* Arrow 1 */}
            <div style={{ color: theme.textSecondary, fontSize: "16px" }}>
              →
            </div>

            {/* Step 2 */}
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("intro.dataStructure.flow.step2")}
              </div>
              <div
                style={{
                  background: "#8b5cf6",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  fontFamily: "monospace",
                }}
              >
                {t("intro.dataStructure.idConnection")}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#8b5cf6",
                  marginTop: "4px",
                }}
              >
                {t("intro.dataStructure.flow.label2")}
              </div>
            </div>

            {/* Arrow 2 */}
            <div style={{ color: theme.textSecondary, fontSize: "16px" }}>
              →
            </div>

            {/* Step 3 */}
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("intro.dataStructure.flow.step3")}
              </div>
              <div
                style={{
                  background: "#3b82f6",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  fontFamily: "monospace",
                }}
              >
                #account_id
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#3b82f6",
                  marginTop: "4px",
                  fontFamily: "monospace",
                }}
              >
                {t("intro.dataStructure.flow.label3")}
              </div>
            </div>

            {/* Arrow 3 */}
            <div style={{ color: theme.textSecondary, fontSize: "16px" }}>
              →
            </div>

            {/* Step 4 */}
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("intro.dataStructure.flow.step4")}
              </div>
              <div
                style={{
                  background: "#f59e0b",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  fontFamily: "monospace",
                }}
              >
                #user_id
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#f59e0b",
                  marginTop: "4px",
                  fontFamily: "monospace",
                }}
              >
                {t("intro.dataStructure.flow.label4")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 완료 체크박스 */}
      <div
        style={{
          marginTop: "48px",
          padding: "24px",
          background: theme.cardBg,
          borderRadius: "16px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Checkbox
          id="data-structure-complete"
          checked={stepCompletion["data-structure"]}
          onChange={(checked) =>
            setStepCompletion((prev) => ({
              ...prev,
              "data-structure": checked,
            }))
          }
          label={
            <span
              style={{
                color: theme.text,
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "1.5",
              }}
            >
              {t("intro.dataStructure.checkboxLabel")}
            </span>
          }
        />
      </div>
    </div>
  );

  // Step 3: Tracking Policy (트래킹 정책)
  const renderStep3TrackingPolicy = () => (
    <div>
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "800",
          color: theme.text,
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        {t("intro.trackingPolicy.title")}
      </h2>

      <p
        style={{
          fontSize: "18px",
          color: theme.textSecondary,
          textAlign: "center",
          marginBottom: "32px",
          lineHeight: "1.6",
          maxWidth: "800px",
          margin: "0 auto 32px",
        }}
      >
        {t("intro.trackingPolicy.subtitle")}{" "}
        <strong style={{ color: theme.text }}>
          {t("intro.trackingPolicy.subtitleHighlight")}
        </strong>
        {t("intro.trackingPolicy.subtitleEnd")}
      </p>

      {/* 트래킹 정책 개요 */}
      <div
        style={{
          background:
            theme.cardBg === "#ffffff"
              ? "rgba(6, 182, 212, 0.05)"
              : "rgba(6, 182, 212, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid rgba(6, 182, 212, 0.2)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "16px",
          }}
        >
          {t("intro.trackingPolicy.overviewTitle")}
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.8",
            marginBottom: "24px",
            maxWidth: "700px",
            margin: "0 auto 24px",
          }}
        >
          {t("intro.trackingPolicy.overviewDescription1")}{" "}
          <strong>{t("intro.trackingPolicy.overviewDescription2")}</strong>{" "}
          <strong>{t("intro.trackingPolicy.overviewDescription3")}</strong>
          {t("intro.trackingPolicy.overviewDescription4")}
          <br />
          {t("intro.trackingPolicy.overviewDescription5")}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              icon: "🎯",
              title: t("intro.trackingPolicy.principle1.title"),
              desc: t("intro.trackingPolicy.principle1.desc"),
              color: "#06b6d4",
            },
            {
              icon: "📊",
              title: t("intro.trackingPolicy.principle2.title"),
              desc: t("intro.trackingPolicy.principle2.desc"),
              color: "#0891b2",
            },
            {
              icon: "🚀",
              title: t("intro.trackingPolicy.principle3.title"),
              desc: t("intro.trackingPolicy.principle3.desc"),
              color: "#0e7490",
            },
          ].map((principle, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                padding: "20px",
                background: theme.cardBg,
                borderRadius: "16px",
                border: `1px solid ${principle.color}30`,
                minWidth: "180px",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                {principle.icon}
              </div>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: principle.color,
                  margin: "0 0 8px 0",
                }}
              >
                {principle.title}
              </h4>
              <p
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  margin: 0,
                  lineHeight: "1.4",
                  whiteSpace: "pre-line",
                }}
              >
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 1. Event Table Detail Guide */}
      <div
        style={{
          background: theme.cardBg,
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Database size={28} style={{ color: "#06b6d4" }} />
          {t("intro.trackingPolicy.eventTableTitle")}
        </h3>

        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          {t("intro.trackingPolicy.eventTableDescription1")}
          <br />
          <strong>{t("intro.trackingPolicy.eventTableDescription2")}</strong>
        </p>

        {/* 이벤트 카테고리 분류 */}
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "16px",
            }}
          >
            {t("intro.trackingPolicy.eventCategoryTitle")}
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {[
              {
                category: t("intro.trackingPolicy.coreBusinessEvents.category"),
                priority: t("intro.trackingPolicy.coreBusinessEvents.priority"),
                color: "#ef4444",
                bgColor: "rgba(239, 68, 68, 0.1)",
                events: [
                  t("intro.trackingPolicy.event.purchase"),
                  t("intro.trackingPolicy.event.subscribe"),
                  t("intro.trackingPolicy.event.signup"),
                  t("intro.trackingPolicy.event.firstPurchase"),
                ],
                description: t(
                  "intro.trackingPolicy.coreBusinessEvents.description"
                ),
              },
              {
                category: t("intro.trackingPolicy.engagementEvents.category"),
                priority: t("intro.trackingPolicy.engagementEvents.priority"),
                color: "#3b82f6",
                bgColor: "rgba(59, 130, 246, 0.1)",
                events: [
                  t("intro.trackingPolicy.event.login"),
                  t("intro.trackingPolicy.event.orderMilestone"),
                  t("intro.trackingPolicy.event.restaurantSearched"),
                  t("intro.trackingPolicy.event.appOnboarding"),
                ],
                description: t(
                  "intro.trackingPolicy.engagementEvents.description"
                ),
              },
              {
                category: t(
                  "intro.trackingPolicy.tabletOptimizationEvents.category"
                ),
                priority: t(
                  "intro.trackingPolicy.tabletOptimizationEvents.priority"
                ),
                color: "#10b981",
                bgColor: "rgba(16, 185, 129, 0.1)",
                events: [
                  t("intro.trackingPolicy.event.pageView"),
                  t("intro.trackingPolicy.event.search"),
                  t("intro.trackingPolicy.event.buttonClick"),
                  t("intro.trackingPolicy.event.itemView"),
                ],
                description: t(
                  "intro.trackingPolicy.tabletOptimizationEvents.description"
                ),
              },
            ].map((eventGroup, index) => (
              <div
                key={index}
                style={{
                  background: eventGroup.bgColor,
                  borderRadius: "16px",
                  padding: "20px",
                  border: `1px solid ${eventGroup.color}30`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: eventGroup.color,
                    borderRadius: "16px 16px 0 0",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: eventGroup.color,
                      margin: 0,
                    }}
                  >
                    {eventGroup.category}
                  </h5>
                  <span
                    style={{
                      fontSize: "10px",
                      background: eventGroup.color,
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      fontWeight: "600",
                    }}
                  >
                    {eventGroup.priority}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    marginBottom: "12px",
                    lineHeight: "1.4",
                  }}
                >
                  {eventGroup.description}
                </p>

                {eventGroup.events.map((event, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: "11px",
                      color: theme.text,
                      fontFamily: "monospace",
                      background: theme.cardBg,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      display: "inline-block",
                      marginRight: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    • {event}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Actual Event Table */}
        <div
          style={{
            background:
              theme.cardBg === "#ffffff"
                ? "rgba(6, 182, 212, 0.05)"
                : "rgba(6, 182, 212, 0.1)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(6, 182, 212, 0.2)",
          }}
        >
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {t("intro.trackingPolicy.eventTableExampleTitle")}
          </h4>

          <div
            style={{
              overflowX: "auto",
              marginBottom: "16px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "11px",
                background: theme.cardBg,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(6, 182, 212, 0.2)" }}>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.eventName")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.eventAlias")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.eventDescription")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.eventTag")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyType")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyDataType")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyDetailType")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    event: "order_completed",
                    alias: t("intro.trackingPolicy.eventAlias.orderCompleted"),
                    desc: t("intro.trackingPolicy.eventDesc.orderCompleted"),
                    tag: "revenue",
                    properties: [
                      {
                        name: "order_id",
                        type: "string",
                        desc: t("intro.trackingPolicy.property.orderId"),
                      },
                      {
                        name: "restaurant_id",
                        type: "string",
                        desc: t("intro.trackingPolicy.property.restaurantId"),
                      },
                      {
                        name: "order_amount",
                        type: "number",
                        desc: t("intro.trackingPolicy.property.orderAmount"),
                      },
                      {
                        name: "food_category",
                        type: "string",
                        desc: t("intro.trackingPolicy.property.foodCategory"),
                      },
                      {
                        name: "payment_method",
                        type: "string",
                        desc: t("intro.trackingPolicy.property.paymentMethod"),
                      },
                    ],
                  },
                  {
                    event: "restaurant_searched",
                    alias: t(
                      "intro.trackingPolicy.eventAlias.restaurantSearched"
                    ),
                    desc: t(
                      "intro.trackingPolicy.eventDesc.restaurantSearched"
                    ),
                    tag: "engagement",
                    properties: [
                      {
                        name: "search_keyword",
                        type: "string",
                        desc: t("intro.trackingPolicy.property.searchKeyword"),
                      },
                      {
                        name: "search_type",
                        type: "string",
                        desc: t("intro.trackingPolicy.property.searchType"),
                      },
                      {
                        name: "result_count",
                        type: "number",
                        desc: t("intro.trackingPolicy.property.resultCount"),
                      },
                      {
                        name: "search_location",
                        type: "string",
                        desc: t("intro.trackingPolicy.property.searchLocation"),
                      },
                      {
                        name: "search_filters",
                        type: "string",
                        desc: t("intro.trackingPolicy.property.searchFilters"),
                      },
                    ],
                  },
                  {
                    event: "order_milestone_achieved",
                    alias: t("intro.trackingPolicy.eventAlias.orderMilestone"),
                    desc: t("intro.trackingPolicy.eventDesc.orderMilestone"),
                    tag: "progression",
                    properties: [
                      {
                        name: "milestone_count",
                        type: "number",
                        desc: t("intro.trackingPolicy.property.milestoneCount"),
                      },
                      {
                        name: "member_level",
                        type: "string",
                        desc: t("intro.trackingPolicy.property.memberLevel"),
                      },
                      {
                        name: "total_spent",
                        type: "number",
                        desc: t("intro.trackingPolicy.property.totalSpent"),
                      },
                      {
                        name: "signup_days",
                        type: "number",
                        desc: t("intro.trackingPolicy.property.signupDays"),
                      },
                    ],
                  },
                  {
                    event: "app_onboarding_completed",
                    alias: t("intro.trackingPolicy.eventAlias.appOnboarding"),
                    desc: t("intro.trackingPolicy.eventDesc.appOnboarding"),
                    tag: "onboarding",
                    properties: [
                      {
                        name: "onboarding_duration",
                        type: "number",
                        desc: t("intro.trackingPolicy.property.completionTime"),
                      },
                      {
                        name: "steps_completed",
                        type: "number",
                        desc: t("intro.trackingPolicy.property.completedSteps"),
                      },
                      {
                        name: "location_permission_granted",
                        type: "boolean",
                        desc: t(
                          "intro.trackingPolicy.property.locationPermission"
                        ),
                      },
                      {
                        name: "notification_permission_granted",
                        type: "boolean",
                        desc: t(
                          "intro.trackingPolicy.property.notificationPermission"
                        ),
                      },
                    ],
                  },
                ].map((eventData, rowIndex) =>
                  eventData.properties.map((prop, propIndex) => (
                    <tr
                      key={`${rowIndex}-${propIndex}`}
                      style={{
                        background:
                          propIndex === 0
                            ? "rgba(6, 182, 212, 0.05)"
                            : "transparent",
                        borderBottom:
                          propIndex === eventData.properties.length - 1
                            ? `2px solid ${theme.cardBorder}`
                            : `1px solid ${theme.cardBorder}`,
                      }}
                    >
                      {propIndex === 0 && (
                        <>
                          <td
                            rowSpan={eventData.properties.length}
                            style={{
                              padding: "8px",
                              verticalAlign: "top",
                              color: theme.text,
                              fontWeight: "600",
                              fontFamily: "monospace",
                              background: "rgba(6, 182, 212, 0.1)",
                            }}
                          >
                            {eventData.event}
                          </td>
                          <td
                            rowSpan={eventData.properties.length}
                            style={{
                              padding: "8px",
                              verticalAlign: "top",
                              color: theme.text,
                              fontWeight: "600",
                            }}
                          >
                            {eventData.alias}
                          </td>
                          <td
                            rowSpan={eventData.properties.length}
                            style={{
                              padding: "8px",
                              verticalAlign: "top",
                              color: theme.textSecondary,
                              lineHeight: "1.3",
                              maxWidth: "200px",
                            }}
                          >
                            {eventData.desc}
                          </td>
                          <td
                            rowSpan={eventData.properties.length}
                            style={{
                              padding: "8px",
                              verticalAlign: "top",
                            }}
                          >
                            <span
                              style={{
                                background:
                                  eventData.tag === "revenue"
                                    ? "#ef4444"
                                    : eventData.tag === "engagement"
                                    ? "#3b82f6"
                                    : eventData.tag === "progression"
                                    ? "#10b981"
                                    : "#8b5cf6",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: "6px",
                                fontSize: "9px",
                                fontWeight: "600",
                              }}
                            >
                              {eventData.tag}
                            </span>
                          </td>
                        </>
                      )}
                      <td
                        style={{
                          padding: "8px",
                          color: theme.text,
                          fontFamily: "monospace",
                          fontWeight: "600",
                        }}
                      >
                        {prop.name}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          color:
                            prop.type === "string"
                              ? "#3b82f6"
                              : prop.type === "number"
                              ? "#10b981"
                              : prop.type === "boolean"
                              ? "#f59e0b"
                              : theme.textSecondary,
                          fontFamily: "monospace",
                          fontWeight: "600",
                        }}
                      >
                        {prop.type}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          color: theme.textSecondary,
                          lineHeight: "1.3",
                        }}
                      >
                        {prop.desc}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. User Table Detail Guide */}
      <div
        style={{
          background: theme.cardBg,
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Settings size={28} style={{ color: "#8b5cf6" }} />
          {t("intro.trackingPolicy.userTableTitle")}
        </h3>

        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          {t("intro.trackingPolicy.userStateManagement")}
          <br />
          <strong>{t("intro.trackingPolicy.updateMethod")}</strong>
          {t("intro.trackingPolicy.updateMethodDescription")}
          {t("intro.trackingPolicy.updateMethodImportance")}
        </p>

        {/* 업데이트 방식 설명 */}
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "16px",
            }}
          >
            {t("intro.trackingPolicy.userUpdateTypes.title")}
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            {[
              {
                method: t("intro.trackingPolicy.fixed.title"),
                color: "#ef4444",
                bgColor: "rgba(239, 68, 68, 0.1)",
                icon: "🔒",
                description: t("intro.trackingPolicy.fixed.desc"),
                use_case: t("intro.trackingPolicy.fixed.example"),
                examples: [
                  "reg_date: 2024-01-15",
                  "acquisition_channel: google_ads",
                  "first_purchase_date: 2024-01-20",
                  "signup_country: KR",
                ],
              },
              {
                method: t("intro.trackingPolicy.latest.title"),
                color: "#3b82f6",
                bgColor: "rgba(59, 130, 246, 0.1)",
                icon: "🔄",
                description: t("intro.trackingPolicy.latest.desc"),
                use_case: t("intro.trackingPolicy.latest.example"),
                examples: [
                  "current_level: 25 → 26",
                  "last_login: 2024-03-14",
                  "vip_status: bronze → silver",
                  "last_item_purchased: sword_001",
                ],
              },
              {
                method: t("intro.trackingPolicy.cumulative.title"),
                color: "#10b981",
                bgColor: "rgba(16, 185, 129, 0.1)",
                icon: "➕",
                description: t("intro.trackingPolicy.cumulative.desc"),
                use_case: t("intro.trackingPolicy.cumulative.example"),
                examples: [
                  "total_revenue: 30000 + 5000 = 35000",
                  "login_count: 45 + 1 = 46",
                  `total_playtime: 120 + 30 = 150${t(
                    "intro.trackingPolicy.minutes"
                  )}`,
                  "battle_wins: 28 + 1 = 29",
                ],
              },
            ].map((updateMethod, index) => (
              <div
                key={index}
                style={{
                  background: updateMethod.bgColor,
                  borderRadius: "16px",
                  padding: "24px",
                  border: `1px solid ${updateMethod.color}30`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: updateMethod.color,
                    borderRadius: "16px 16px 0 0",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: updateMethod.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    {updateMethod.icon}
                  </div>
                  <h5
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: updateMethod.color,
                      margin: 0,
                    }}
                  >
                    {updateMethod.method}
                  </h5>
                </div>

                <p
                  style={{
                    fontSize: "14px",
                    color: theme.textSecondary,
                    marginBottom: "12px",
                    lineHeight: "1.4",
                  }}
                >
                  {updateMethod.description}
                </p>

                <div
                  style={{
                    background: theme.cardBg,
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: theme.text,
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    {t("intro.trackingPolicy.useCaseLabel")}
                  </div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: theme.textSecondary,
                      margin: 0,
                      lineHeight: "1.3",
                    }}
                  >
                    {updateMethod.use_case}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: theme.text,
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    {t("intro.trackingPolicy.exampleLabel")}
                  </div>
                  {updateMethod.examples.map((example, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: "10px",
                        fontFamily: "monospace",
                        background: "#1a1a1a",
                        color: "#00ff88",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actual User Table */}
        <div
          style={{
            background:
              theme.cardBg === "#ffffff"
                ? "rgba(139, 92, 246, 0.05)"
                : "rgba(139, 92, 246, 0.1)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          }}
        >
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {t("intro.trackingPolicy.userTableExampleTitle")}
          </h4>

          <div
            style={{
              overflowX: "auto",
              marginBottom: "16px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "11px",
                background: theme.cardBg,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(139, 92, 246, 0.2)" }}>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyType")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyAlias")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyDataType")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.updateMethod")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyDetailType")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyTag")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  // 고정값 속성
                  {
                    name: "reg_date",
                    alias: t("intro.trackingPolicy.regDate"),
                    type: "date",
                    method: t("intro.trackingPolicy.fixed.title"),
                    desc: t("intro.trackingPolicy.regDateDesc"),
                    tag: "identity",
                    color: "#ef4444",
                  },
                  {
                    name: "first_country",
                    alias: t("intro.trackingPolicy.firstCountry"),
                    type: "string",
                    method: t("intro.trackingPolicy.fixed.title"),
                    desc: t("intro.trackingPolicy.firstCountryDesc"),
                    tag: "identity",
                    color: "#ef4444",
                  },
                  {
                    name: "acquisition_channel",
                    alias: t("intro.trackingPolicy.acquisitionChannel"),
                    type: "string",
                    method: t("intro.trackingPolicy.fixed.title"),
                    desc: t("intro.trackingPolicy.acquisitionChannelDesc"),
                    tag: "acquisition",
                    color: "#ef4444",
                  },
                  {
                    name: "first_purchase_date",
                    alias: t("intro.trackingPolicy.firstPurchaseDate"),
                    type: "date",
                    method: t("intro.trackingPolicy.fixed.title"),
                    desc: t("intro.trackingPolicy.firstPurchaseDateDesc"),
                    tag: "monetization",
                    color: "#ef4444",
                  },
                  // 최신값 속성
                  {
                    name: "current_level",
                    alias: t("intro.trackingPolicy.currentLevel"),
                    type: "number",
                    method: t("intro.trackingPolicy.latest.title"),
                    desc: t("intro.trackingPolicy.currentLevelDesc"),
                    tag: "progression",
                    color: "#3b82f6",
                  },
                  {
                    name: "last_login",
                    alias: t("intro.trackingPolicy.lastLogin"),
                    type: "datetime",
                    method: t("intro.trackingPolicy.latest.title"),
                    desc: t("intro.trackingPolicy.lastLoginDesc"),
                    tag: "engagement",
                    color: "#3b82f6",
                  },
                  {
                    name: "vip_status",
                    alias: t("intro.trackingPolicy.vipStatus"),
                    type: "string",
                    method: t("intro.trackingPolicy.latest.title"),
                    desc: t("intro.trackingPolicy.vipStatusDesc"),
                    tag: "monetization",
                    color: "#3b82f6",
                  },
                  {
                    name: "last_item_purchased",
                    alias: t("intro.trackingPolicy.lastItemPurchased"),
                    type: "string",
                    method: t("intro.trackingPolicy.latest.title"),
                    desc: t("intro.trackingPolicy.lastItemPurchasedDesc"),
                    tag: "monetization",
                    color: "#3b82f6",
                  },
                  {
                    name: "current_stage",
                    alias: t("intro.trackingPolicy.currentStage"),
                    type: "string",
                    method: t("intro.trackingPolicy.latest.title"),
                    desc: t("intro.trackingPolicy.currentStageDesc"),
                    tag: "progression",
                    color: "#3b82f6",
                  },
                  // 누적값 속성
                  {
                    name: "total_revenue",
                    alias: t("intro.trackingPolicy.totalRevenue"),
                    type: "number",
                    method: t("intro.trackingPolicy.cumulative.title"),
                    desc: t("intro.trackingPolicy.totalRevenueDesc"),
                    tag: "monetization",
                    color: "#10b981",
                  },
                  {
                    name: "login_count",
                    alias: t("intro.trackingPolicy.loginCount"),
                    type: "number",
                    method: t("intro.trackingPolicy.cumulative.title"),
                    desc: t("intro.trackingPolicy.loginCountDesc"),
                    tag: "engagement",
                    color: "#10b981",
                  },
                  {
                    name: "total_playtime",
                    alias: t("intro.trackingPolicy.totalPlaytime"),
                    type: "number",
                    method: t("intro.trackingPolicy.cumulative.title"),
                    desc: t("intro.trackingPolicy.totalPlaytimeDesc"),
                    tag: "engagement",
                    color: "#10b981",
                  },
                  {
                    name: "battle_wins",
                    alias: t("intro.trackingPolicy.battleWins"),
                    type: "number",
                    method: t("intro.trackingPolicy.cumulative.title"),
                    desc: t("intro.trackingPolicy.battleWinsDesc"),
                    tag: "progression",
                    color: "#10b981",
                  },
                  {
                    name: "items_purchased",
                    alias: t("intro.trackingPolicy.itemsPurchased"),
                    type: "number",
                    method: t("intro.trackingPolicy.cumulative.title"),
                    desc: t("intro.trackingPolicy.itemsPurchasedDesc"),
                    tag: "monetization",
                    color: "#10b981",
                  },
                  {
                    name: "friends_invited",
                    alias: t("intro.trackingPolicy.friendInviteAlias"),
                    type: "number",
                    method: t("intro.trackingPolicy.cumulativeValue"),
                    desc: t("intro.trackingPolicy.friendInviteDesc"),
                    tag: "social",
                    color: "#10b981",
                  },
                ].map((userProp, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: `1px solid ${theme.cardBorder}`,
                      background:
                        index % 2 === 0
                          ? "rgba(139, 92, 246, 0.02)"
                          : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px",
                        color: theme.text,
                        fontFamily: "monospace",
                        fontWeight: "600",
                      }}
                    >
                      {userProp.name}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        color: theme.text,
                        fontWeight: "600",
                      }}
                    >
                      {userProp.alias}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        color:
                          userProp.type === "string"
                            ? "#3b82f6"
                            : userProp.type === "number"
                            ? "#10b981"
                            : userProp.type === "date" ||
                              userProp.type === "datetime"
                            ? "#f59e0b"
                            : theme.textSecondary,
                        fontFamily: "monospace",
                        fontWeight: "600",
                      }}
                    >
                      {userProp.type}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      <span
                        style={{
                          background: userProp.color,
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontSize: "10px",
                          fontWeight: "600",
                        }}
                      >
                        {userProp.method}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        color: theme.textSecondary,
                        lineHeight: "1.3",
                        maxWidth: "250px",
                      }}
                    >
                      {userProp.desc}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      <span
                        style={{
                          background:
                            userProp.tag === "identity"
                              ? "#6b7280"
                              : userProp.tag === "acquisition"
                              ? "#f59e0b"
                              : userProp.tag === "monetization"
                              ? "#ef4444"
                              : userProp.tag === "progression"
                              ? "#8b5cf6"
                              : userProp.tag === "engagement"
                              ? "#3b82f6"
                              : "#10b981",
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: "6px",
                          fontSize: "9px",
                          fontWeight: "600",
                        }}
                      >
                        {userProp.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. 공통 이벤트 속성 상세 가이드 */}
      <div
        style={{
          background: theme.cardBg,
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Star size={28} style={{ color: "#f59e0b" }} />
          {t("intro.trackingPolicy.commonPropertiesTitle")}
        </h3>

        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          {t("intro.trackingPolicy.commonPropertiesDescription")}
          <br />
          {t("intro.trackingPolicy.deviceInfoDescription")}
        </p>

        {/* 공통 속성 카테고리별 분류 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              category: t("intro.trackingPolicy.deviceEnvironmentInfo"),
              color: "#f59e0b",
              icon: "📱",
              description: t("intro.trackingPolicy.deviceAutoCollection"),
              properties: [
                { name: "platform", desc: "iOS, Android, Web" },
                {
                  name: "app_version",
                  desc: t("intro.trackingPolicy.appVersionExample"),
                },
                {
                  name: "os_version",
                  desc: t("intro.trackingPolicy.osVersion"),
                },
                {
                  name: "device_model",
                  desc: t("intro.trackingPolicy.deviceModel"),
                },
                {
                  name: "screen_resolution",
                  desc: t("intro.trackingPolicy.screenResolution"),
                },
                {
                  name: "network_type",
                  desc: t("intro.trackingPolicy.networkType"),
                },
              ],
            },
            {
              category: t("intro.trackingPolicy.regionLanguageInfo"),
              color: "#06b6d4",
              icon: "🌍",
              description: t("intro.trackingPolicy.regionLanguageInfoDesc"),
              properties: [
                { name: "country", desc: t("intro.trackingPolicy.country") },
                { name: "language", desc: t("intro.trackingPolicy.language") },
                { name: "city", desc: t("intro.trackingPolicy.city") },
                {
                  name: "ip_address",
                  desc: t("intro.trackingPolicy.ipAddress"),
                },
              ],
            },
            {
              category: t("intro.trackingPolicy.systemSdkInfo"),
              color: "#10b981",
              icon: "⚙️",
              description: t("intro.trackingPolicy.sdkSystemInfo"),
              properties: [
                {
                  name: "lib_version",
                  desc: t("intro.trackingPolicy.sdkVersion"),
                },
                { name: "lib_name", desc: t("intro.trackingPolicy.sdkName") },
                {
                  name: "data_source",
                  desc: t("intro.trackingPolicy.dataSource"),
                },
                {
                  name: "install_id",
                  desc: t("intro.trackingPolicy.installId"),
                },
              ],
            },
          ].map((commonGroup, index) => (
            <div
              key={index}
              style={{
                background:
                  theme.cardBg === "#ffffff"
                    ? `rgba(${
                        commonGroup.color === "#f59e0b"
                          ? "245, 158, 11"
                          : commonGroup.color === "#8b5cf6"
                          ? "139, 92, 246"
                          : commonGroup.color === "#06b6d4"
                          ? "6, 182, 212"
                          : "16, 185, 129"
                      }, 0.05)`
                    : `rgba(${
                        commonGroup.color === "#f59e0b"
                          ? "245, 158, 11"
                          : commonGroup.color === "#8b5cf6"
                          ? "139, 92, 246"
                          : commonGroup.color === "#06b6d4"
                          ? "6, 182, 212"
                          : "16, 185, 129"
                      }, 0.1)`,
                borderRadius: "16px",
                padding: "20px",
                border: `1px solid ${commonGroup.color}30`,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: commonGroup.color,
                  borderRadius: "16px 16px 0 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: commonGroup.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  {commonGroup.icon}
                </div>
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: commonGroup.color,
                    margin: 0,
                  }}
                >
                  {commonGroup.category}
                </h5>
              </div>

              <p
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginBottom: "12px",
                  lineHeight: "1.4",
                }}
              >
                {commonGroup.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "6px",
                }}
              >
                {commonGroup.properties.map((prop, propIdx) => (
                  <div
                    key={propIdx}
                    style={{
                      background: theme.cardBg,
                      borderRadius: "6px",
                      padding: "8px",
                      border: `1px solid ${theme.cardBorder}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: theme.text,
                        fontFamily: "monospace",
                        fontWeight: "600",
                      }}
                    >
                      {prop.name}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: theme.textSecondary,
                      }}
                    >
                      {prop.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 실제 공통 이벤트 속성 테이블 */}
        <div
          style={{
            background:
              theme.cardBg === "#ffffff"
                ? "rgba(245, 158, 11, 0.05)"
                : "rgba(245, 158, 11, 0.1)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            marginBottom: "24px",
          }}
        >
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {t("intro.trackingPolicy.commonPropertiesExampleTitle")}
          </h4>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "11px",
                background: theme.cardBg,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(245, 158, 11, 0.2)" }}>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyType")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyAlias")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyDataType")}
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      color: theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {t("intro.trackingPolicy.propertyDetailType")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "platform",
                    alias: t("intro.trackingPolicy.platform"),
                    type: "string",
                    desc: t("intro.trackingPolicy.platformDesc"),
                  },
                  {
                    name: "app_version",
                    alias: t("intro.trackingPolicy.appVersion"),
                    type: "string",
                    desc: t("intro.trackingPolicy.appVersionDesc"),
                  },
                  {
                    name: "os_version",
                    alias: t("intro.trackingPolicy.osVersionAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.osVersionDesc"),
                  },
                  {
                    name: "device_model",
                    alias: t("intro.trackingPolicy.deviceModelAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.deviceModelDesc"),
                  },
                  {
                    name: "screen_resolution",
                    alias: t("intro.trackingPolicy.screenResolutionAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.screenResolutionDesc"),
                  },
                  {
                    name: "network_type",
                    alias: t("intro.trackingPolicy.networkTypeAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.networkTypeDesc"),
                  },
                  {
                    name: "session_id",
                    alias: t("intro.trackingPolicy.sessionIdAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.sessionIdDesc"),
                  },
                  {
                    name: "session_duration",
                    alias: t("intro.trackingPolicy.sessionDurationAlias"),
                    type: "number",
                    desc: t("intro.trackingPolicy.sessionDurationDesc"),
                  },
                  {
                    name: "timestamp",
                    alias: t("intro.trackingPolicy.timestampAlias"),
                    type: "datetime",
                    desc: t("intro.trackingPolicy.timestampDesc"),
                  },
                  {
                    name: "timezone",
                    alias: t("intro.trackingPolicy.timezoneAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.timezoneDesc"),
                  },
                  {
                    name: "country",
                    alias: t("intro.trackingPolicy.countryAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.countryDesc"),
                  },
                  {
                    name: "language",
                    alias: t("intro.trackingPolicy.languageAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.languageDesc"),
                  },
                  {
                    name: "city",
                    alias: t("intro.trackingPolicy.cityAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.cityDesc"),
                  },
                  {
                    name: "ip_address",
                    alias: t("intro.trackingPolicy.ipAddressAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.ipAddressDesc"),
                  },
                  {
                    name: "lib_version",
                    alias: t("intro.trackingPolicy.libVersionAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.libVersionDesc"),
                  },
                  {
                    name: "lib_name",
                    alias: t("intro.trackingPolicy.libNameAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.libNameDesc"),
                  },
                  {
                    name: "data_source",
                    alias: t("intro.trackingPolicy.dataSourceAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.dataSourceDesc"),
                  },
                  {
                    name: "install_id",
                    alias: t("intro.trackingPolicy.installIdAlias"),
                    type: "string",
                    desc: t("intro.trackingPolicy.installIdDesc"),
                  },
                ].map((commonProp, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: `1px solid ${theme.cardBorder}`,
                      background:
                        index % 2 === 0
                          ? "rgba(245, 158, 11, 0.02)"
                          : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px",
                        color: theme.text,
                        fontFamily: "monospace",
                        fontWeight: "600",
                      }}
                    >
                      {commonProp.name}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        color: theme.text,
                        fontWeight: "600",
                      }}
                    >
                      {commonProp.alias}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        color:
                          commonProp.type === "string"
                            ? "#3b82f6"
                            : commonProp.type === "number"
                            ? "#10b981"
                            : commonProp.type === "datetime"
                            ? "#f59e0b"
                            : theme.textSecondary,
                        fontFamily: "monospace",
                        fontWeight: "600",
                      }}
                    >
                      {commonProp.type}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        color: theme.textSecondary,
                        lineHeight: "1.3",
                      }}
                    >
                      {commonProp.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 제한 사항 및 모범 사례 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background:
                theme.cardBg === "#ffffff"
                  ? "rgba(239, 68, 68, 0.05)"
                  : "rgba(239, 68, 68, 0.1)",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <h5
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#ef4444",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertTriangle size={20} />
              {t("intro.trackingPolicy.systemLimitations")}
            </h5>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {[
                `${t("intro.trackingPolicy.eventTypes")} 500${t(
                  "intro.trackingPolicy.countUnit"
                )}`,
                `${t("intro.trackingPolicy.eventProperties")} 1,000${t(
                  "intro.trackingPolicy.countUnit"
                )}`,
                `${t("intro.trackingPolicy.userProperties")} 500${t(
                  "intro.trackingPolicy.countUnit"
                )}`,
                `${t("intro.trackingPolicy.virtualProperties")} 3,000${t(
                  "intro.trackingPolicy.countUnit"
                )}`,
              ].map((limit, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: "13px",
                    color: theme.textSecondary,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#ef4444",
                    }}
                  />
                  <strong style={{ color: theme.text }}>
                    {limit.split(":")[0]}:
                  </strong>
                  {limit.split(":")[1]}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background:
                theme.cardBg === "#ffffff"
                  ? "rgba(16, 185, 129, 0.05)"
                  : "rgba(16, 185, 129, 0.1)",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <h5
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#10b981",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CheckCircle size={20} />
              {t("intro.trackingPolicy.bestPractices")}
            </h5>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {[
                t("intro.trackingPolicy.bestPractice1"),
                t("intro.trackingPolicy.bestPractice2"),
                t("intro.trackingPolicy.bestPractice3"),
                t("intro.trackingPolicy.bestPractice4"),
              ].map((practice, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: "13px",
                    color: theme.textSecondary,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  />
                  {practice}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "32px",
          padding: "20px",
          background: theme.cardBg,
          borderRadius: "16px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Checkbox
          checked={stepCompletion["tracking-policy"]}
          onChange={() => handleStepComplete("tracking-policy")}
          label={
            <span
              style={{
                color: theme.text,
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "1.5",
              }}
            >
              {t("intro.trackingPolicy.checkboxLabel")}
            </span>
          }
        />
      </div>
    </div>
  );

  // Step 4: Data Simulation (데이터 수집 시뮬레이션)
  const renderStep4DataSimulation = () => (
    <div>
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "800",
          color: theme.text,
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        {t("intro.dataSimulation.title")}
      </h2>

      <p
        style={{
          fontSize: "18px",
          color: theme.textSecondary,
          textAlign: "center",
          marginBottom: "32px",
          lineHeight: "1.6",
          maxWidth: "800px",
          margin: "0 auto 32px",
        }}
      >
        {t("intro.dataSimulation.subtitle")}{" "}
        <strong style={{ color: theme.text }}>
          {t("intro.dataSimulation.subtitleHighlight")}
        </strong>
        {t("intro.dataSimulation.subtitleConnector")}
        <br />
        <strong style={{ color: theme.text }}>
          {t("intro.dataSimulation.subtitleHighlight2")}
        </strong>{" "}
        {t("intro.dataSimulation.subtitleEnd")}
      </p>

      {/* SDK 데이터 수집 원리 상세 설명 */}
      <div
        style={{
          background:
            theme.cardBg === "#ffffff"
              ? "rgba(139, 92, 246, 0.05)"
              : "rgba(139, 92, 246, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "16px",
          }}
        >
          {t("intro.dataSimulation.sdkTitle")}
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.8",
            marginBottom: "24px",
            maxWidth: "700px",
            margin: "0 auto 24px",
          }}
        >
          {t("intro.dataSimulation.sdkDescription")}{" "}
          <strong>{t("intro.dataSimulation.sdkDescriptionHighlight1")}</strong>
          {t("intro.dataSimulation.sdkDescriptionAnd")}
          <br />
          <strong>{t("intro.dataSimulation.sdkDescriptionHighlight2")}</strong>
          {t("intro.dataSimulation.sdkDescriptionEnd")}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              icon: "⚡",
              title: t("intro.dataSimulation.realtimeDetection"),
              desc: t("intro.dataSimulation.realtimeDetectionDesc"),
              color: "#8b5cf6",
            },
            {
              icon: "🤖",
              title: t("intro.dataSimulation.autoCollection"),
              desc: t("intro.dataSimulation.autoCollectionDesc"),
              color: "#7c3aed",
            },
            {
              icon: "📡",
              title: t("intro.dataSimulation.secureTransmission"),
              desc: t("intro.dataSimulation.secureTransmissionDesc"),
              color: "#6d28d9",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                padding: "20px",
                background: theme.cardBg,
                borderRadius: "16px",
                border: `1px solid ${feature.color}30`,
                minWidth: "160px",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                {feature.icon}
              </div>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: feature.color,
                  margin: "0 0 8px 0",
                }}
              >
                {feature.title}
              </h4>
              <p
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  margin: 0,
                  lineHeight: "1.4",
                  whiteSpace: "pre-line",
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 상세한 데이터 수집 플로우 */}
      <div
        style={{
          background: theme.cardBg,
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Activity size={28} style={{ color: "#3b82f6" }} />
          {t("intro.dataSimulation.dataFlowTitle")}
        </h3>

        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          {t("intro.dataSimulation.dataFlowDescription")}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              step: t("intro.dataSimulation.step1"),
              title: t("intro.dataSimulation.step1Title"),
              icon: "👤",
              color: "#8b5cf6",
              detail: "User Action",
              description: t("intro.dataSimulation.step1Description"),
              examples: [
                t("intro.dataSimulation.step1Example1"),
                t("intro.dataSimulation.step1Example2"),
                t("intro.dataSimulation.step1Example3"),
                t("intro.dataSimulation.step1Example4"),
              ],
            },
            {
              step: t("intro.dataSimulation.step2"),
              title: t("intro.dataSimulation.step2Title"),
              icon: "⚡",
              color: "#3b82f6",
              detail: "Event Detection",
              description: t("intro.dataSimulation.step2Description"),
              examples: [
                t("intro.dataSimulation.step2Example1"),
                t("intro.dataSimulation.step2Example2"),
                t("intro.dataSimulation.step2Example3"),
                t("intro.dataSimulation.step2Example4"),
              ],
            },
            {
              step: t("intro.dataSimulation.step3"),
              title: t("intro.dataSimulation.step3Title"),
              icon: "📡",
              color: "#10b981",
              detail: "Data Transmission",
              description: t("intro.dataSimulation.step3Description"),
              examples: [
                t("intro.dataSimulation.step3Example1"),
                t("intro.dataSimulation.step3Example2"),
                t("intro.dataSimulation.step3Example3"),
                t("intro.dataSimulation.step3Example4"),
              ],
            },
            {
              step: t("intro.dataSimulation.step4"),
              title: t("intro.dataSimulation.step4Title"),
              icon: "🔄",
              color: "#f59e0b",
              detail: "Server Processing",
              description: t("intro.dataSimulation.step4Description"),
              examples: [
                t("intro.dataSimulation.step4Example1"),
                t("intro.dataSimulation.step4Example2"),
                t("intro.dataSimulation.step4Example3"),
                t("intro.dataSimulation.step4Example4"),
              ],
            },
          ].map((flowStep, index) => (
            <div
              key={index}
              style={{
                background:
                  theme.cardBg === "#ffffff"
                    ? `rgba(${
                        flowStep.color === "#8b5cf6"
                          ? "139, 92, 246"
                          : flowStep.color === "#3b82f6"
                          ? "59, 130, 246"
                          : flowStep.color === "#10b981"
                          ? "16, 185, 129"
                          : flowStep.color === "#f59e0b"
                          ? "245, 158, 11"
                          : "239, 68, 68"
                      }, 0.05)`
                    : `rgba(${
                        flowStep.color === "#8b5cf6"
                          ? "139, 92, 246"
                          : flowStep.color === "#3b82f6"
                          ? "59, 130, 246"
                          : flowStep.color === "#10b981"
                          ? "16, 185, 129"
                          : flowStep.color === "#f59e0b"
                          ? "245, 158, 11"
                          : "239, 68, 68"
                      }, 0.1)`,
                borderRadius: "16px",
                padding: "24px",
                border: `1px solid ${flowStep.color}30`,
                position: "relative",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: flowStep.color,
                  borderRadius: "16px 16px 0 0",
                }}
              />

              <div
                style={{
                  fontSize: "12px",
                  color: flowStep.color,
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                {flowStep.step}
              </div>

              <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                {flowStep.icon}
              </div>

              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: flowStep.color,
                  margin: "0 0 8px 0",
                }}
              >
                {flowStep.title}
              </h4>

              <p
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginBottom: "12px",
                  lineHeight: "1.4",
                }}
              >
                {flowStep.description}
              </p>

              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: theme.text,
                    fontWeight: "600",
                    marginBottom: "6px",
                  }}
                >
                  {t("intro.dataSimulation.keyProcess")}
                </div>
                {flowStep.examples.map((example, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: "10px",
                      color: theme.textSecondary,
                      marginBottom: "2px",
                      textAlign: "left",
                    }}
                  >
                    • {example}
                  </div>
                ))}
              </div>

              {index < 3 && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "-15px",
                    transform: "translateY(-50%)",
                    fontSize: "24px",
                    color: flowStep.color,
                    fontWeight: "bold",
                    zIndex: 1,
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SDK 코드 예시 */}
        <div
          style={{
            background:
              theme.cardBg === "#ffffff"
                ? "rgba(59, 130, 246, 0.05)"
                : "rgba(59, 130, 246, 0.1)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {t("intro.dataSimulation.actualSdkCodeTitle")}
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {(() => {
              const codeExamples = [
                {
                  language: "JavaScript (Web)",
                  code: `import thinkingdata from "thinkingdata-browser";

var config = {
    appId: "APP_ID",
    serverUrl: "https://YOUR_SERVER_URL/sync_js",
    batch: true, // ${t("intro.dataSimulation.jsCodeComment1")}
    autoTrack: {
        pageShow: true, // ${t("intro.dataSimulation.jsCodeComment2")} 
        pageHide: true, // ${t("intro.dataSimulation.jsCodeComment3")} 
    }
};

window.ta = thinkingdata;

// 1. ${t("intro.dataSimulation.jsCodeComment4")}
ta.init(config);

// 2. ${t("intro.dataSimulation.jsCodeComment5")}
ta.login("TA");

// 3. ${t("intro.dataSimulation.jsCodeComment6")}
var superProperties = {};
superProperties["channel"] = "ta"; // string  
superProperties["age"] = 1; // number  
superProperties["isSuccess"] = true; // boolean  
superProperties["birthday"] = new Date(); // date  
superProperties["object"] = {key: "value"}; // object  
superProperties["object_arr"] = [{key: "value"}]; // object array
superProperties["arr"] = ["value"]; // array  
ta.setSuperProperties(superProperties); // ${t(
                    "intro.dataSimulation.jsCodeComment7"
                  )}

// 4. ${t("intro.dataSimulation.jsCodeComment8")}
ta.track("product_buy", // ${t("intro.dataSimulation.jsCodeComment9")} 
    // ${t("intro.dataSimulation.jsCodeComment10")} 
    {product_name: "${t("intro.dataStructure.exampleName")}"});  

// 5. ${t("intro.dataSimulation.jsCodeComment11")}
ta.userSet({username: "TA"});`,
                },
                {
                  language: `Unity C# (${t("intro.dataSimulation.gameLabel")})`,
                  code: `using ThinkingData.Analytics;

if (${t("intro.dataSimulation.unityCodeComment1")})
{
    // 1. ${t("intro.dataSimulation.unityCodeComment2")}
    TDAnalytics.Init("APPID", "SERVER");

    // 2. ${t("intro.dataSimulation.unityCodeComment3")}
    ThinkingAnalyticsAPI.EnableAutoTrack(TDAutoTrackEventType.All);

    // 3. ${t("intro.dataSimulation.unityCodeComment4")}
    TDAnalytics.Login("TA");

    // 4. ${t("intro.dataSimulation.unityCodeComment5")}
    Dictionary<string, object> superProperties = new Dictionary<string, object>();
    superProperties["channel"] = "ta"; // String
    superProperties["age"] = 1; // Number
    superProperties["isSuccess"] = true; // Boolean
    superProperties["birthday"] = DateTime.Now; // DateTime
    superProperties["object"] = new Dictionary<string, object>() { { "key", "value" } }; // Object
    superProperties["object_arr"] = new List<object>() { new Dictionary<string, object>() { { "key", "value" } } }; // Object List
    superProperties["arr"] = new List<object>() { "value" }; // Array
    TDAnalytics.SetSuperProperties(superProperties); // ${t(
      "intro.dataSimulation.unityCodeComment5"
    )}

    // 5. ${t("intro.dataSimulation.unityCodeComment6")}
    Dictionary<string, object> properties = new Dictionary<string, object>() { { "product_name", "${t(
      "intro.dataStructure.exampleName"
    )}" } };
    TDAnalytics.Track("product_buy", properties);

    // 6. ${t("intro.dataSimulation.unityCodeComment7")}
    TDAnalytics.UserSet(new Dictionary<string, object>() { { "user_name", "TA" } });`,
                },
              ];
              return codeExamples.map((codeExample, index) => (
                <div
                  key={index}
                  style={{
                    background: "#1a1a1a",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#00ff88",
                      fontWeight: "600",
                      marginBottom: "12px",
                    }}
                  >
                    🔧 {codeExample.language}
                  </div>
                  <pre
                    style={{
                      fontSize: "10px",
                      color: "#00ff88",
                      margin: 0,
                      lineHeight: "1.4",
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {codeExample.code}
                  </pre>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* 실제 체험 섹션 */}
      <div
        style={{
          background:
            theme.cardBg === "#ffffff"
              ? "rgba(16, 185, 129, 0.05)"
              : "rgba(16, 185, 129, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: theme.text,
            marginBottom: "16px",
          }}
        >
          {t("intro.realTimeDataExperience")}
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            lineHeight: "1.6",
            marginBottom: "32px",
            maxWidth: "700px",
            margin: "0 auto 32px",
          }}
        >
          {t("intro.realTimeDataDescription")}
          <br />
          <strong style={{ color: theme.text }}>
            {t("intro.gamePlayFlow")}
          </strong>{" "}
          {t("intro.wholeProcessAtGlance")}
        </p>
      </div>

      {/* Optimal Vertical Layout: Game at top, then horizontal split for logs and tables */}

      {/* Dragon Quest Game - Full Width */}
      <div
        style={{
          background: theme.cardBg,
          borderRadius: "20px",
          padding: "28px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          marginBottom: "24px",
        }}
      >
        <AdvancedIdleRPG
          onAction={generateEvent}
          isSimulating={false}
          currentAction={currentAction}
          userStats={userStats}
          setUserStats={setUserStats}
          currentUser={currentUser}
        />
      </div>

      {/* JSON Logs and Tables - Horizontal Layout with Scrolling */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
          flexWrap: "wrap",
          overflowX: "auto",
          overflowY: "visible",
          width: "100%",
          minHeight: "350px",
        }}
      >
        {/* JSON Logs - Left Side */}
        <div
          style={{
            background: theme.cardBg,
            borderRadius: "20px",
            padding: "24px",
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            flex: "1",
            minWidth: "400px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BarChart size={20} style={{ color: "#f59e0b" }} />
            {t("intro.realTimeExperience.jsonRealTimeLog")}
          </h3>

          <div
            ref={logContainerRef}
            style={{
              background: "#1a1a1a",
              borderRadius: "8px",
              padding: "16px",
              height: "300px",
              overflowY: "auto",
              fontFamily: "monospace",
              fontSize: "11px",
              border: "1px solid #333",
            }}
          >
            {eventLogs.length === 0 ? (
              <div
                style={{
                  color: "#666",
                  textAlign: "center",
                  padding: "40px",
                  fontSize: "12px",
                }}
              >
                {t("intro.realTimeExperience.gamePlayRealTime")}
                <br />
                {t("intro.realTimeExperience.jsonEventLogDisplay")}
              </div>
            ) : (
              eventLogs.slice(-6).map((log, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "12px",
                    padding: "8px",
                    background:
                      index === eventLogs.slice(-6).length - 1
                        ? "rgba(16, 185, 129, 0.1)"
                        : "transparent",
                    borderRadius: "4px",
                    border:
                      index === eventLogs.slice(-6).length - 1
                        ? "1px solid rgba(16, 185, 129, 0.3)"
                        : "1px solid transparent",
                    animation:
                      index === eventLogs.slice(-6).length - 1
                        ? "fadeIn 0.5s ease"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      color: "#00ff88",
                      fontSize: "10px",
                      marginBottom: "4px",
                    }}
                  >
                    [{new Date(log.timestamp).toLocaleTimeString()}]{" "}
                    {log.event_name}
                  </div>
                  <pre
                    style={{
                      color: "#00ff88",
                      margin: 0,
                      fontSize: "10px",
                      lineHeight: "1.4",
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {JSON.stringify(log.json, null, 1)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tables - Right Side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            flex: "1",
            minWidth: "500px",
          }}
        >
          {/* Event Table */}
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "16px",
              padding: "20px",
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: theme.text,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Database size={18} style={{ color: "#06b6d4" }} />
              {t("intro.realTimeExperience.eventTable")}
            </h3>

            <div
              style={{
                height: "120px",
                overflowY: "auto",
                overflowX: "auto",
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: "8px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: "1200px",
                  borderCollapse: "collapse",
                  fontSize: "10px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        theme.cardBg === "#ffffff"
                          ? "rgba(6, 182, 212, 0.95)"
                          : "rgba(6, 182, 212, 0.3)",
                      backdropFilter: "blur(10px)",
                      position: "sticky",
                      top: 0,
                      zIndex: 100,
                      borderBottom: `2px solid ${theme.cardBorder}`,
                    }}
                  >
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(6, 182, 212, 0.9)"
                            : "rgba(6, 182, 212, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #event_name
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #time
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #user_id
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #platform
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #browser
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #character_level
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #damage
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #monster_name
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #exp_gained
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #skill_name
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #item_name
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #dungeon_name
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #gold_gained
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eventLogs.map((log, index) => (
                    <tr
                      key={index}
                      style={{
                        background:
                          index === eventLogs.length - 1
                            ? "rgba(16, 185, 129, 0.1)"
                            : "transparent",
                      }}
                    >
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.text,
                          fontWeight: "500",
                          fontSize: "9px",
                        }}
                      >
                        {log.event_name}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {new Date(log.timestamp)
                          .toLocaleTimeString()
                          .slice(0, 5)}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                          fontFamily: "monospace",
                        }}
                      >
                        {(log.user_id || "").toString().slice(0, 8)}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.platform || "web"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.browser || "Chrome"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.character_level ||
                          log.json.properties.level ||
                          log.json.properties.new_level ||
                          "-"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.damage ||
                          log.json.properties.finalDamage ||
                          "-"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.monster_name ||
                          log.json.properties.target ||
                          "-"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.exp_gained ||
                          log.json.properties.experience ||
                          "-"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.skill_name ||
                          log.json.properties.skill ||
                          "-"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.item_name ||
                          log.json.properties.item ||
                          log.json.properties.consumable_name ||
                          "-"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.dungeon_name ||
                          log.json.properties.dungeon ||
                          "-"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {log.json.properties.gold_gained ||
                          log.json.properties.gold ||
                          "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Table */}
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "16px",
              padding: "20px",
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: theme.text,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Settings size={18} style={{ color: "#8b5cf6" }} />
              {t("intro.realTimeExperience.userTable")}
            </h3>

            <div
              style={{
                height: "120px",
                overflowX: "auto",
                overflowY: "auto",
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: "8px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: "800px",
                  borderCollapse: "collapse",
                  fontSize: "10px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        theme.cardBg === "#ffffff"
                          ? "rgba(139, 92, 246, 0.95)"
                          : "rgba(139, 92, 246, 0.3)",
                      backdropFilter: "blur(10px)",
                      position: "sticky",
                      top: 0,
                      zIndex: 100,
                      borderBottom: `2px solid ${theme.cardBorder}`,
                    }}
                  >
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #user_id
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #distinct_id
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #reg_time
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #level
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #gold
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #attack_power
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #defense_power
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #hp
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #character_class
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: "600",
                        fontSize: "9px",
                        background:
                          theme.cardBg === "#ffffff"
                            ? "rgba(139, 92, 246, 0.9)"
                            : "rgba(139, 92, 246, 0.2)",
                        position: "sticky",
                        top: 0,
                        zIndex: 101,
                      }}
                    >
                      #monsters_defeated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eventLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: theme.textSecondary,
                          fontSize: "10px",
                        }}
                      >
                        {t("intro.realTimeExperience.gamePlayUserUpdate")}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      style={{
                        background: "rgba(16, 185, 129, 0.05)",
                      }}
                    >
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.text,
                          fontWeight: "500",
                          fontSize: "9px",
                        }}
                      >
                        {currentUser.user_id}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                          fontFamily: "monospace",
                        }}
                      >
                        {(currentUser.distinct_id || currentUser.user_id || "")
                          .toString()
                          .slice(0, 6)}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                        }}
                      >
                        {new Date().toLocaleDateString().slice(0, 8)}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                          fontWeight: "600",
                          background:
                            userStats.level > 5
                              ? "rgba(16, 185, 129, 0.1)"
                              : "transparent",
                        }}
                      >
                        {userStats.level || 1}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                          fontWeight: "600",
                          background:
                            userStats.gold > 1000
                              ? "rgba(255, 215, 0, 0.1)"
                              : "transparent",
                        }}
                      >
                        {userStats.gold?.toLocaleString() || "100"}G
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                          fontWeight: "600",
                          background:
                            userStats.attack > 50
                              ? "rgba(255, 100, 100, 0.1)"
                              : "transparent",
                        }}
                      >
                        {userStats.attack || 20}⚔️
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                          fontWeight: "600",
                        }}
                      >
                        {userStats.defense || 10}🛡️
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                          fontWeight: "600",
                          background:
                            userStats.hp < userStats.maxHp * 0.3
                              ? "rgba(255, 0, 0, 0.1)"
                              : "transparent",
                        }}
                      >
                        {userStats.hp || 100}/{userStats.maxHp || 100}❤️
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                          fontWeight: "600",
                        }}
                      >
                        {userStats.character_class || "전사"}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          borderBottom: `1px solid ${theme.cardBorder}`,
                          color: theme.textSecondary,
                          fontSize: "9px",
                          fontWeight: "600",
                          background:
                            userStats.monsters_defeated > 10
                              ? "rgba(139, 92, 246, 0.1)"
                              : "transparent",
                        }}
                      >
                        {userStats.monsters_defeated || 0}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* {t('intro.trackingPolicy.learningSummaryTitle')} */}
      <div
        style={{
          background:
            theme.cardBg === "#ffffff"
              ? "rgba(139, 92, 246, 0.05)"
              : "rgba(139, 92, 246, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "16px",
          }}
        >
          {t("intro.realTimeExperience.learningContentTitle")}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              icon: "⚡",
              title: t("intro.realTimeExperience.sdkPrincipleTitle"),
              desc: t("intro.realTimeExperience.sdkPrincipleDesc"),
              color: "#8b5cf6",
            },
            {
              icon: "📊",
              title: t("intro.realTimeDataGeneration"),
              desc: t("intro.gamePlayDataLearning"),
              color: "#7c3aed",
            },
            {
              icon: "📡",
              title: t("intro.realTimeExperience.dataFlowTitle"),
              desc: t("intro.realTimeExperience.dataFlowDesc"),
              color: "#6d28d9",
            },
          ].map((learning, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                padding: "20px",
                background: theme.cardBg,
                borderRadius: "12px",
                border: `1px solid ${learning.color}30`,
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                {learning.icon}
              </div>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: learning.color,
                  margin: "0 0 8px 0",
                }}
              >
                {learning.title}
              </h4>
              <p
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  margin: 0,
                  lineHeight: "1.4",
                }}
              >
                {learning.desc}
              </p>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: "14px",
            color: theme.textSecondary,
            marginBottom: "24px",
          }}
        >
          {t("intro.realTimeExperience.finalStepIntro")}{" "}
          <strong style={{ color: theme.text }}>
            {t("intro.realTimeExperience.dataAnalysisWhat")}
          </strong>{" "}
          {t("intro.realTimeExperience.exploreAnalysis")}
        </p>
      </div>

      <div
        style={{
          marginTop: "32px",
          padding: "20px",
          background: theme.cardBg,
          borderRadius: "16px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Checkbox
          checked={stepCompletion["data-simulation"]}
          onChange={() => handleStepComplete("data-simulation")}
          label={
            <span
              style={{
                color: theme.text,
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "1.5",
              }}
            >
              {t("intro.dataSimulation.checkboxLabel")}
            </span>
          }
        />
      </div>
    </div>
  );

  // Step 5: Data Utilization (데이터 활용)
  const renderStep5DataUtilization = () => (
    <div>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: theme.text,
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {t("intro.dataUtilization.title")}
      </h2>

      <div
        style={{
          background: theme.cardBg,
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "24px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          <BarChart size={24} style={{ color: "#10b981" }} />
          {t("intro.dataUtilization.coreModelsTitle")}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              title: t("intro.dataUtilization.eventAnalysis.title"),
              desc: t("intro.dataUtilization.eventAnalysis.desc"),
              icon: "📈",
              color: "#06b6d4",
              details: [
                t("intro.dataUtilization.eventAnalysis.detail1"),
                t("intro.dataUtilization.eventAnalysis.detail2"),
                t("intro.dataUtilization.eventAnalysis.detail3"),
              ],
            },
            {
              title: t("intro.dataUtilization.retentionAnalysis.title"),
              desc: t("intro.dataUtilization.retentionAnalysis.desc"),
              icon: "🔄",
              color: "#84cc16",
              details: [
                t("intro.dataUtilization.retentionAnalysis.detail1"),
                t("intro.dataUtilization.retentionAnalysis.detail2"),
                t("intro.dataUtilization.retentionAnalysis.detail3"),
              ],
            },
            {
              title: t("intro.dataUtilization.funnelAnalysis.title"),
              desc: t("intro.dataUtilization.funnelAnalysis.desc"),
              icon: "🎯",
              color: "#f97316",
              details: [
                t("intro.dataUtilization.funnelAnalysis.detail1"),
                t("intro.dataUtilization.funnelAnalysis.detail2"),
                t("intro.dataUtilization.funnelAnalysis.detail3"),
              ],
            },
            {
              title: t("intro.dataUtilization.intervalAnalysis.title"),
              desc: t("intro.dataUtilization.intervalAnalysis.desc"),
              icon: "⏱️",
              color: "#8b5cf6",
              details: [
                t("intro.dataUtilization.intervalAnalysis.detail1"),
                t("intro.dataUtilization.intervalAnalysis.detail2"),
                t("intro.dataUtilization.intervalAnalysis.detail3"),
              ],
            },
            {
              title: t("intro.dataUtilization.distributionAnalysis.title"),
              desc: t("intro.dataUtilization.distributionAnalysis.desc"),
              icon: "📊",
              color: "#a855f7",
              details: [
                t("intro.dataUtilization.distributionAnalysis.detail1"),
                t("intro.dataUtilization.distributionAnalysis.detail2"),
                t("intro.dataUtilization.distributionAnalysis.detail3"),
              ],
            },
            {
              title: t("intro.dataUtilization.pathAnalysis.title"),
              desc: t("intro.dataUtilization.pathAnalysis.desc"),
              icon: "🛤️",
              color: "#3b82f6",
              details: [
                t("intro.dataUtilization.pathAnalysis.detail1"),
                t("intro.dataUtilization.pathAnalysis.detail2"),
                t("intro.dataUtilization.pathAnalysis.detail3"),
              ],
            },
            {
              title: t("intro.dataUtilization.attributeAnalysis.title"),
              desc: t("intro.dataUtilization.attributeAnalysis.desc"),
              icon: "🔍",
              color: "#10b981",
              details: [
                t("intro.dataUtilization.attributeAnalysis.detail1"),
                t("intro.dataUtilization.attributeAnalysis.detail2"),
                t("intro.dataUtilization.attributeAnalysis.detail3"),
              ],
            },
            {
              title: t("intro.dataUtilization.attributionAnalysis.title"),
              desc: t("intro.dataUtilization.attributionAnalysis.desc"),
              icon: "📊",
              color: "#f59e0b",
              details: [
                t("intro.dataUtilization.attributionAnalysis.detail1"),
                t("intro.dataUtilization.attributionAnalysis.detail2"),
                t("intro.dataUtilization.attributionAnalysis.detail3"),
              ],
            },
            {
              title: t("intro.dataUtilization.sqlIde.title"),
              desc: t("intro.dataUtilization.sqlIde.desc"),
              icon: "💻",
              color: "#ef4444",
              details: [
                t("intro.dataUtilization.sqlIde.detail1"),
                t("intro.dataUtilization.sqlIde.detail2"),
                t("intro.dataUtilization.sqlIde.detail3"),
              ],
            },
          ].map((analysis, index) => (
            <div
              key={index}
              style={{
                background:
                  theme.cardBg === "#ffffff"
                    ? `rgba(${
                        analysis.color === "#3b82f6"
                          ? "59, 130, 246"
                          : analysis.color === "#10b981"
                          ? "16, 185, 129"
                          : analysis.color === "#f59e0b"
                          ? "245, 158, 11"
                          : "139, 92, 246"
                      }, 0.05)`
                    : `rgba(${
                        analysis.color === "#3b82f6"
                          ? "59, 130, 246"
                          : analysis.color === "#10b981"
                          ? "16, 185, 129"
                          : analysis.color === "#f59e0b"
                          ? "245, 158, 11"
                          : "139, 92, 246"
                      }, 0.1)`,
                borderRadius: "12px",
                padding: "20px",
                border: `1px solid ${analysis.color}30`,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                {analysis.icon}
              </div>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: theme.text,
                  margin: "0 0 8px 0",
                  textAlign: "center",
                }}
              >
                {analysis.title}
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  color: theme.textSecondary,
                  lineHeight: "1.5",
                  margin: "0 0 12px 0",
                  textAlign: "center",
                }}
              >
                {analysis.desc}
              </p>
              <ul
                style={{
                  fontSize: "11px",
                  color: theme.textSecondary,
                  lineHeight: "1.4",
                  margin: 0,
                  paddingLeft: "16px",
                }}
              >
                {analysis.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 추가 기능 */}
        <div
          style={{
            background: theme.cardBg,
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {t("intro.dataUtilization.visualizationTitle")}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {[
              {
                title: t("intro.dataUtilization.rankingAnalysis.title"),
                desc: t("intro.dataUtilization.rankingAnalysis.desc"),
                features: [
                  t("intro.dataUtilization.rankingAnalysis.feature1"),
                  t("intro.dataUtilization.rankingAnalysis.feature2"),
                  t("intro.dataUtilization.rankingAnalysis.feature3"),
                  t("intro.dataUtilization.rankingAnalysis.feature4"),
                ],
              },
              {
                title: t("intro.dataUtilization.heatmapAnalysis.title"),
                desc: t("intro.dataUtilization.heatmapAnalysis.desc"),
                features: [
                  t("intro.dataUtilization.heatmapAnalysis.feature1"),
                  t("intro.dataUtilization.heatmapAnalysis.feature2"),
                  t("intro.dataUtilization.heatmapAnalysis.feature3"),
                  t("intro.dataUtilization.heatmapAnalysis.feature4"),
                ],
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background:
                    theme.cardBg === "#ffffff"
                      ? "rgba(59, 130, 246, 0.05)"
                      : "rgba(59, 130, 246, 0.1)",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: theme.text,
                    margin: "0 0 12px 0",
                  }}
                >
                  {feature.title}
                </h4>
                <p
                  style={{
                    fontSize: "13px",
                    color: theme.textSecondary,
                    lineHeight: "1.5",
                    margin: "0 0 12px 0",
                  }}
                >
                  {feature.desc}
                </p>
                <ul
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    lineHeight: "1.4",
                    margin: 0,
                    paddingLeft: "16px",
                  }}
                >
                  {feature.features.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 사용자 세분화 기능 */}
        <div
          style={{
            background: theme.cardBg,
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {t("intro.dataUtilization.segmentationTitle")}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: theme.text,
                  margin: "0 0 16px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {t("intro.dataUtilization.userTags")}
              </h4>

              {[
                {
                  type: t("intro.dataUtilization.conditionalTag.type"),
                  desc: t("intro.dataUtilization.conditionalTag.desc"),
                  examples: t("intro.dataUtilization.conditionalTag.example"),
                },
                {
                  type: t("intro.dataUtilization.firstLastTag.type"),
                  desc: t("intro.dataUtilization.firstLastTag.desc"),
                  examples: t("intro.dataUtilization.firstLastTag.example"),
                },
                {
                  type: t("intro.dataUtilization.metricTag.type"),
                  desc: t("intro.dataUtilization.metricTag.desc"),
                  examples: t("intro.dataUtilization.metricTag.example"),
                },
                {
                  type: t("intro.dataUtilization.idTag.type"),
                  desc: t("intro.dataUtilization.idTag.desc"),
                  examples: t("intro.dataUtilization.idTag.example"),
                },
                {
                  type: t("intro.dataUtilization.sqlTag.type"),
                  desc: t("intro.dataUtilization.sqlTag.desc"),
                  examples: t("intro.dataUtilization.sqlTag.example"),
                },
              ].map((tag, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      theme.cardBg === "#ffffff"
                        ? "rgba(139, 92, 246, 0.05)"
                        : "rgba(139, 92, 246, 0.1)",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "12px",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: theme.text,
                      margin: "0 0 6px 0",
                    }}
                  >
                    {tag.type}
                  </h5>
                  <p
                    style={{
                      fontSize: "12px",
                      color: theme.textSecondary,
                      lineHeight: "1.4",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {tag.desc}
                  </p>
                  <div style={{ fontSize: "11px", color: theme.textSecondary }}>
                    {t("intro.dataUtilization.exampleLabel")} {tag.examples}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: theme.text,
                  margin: "0 0 16px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {t("intro.dataUtilization.userCohorts")}
              </h4>

              {[
                {
                  type: t("intro.dataUtilization.conditionalCohort.type"),
                  desc: t("intro.dataUtilization.conditionalCohort.desc"),
                  examples: t(
                    "intro.dataUtilization.conditionalCohort.example"
                  ),
                },
                {
                  type: t("intro.dataUtilization.idCohort.type"),
                  desc: t("intro.dataUtilization.idCohort.desc"),
                  examples: t("intro.dataUtilization.idCohort.example"),
                },
                {
                  type: t("intro.dataUtilization.sqlCohort.type"),
                  desc: t("intro.dataUtilization.sqlCohort.desc"),
                  examples: t("intro.dataUtilization.sqlCohort.example"),
                },
              ].map((cohort, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      theme.cardBg === "#ffffff"
                        ? "rgba(16, 185, 129, 0.05)"
                        : "rgba(16, 185, 129, 0.1)",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "12px",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: theme.text,
                      margin: "0 0 6px 0",
                    }}
                  >
                    {cohort.type}
                  </h5>
                  <p
                    style={{
                      fontSize: "12px",
                      color: theme.textSecondary,
                      lineHeight: "1.4",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {cohort.desc}
                  </p>
                  <div style={{ fontSize: "11px", color: theme.textSecondary }}>
                    {t("intro.dataUtilization.exampleLabel")} {cohort.examples}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 실제 활용 사례 */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "24px",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "-10%",
              width: "150px",
              height: "150px",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))",
              borderRadius: "50%",
              filter: "blur(30px)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: theme.text,
                marginBottom: "24px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              {t("intro.dataUtilization.useCaseTitle")}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {[
                {
                  step: t("intro.dataUtilization.useCase.step1"),
                  icon: "🚨",
                  color: "#ef4444",
                  content: t("intro.dataUtilization.useCase.step1Content"),
                  details: [
                    t("intro.dataUtilization.useCase.step1Detail1"),
                    t("intro.dataUtilization.useCase.step1Detail2"),
                    t("intro.dataUtilization.useCase.step1Detail3"),
                  ],
                },
                {
                  step: t("intro.dataUtilization.useCase.step2"),
                  icon: "💭",
                  color: "#f59e0b",
                  content: t("intro.dataUtilization.useCase.step2Content"),
                  details: [
                    t("intro.dataUtilization.useCase.step2Detail1"),
                    t("intro.dataUtilization.useCase.step2Detail2"),
                    t("intro.dataUtilization.useCase.step2Detail3"),
                  ],
                },
                {
                  step: t("intro.dataUtilization.useCase.step3"),
                  icon: "🔍",
                  color: "#3b82f6",
                  content: t("intro.dataUtilization.useCase.step3Content"),
                  details: [
                    t("intro.dataUtilization.useCase.step3Detail1"),
                    t("intro.dataUtilization.useCase.step3Detail2"),
                    t("intro.dataUtilization.useCase.step3Detail3"),
                  ],
                },
                {
                  step: t("intro.dataUtilization.useCase.step4"),
                  icon: "💡",
                  color: "#10b981",
                  content: t("intro.dataUtilization.useCase.step4Content"),
                  details: [
                    t("intro.dataUtilization.useCase.step4Detail1"),
                    t("intro.dataUtilization.useCase.step4Detail2"),
                    t("intro.dataUtilization.useCase.step4Detail3"),
                  ],
                },
                {
                  step: t("intro.dataUtilization.useCase.step5"),
                  icon: "🎯",
                  color: "#8b5cf6",
                  content: t("intro.dataUtilization.useCase.step5Content"),
                  details: [
                    t("intro.dataUtilization.useCase.step5Detail1"),
                    t("intro.dataUtilization.useCase.step5Detail2"),
                    t("intro.dataUtilization.useCase.step5Detail3"),
                  ],
                },
                {
                  step: t("intro.dataUtilization.useCase.step6"),
                  icon: "📈",
                  color: "#06b6d4",
                  content: t("intro.dataUtilization.useCase.step6Content"),
                  details: [
                    t("intro.dataUtilization.useCase.step6Detail1"),
                    t("intro.dataUtilization.useCase.step6Detail2"),
                    t("intro.dataUtilization.useCase.step6Detail3"),
                  ],
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: theme.cardBg,
                    borderRadius: "16px",
                    padding: "20px",
                    border: `2px solid ${item.color}20`,
                    position: "relative",
                    overflow: "hidden",
                    transform: "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: item.color,
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                      }}
                    >
                      {item.icon}
                    </div>
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: theme.text,
                        margin: 0,
                      }}
                    >
                      {item.step}
                    </h4>
                  </div>

                  <p
                    style={{
                      fontSize: "14px",
                      color: theme.text,
                      lineHeight: "1.5",
                      margin: "0 0 12px 0",
                      fontWeight: "600",
                    }}
                  >
                    {item.content}
                  </p>

                  <ul
                    style={{
                      fontSize: "12px",
                      color: theme.textSecondary,
                      lineHeight: "1.4",
                      margin: 0,
                      paddingLeft: "16px",
                    }}
                  >
                    {item.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                background:
                  theme.cardBg === "#ffffff"
                    ? "rgba(16, 185, 129, 0.05)"
                    : "rgba(16, 185, 129, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  color: theme.text,
                  margin: 0,
                  fontWeight: "600",
                  lineHeight: "1.6",
                }}
              >
                {t("intro.dataUtilization.useCase.successFactor")}
                <br />
                <span style={{ fontSize: "14px", color: theme.textSecondary }}>
                  {t("intro.dataUtilization.useCase.process")}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "32px",
            padding: "20px",
            background: theme.cardBg,
            borderRadius: "16px",
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Checkbox
            checked={stepCompletion["data-utilization"]}
            onChange={() => handleStepComplete("data-utilization")}
            label={
              <span
                style={{
                  color: theme.text,
                  fontSize: "16px",
                  fontWeight: "600",
                  lineHeight: "1.5",
                }}
              >
                {t("intro.dataUtilization.checkboxLabel")}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1Overview();
      case 2:
        return renderStep2DataStructure();
      case 3:
        return renderStep3TrackingPolicy();
      case 4:
        return renderStep4DataSimulation();
      case 5:
        return renderStep5DataUtilization();
      default:
        return renderStep1Overview();
    }
  };

  return (
    <Layout>
      <div
        style={{
          padding: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* 게이밍 스타일 헤더 */}
        <div
          style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "48px",
            marginBottom: "32px",
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          {/* 배경 장식 */}
          <div
            style={{
              position: "absolute",
              top: "-30%",
              left: "-10%",
              width: "150px",
              height: "150px",
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30%",
              right: "-10%",
              width: "200px",
              height: "200px",
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: theme.text,
                margin: "0 0 16px 0",
              }}
            >
              {t("intro.main.title")}
            </h2>

            <p
              style={{
                fontSize: "18px",
                color: theme.textSecondary,
                lineHeight: "1.6",
                maxWidth: "600px",
                margin: "0 auto 24px",
              }}
            >
              {t("intro.main.subtitle")}
              <br />
              {t("intro.main.subtitle2")}
            </p>

            {/* 퀵 스타트 통계 */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "32px",
                marginTop: "24px",
              }}
            >
              {[
                {
                  label: t("intro.stats.completedMissions"),
                  value: `${completedCount}/5`,
                  color: "#10b981",
                },
                {
                  label: t("intro.stats.currentStep"),
                  value: `${currentStep}`,
                  color: "#8b5cf6",
                },
                {
                  label: t("intro.stats.progress"),
                  value: `${Math.round(progressPercentage)}%`,
                  color: "#f59e0b",
                },
              ].map((stat, index) => (
                <div key={index} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "800",
                      color: stat.color,
                      textShadow: `0 0 10px ${stat.color}40`,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: theme.textSecondary,
                      marginTop: "4px",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <StepProgress
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
        />

        {/* 게이밍 스타일 Step Content */}
        <div
          style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            padding: "40px",
            minHeight: "600px",
            position: "relative",
            overflow: "hidden",
            zIndex: 20,
            marginTop: "24px",
          }}
        >
          {/* 배경 장식 */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "300px",
              height: "300px",
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))",
              borderRadius: "50%",
              filter: "blur(60px)",
              zIndex: 0,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {renderCurrentStep()}
          </div>
        </div>

        {/* 게이밍 스타일 Step Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            padding: "24px",
            background: theme.cardBg,
            borderRadius: "20px",
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.cardBorder}`,
            marginTop: "24px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          }}
        >
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: canGoPrev
                ? "rgba(139, 92, 246, 0.1)"
                : "rgba(139, 92, 246, 0.05)",
              border: `1px solid ${
                canGoPrev ? theme.cardBorder : "rgba(139, 92, 246, 0.1)"
              }`,
              borderRadius: "12px",
              color: canGoPrev ? theme.text : theme.textSecondary,
              fontSize: "14px",
              fontWeight: "600",
              cursor: canGoPrev ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              minWidth: "120px",
            }}
          >
            {t("intro.nav.previous")}
          </button>

          {/* 진행률 표시 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {steps.map((step) => (
              <div
                key={step.id}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: step.completed
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : currentStep === step.id
                    ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
                    : "rgba(139, 92, 246, 0.2)",
                  boxShadow:
                    step.completed || currentStep === step.id
                      ? "0 0 10px rgba(139, 92, 246, 0.5)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {currentStep === 5 ? (
            <button
              onClick={() => (window.location.hash = "")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minWidth: "120px",
                boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
              }}
            >
              {t("intro.nav.home")}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: canGoNext
                  ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
                  : "rgba(139, 92, 246, 0.1)",
                border: "none",
                borderRadius: "12px",
                color: canGoNext ? "white" : theme.textSecondary,
                fontSize: "14px",
                fontWeight: "600",
                cursor: canGoNext ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                minWidth: "120px",
                boxShadow: canGoNext
                  ? "0 4px 15px rgba(139, 92, 246, 0.4)"
                  : "none",
              }}
            >
              {t("intro.nav.next")}
            </button>
          )}
        </div>

        {/* 게이밍 스타일 스크롤 투 탑 버튼 */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
              zIndex: 1000,
              transition: 'all 0.3s ease',
              transform: showScrollTop ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
              opacity: showScrollTop ? 1 : 0
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.6), 0 6px 18px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            title={t('navigation.scrollToTop')}
          >
            <ChevronUp size={24} />
          </button>
        )}
      </div>
    </Layout>
  );
};
