import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Eye, EyeOff, Settings, Check, X, Crown, Star } from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Checkbox } from '../../components/Checkbox';
import { InfoBox } from '../../components/InfoBox';
import { Tabs } from '../../components/Tabs';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Step2Props {
  onComplete: () => void;
}

export const Step2AccountSetup: React.FC<Step2Props> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [understood, setUnderstood] = useState(false);

  // Call onComplete when step is understood
  useEffect(() => {
    if (understood) {
      onComplete();
    }
  }, [understood, onComplete]);

  // 테마 색상 가져오기
  const theme = colors;


  const roleTypes = [
    {
      name: t('role.projectManager'),
      badge: { text: t('role.projectManagerBadge'), variant: 'danger' as const },
      icon: '👑',
      color: '#a855f7',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      permissions: [
        t('step2.projectManagerPerm1'),
        t('step2.projectManagerPerm2'),
        t('step2.projectManagerPerm3')
      ],
      description: t('role.projectManagerDesc')
    },
    {
      name: t('role.analysisManager'),
      badge: { text: t('role.analysisManagerBadge'), variant: 'primary' as const },
      icon: '🔧',
      color: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      permissions: [
        t('step2.analysisManagerPerm1'),
        t('step2.analysisManagerPerm2')
      ],
      description: t('role.analysisManagerDesc')
    },
    {
      name: t('role.analyst'),
      badge: { text: t('role.analystBadge'), variant: 'success' as const },
      icon: '📊',
      color: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      permissions: [
        t('step2.dataEngineerPerm1'),
        t('step2.dataEngineerPerm2')
      ],
      description: t('role.analystDesc')
    },
    {
      name: t('role.viewer'),
      badge: { text: t('role.viewerBadge'), variant: 'secondary' as const },
      icon: '👤',
      color: '#6b7280',
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
      permissions: [
        t('step2.viewerPerm1'),
        t('step2.viewerPerm2')
      ],
      description: t('role.viewerDesc')
    }
  ];

  const dataPermissionSettings = [
    {
      name: t('step2.dataPermissionTitle'),
      icon: '🤔',
      description: t('step2.dataPermissionDesc'),
      example: t('step2.allDataDesc')
    },
    {
      name: t('step2.allDataAccess'),
      icon: '👁️',
      description: t('step2.limitedDataDesc'),
      examples: [
        {
          title: t('step2.eventDisplaySetting'),
          items: [
            { name: t('step2.purchaseComplete'), level: t('step2.checked'), icon: '👁️', checked: true },
            { name: t('step2.paymentFailed'), level: t('step2.unchecked'), icon: '🚫', checked: false },
            { name: t('step2.pageView'), level: t('step2.checked'), icon: '👁️', checked: true }
          ]
        }
      ],
      note: t('step2.readOnlyDesc')
    },
    {
      name: t('step2.dataSourceFilter'),
      icon: '🔧',
      description: t('step2.dataSourceFilterDesc'),
      examples: [
        {
          title: t('step2.eventFilterLabel'),
          subtitle: t('step2.productCategoryLabel'),
          description: t('step2.categoryFilterDesc'),
          tags: [t('step2.clothingTag'), t('step2.electronicsTag')]
        },
        {
          title: t('step2.userFilterLabel'),
          subtitle: t('step2.regionLabel'),
          description: t('step2.regionFilterDesc'),
          tags: [t('step2.seoulTag'), t('step2.gyeonggiTag')]
        }
      ]
    },
    {
      name: t('step2.fieldLevelSecurity'),
      icon: '🔒',
      description: t('step2.fieldLevelSecurityDesc'),
      examples: [
        {
          title: t('step2.maskingExampleTitle'),
          items: [
            { type: t('step2.emailMaskingType'), original: 'user@example.com', masked: 'u***@e*******.com' },
            { type: t('step2.phoneMaskingType'), original: '010-1234-5678', masked: '010-****-5678' },
            { type: t('step2.amountMaskingType'), original: '1,250,000원', masked: '1,***,***원' },
            { type: t('step2.creditCardMaskingType'), original: '1234-5678-9012-3456', masked: '****-****-****-3456' }
          ]
        }
      ]
    },
    {
      name: t('step2.dataPermissionCreationTitle'),
      icon: '⚙️',
      description: t('step2.dataPermissionCreationDesc'),
      process: [
        t('step2.checkboxSelectionStep'),
        t('step2.dataRangeFilterStep'),
        t('step2.saveDataPolicyStep'),
        t('step2.assignPermissionStep')
      ],
      note: t('step2.coreNoteCheckedOnly')
    }
  ];

  const memberCreationTab = (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          padding: '20px',
          background: `${colors.accentSecondary}15`,
          borderRadius: '16px',
          border: `1px solid ${colors.accentSecondary}30`
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            <UserPlus size={24} color="white" />
          </div>
          <div>
            <h5 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              margin: 0,
              color: colors.accentSecondary,
              userSelect: 'none'
            }}>
              🚀 {t('step2.teamQuest')}
            </h5>
            <p style={{ 
              fontSize: '14px', 
              color: theme.textSecondary, 
              margin: '4px 0 0 0',
              fontWeight: '500'
            }}>
              {t('step2.teamDescription')}
            </p>
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <h6 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '20px',
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            📋 {t('step2.stepByStepProgressGuide')}
          </h6>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
            }}>
              1
            </div>
            <div>
              <h6 style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: theme.text
              }}>
                🎯 {t('step2.projectManagementAccess2')}
              </h6>
              <p style={{
                fontSize: '15px',
                color: theme.textSecondary,
                margin: 0,
                lineHeight: '1.5'
              }}>
                {t('step2.adminModeDescription')}
              </p>
            </div>
          </div>

          {[
            { step: 2, title: t('step2.memberManagementMenu2'), desc: t('step2.memberManagementDescription'), color: '#10b981' },
            { step: 3, title: t('step2.addNewMember2'), desc: t('step2.addNewMemberDescription'), color: '#f59e0b' },
            { step: 4, title: t('step2.accountInfoInput2'), desc: t('step2.accountInfoDescription'), color: '#ef4444' },
            { step: 5, title: t('step2.roleAssignment2'), desc: t('step2.roleAssignmentDescription'), color: '#8b5cf6' },
            { step: 6, title: t('step2.teamComplete2'), desc: t('step2.teamCompleteDescription'), color: '#06b6d4' }
          ].map((item, index) => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                boxShadow: `0 4px 12px ${item.color}40`
              }}>
                {item.step}
              </div>
              <div>
                <h6 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: 0,
                  color: theme.text
                }}>
                  🎯 {item.title}
                </h6>
                <p style={{
                  fontSize: '15px',
                  color: theme.textSecondary,
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 게이밍 스타일 CSV 파일 안내 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
          borderRadius: '16px',
          marginBottom: '20px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              📋
            </div>
            <h6 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              color: theme.text
            }}>
              🎁 {t('step2.teamInfoTreasureBox')}
            </h6>
          </div>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            fontSize: '15px',
            color: theme.text,
            fontWeight: '500'
          }}>
            <li style={{ marginBottom: '8px' }}>🆔 <strong>{t('step2.csvId')}:</strong> {t('step2.csvGeneratedId')}</li>
            <li style={{ marginBottom: '8px' }}>👤 <strong>{t('step2.csvAlias')}:</strong> {t('step2.csvUserAlias')}</li>
            <li style={{ marginBottom: '8px' }}>🔐 <strong>{t('step2.csvInitialPassword')}:</strong> {t('step2.csvTempPassword')}</li>
          </ul>
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
            borderRadius: '12px',
            fontSize: '14px',
            color: theme.text,
            fontWeight: '600',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            💡 <strong>{t('step2.csvSecurityAlert')}:</strong> {t('step2.securityAlertDesc')}
          </div>
        </div>
        
        {/* 게이밍 스타일 여러 구성원 동시 생성 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.05))',
          borderRadius: '16px',
          marginBottom: '20px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              🔄
            </div>
            <h6 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              color: theme.text
            }}>
              ⚡ {t('step2.bulkRecruitmentSystem')}
            </h6>
          </div>
          <p style={{
            fontSize: '15px',
            color: theme.textSecondary,
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            {t('step2.bulkRecruitmentDesc')}
          </p>
          <div style={{
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            color: theme.text,
            fontWeight: '600',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            marginBottom: '12px'
          }}>
            🚀 <strong>{t('step2.efficiencyTip')}:</strong> {t('step2.efficiencyTipDesc')}
          </div>
          <ul style={{
            margin: '12px 0 0 0',
            paddingLeft: '20px',
            fontSize: '15px',
            color: theme.text,
            fontWeight: '500'
          }}>
            <li style={{ marginBottom: '6px' }}>🎯 {t('step2.individualRoleSettings')}</li>
            <li style={{ marginBottom: '6px' }}>⚡ {t('step2.batchCreationSavesTime')}</li>
            <li style={{ marginBottom: '6px' }}>📦 {t('step2.singleCsvAllMembers')}</li>
          </ul>
        </div>
        
        {/* 게이밍 스타일 시스템 관리자 권한 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1))',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
            }}>
              🌐
            </div>
            <h6 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              color: theme.text
            }}>
              👑 {t('step2.masterAdminRights')}
            </h6>
          </div>
          <p style={{
            fontSize: '15px',
            color: theme.textSecondary,
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            {t('step2.masterAdminDesc')}
          </p>
          <div style={{
            padding: '16px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            color: theme.text,
            fontWeight: '600',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            marginBottom: '12px'
          }}>
            👑 <strong>{t('step2.specialPrivilege')}:</strong> {t('step2.specialPrivilegeDesc')}
          </div>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            fontSize: '15px',
            color: theme.text,
            fontWeight: '500'
          }}>
            <li style={{ marginBottom: '6px' }}>🌍 {t('step2.systemWideMemberMgmt')}</li>
            <li style={{ marginBottom: '6px' }}>🔄 {t('step2.crossProjectAssignment')}</li>
            <li style={{ marginBottom: '6px' }}>⚙️ {t('step2.centralizedPermissionMgmt')}</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const roleCreationTab = (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          padding: '20px',
          background: `${colors.accent}15`,
          borderRadius: '16px',
          border: `1px solid ${colors.accent}30`
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
          }}>
            <Shield size={24} color="white" />
          </div>
          <div>
            <h5 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              margin: 0,
              color: colors.accent,
              userSelect: 'none'
            }}>
              🛡️ {t('step2.roleManagementSystem')}
            </h5>
            <p style={{ 
              fontSize: '14px', 
              color: theme.textSecondary, 
              margin: '4px 0 0 0',
              fontWeight: '500'
            }}>
              {t('step2.compareRolePermissions')}
            </p>
          </div>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '24px'
        }}>
          {roleTypes.map((role, index) => (
            <div 
              key={index} 
              style={{
                background: theme.cardBg,
                border: `2px solid ${role.color}`,
                borderRadius: '20px',
                padding: '24px',
                boxShadow: `0 8px 24px ${role.color}15, 0 4px 8px rgba(0, 0, 0, 0.3)`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transform: 'translateY(0)',
                zIndex: 1,
                backdropFilter: 'blur(20px)'
              }}
              onMouseEnter={(e) => {
                const element = e.currentTarget;
                const iconContainer = element.querySelector('[data-icon-container]') as HTMLElement;
                const iconSpan = element.querySelector('[data-icon]') as HTMLElement;
                const topBar = element.querySelector('[data-top-bar]') as HTMLElement;
                
                element.style.transform = 'translateY(-8px) scale(1.02)';
                element.style.boxShadow = `0 20px 40px ${role.color}25, 0 8px 16px rgba(0, 0, 0, 0.12)`;
                element.style.zIndex = '10';
                element.style.borderColor = role.color;
                
                if (iconContainer) {
                  iconContainer.style.transform = 'scale(1.1) rotate(5deg)';
                  iconContainer.style.boxShadow = `0 10px 30px ${role.color}35`;
                }
                
                if (iconSpan) {
                  iconSpan.style.transform = 'scale(1.1)';
                }
                
                if (topBar) {
                  topBar.style.height = '6px';
                  topBar.style.background = `linear-gradient(90deg, ${role.color}, ${role.color}cc, ${role.color})`;
                }
              }}
              onMouseLeave={(e) => {
                const element = e.currentTarget;
                const iconContainer = element.querySelector('[data-icon-container]') as HTMLElement;
                const iconSpan = element.querySelector('[data-icon]') as HTMLElement;
                const topBar = element.querySelector('[data-top-bar]') as HTMLElement;
                
                element.style.transform = 'translateY(0) scale(1)';
                element.style.boxShadow = `0 8px 24px ${role.color}15, 0 4px 8px rgba(0, 0, 0, 0.08)`;
                element.style.zIndex = '1';
                element.style.borderColor = role.color;
                
                if (iconContainer) {
                  iconContainer.style.transform = 'scale(1) rotate(0deg)';
                  iconContainer.style.boxShadow = `0 6px 20px ${role.color}25`;
                }
                
                if (iconSpan) {
                  iconSpan.style.transform = 'scale(1)';
                }
                
                if (topBar) {
                  topBar.style.height = '4px';
                  topBar.style.background = `linear-gradient(90deg, ${role.color}, ${role.color}80)`;
                }
              }}
            >
              {/* 배경 그라디언트 */}
              <div 
                data-top-bar
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${role.color}, ${role.color}80)`,
                  borderRadius: '20px 20px 0 0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} 
              />
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div 
                  data-icon-container
                  style={{
                    width: '64px',
                    height: '64px',
                    background: `linear-gradient(135deg, ${role.color}, ${role.color}dd)`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: `0 6px 20px ${role.color}25`,
                    flexShrink: 0,
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1)'
                  }}>
                  <div style={{
                    position: 'absolute',
                    inset: '2px',
                    background: `linear-gradient(135deg, ${role.color}f0, ${role.color}e0)`,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    <span 
                      data-icon
                      style={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'scale(1)',
                        display: 'inline-block'
                      }}>
                      {role.icon}
                    </span>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <h6 style={{ 
                      fontSize: '18px', 
                      fontWeight: '700', 
                      margin: 0,
                      color: theme.text,
                      letterSpacing: '-0.025em'
                    }}>
                      {role.name}
                    </h6>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: `${role.color}15`,
                      color: role.color,
                      border: `1px solid ${role.color}30`
                    }}>
                      {role.badge.text}
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: theme.textSecondary, 
                    margin: 0,
                    lineHeight: '1.5',
                    fontWeight: '500'
                  }}>
                    {role.description}
                  </p>
                </div>
              </div>
              
              <div style={{
                background: `${role.color}08`,
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${role.color}15`
              }}>
                <h6 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '12px',
                  display: 'block'
                }}>
                  {t('step2.mainPermissions')}
                </h6>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: 0,
                  listStyle: 'none',
                  fontSize: '14px'
                }}>
                  {role.permissions.map((permission, permIndex) => (
                    <li key={permIndex} style={{ 
                      marginBottom: permIndex < role.permissions.length - 1 ? '10px' : '0', 
                      color: theme.textSecondary,
                      lineHeight: '1.6',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontWeight: '500'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: role.color,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          background: 'white',
                          borderRadius: '50%'
                        }} />
                      </div>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 게이밍 스타일 권한 비교 표 */}
        <div style={{ marginBottom: '32px', marginTop: '48px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            padding: '16px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              📊
            </div>
            <h6 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              margin: 0,
              color: theme.text
            }}>
              📊 {t('step2.permissionComparisonMatrix')}
            </h6>
          </div>
          
          <div style={{
            background: theme.cardBg,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            overflowX: 'auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '200px repeat(4, 1fr)',
              gap: '0',
              minWidth: '700px'
            }}>
              {/* 헤더 */}
              <div style={{
                padding: '16px 20px',
                background: 'rgba(139, 92, 246, 0.1)',
                fontWeight: '600',
                color: theme.text,
                fontSize: '14px',
                borderTopLeftRadius: '12px',
                border: `1px solid ${theme.cardBorder}`
              }}>
                {t('step2.featureAccess')}
              </div>
              <div style={{
                padding: '16px 20px',
                background: 'rgba(168, 85, 247, 0.1)',
                fontWeight: '600',
                color: '#a855f7',
                fontSize: '14px',
                textAlign: 'center',
                border: `1px solid ${theme.cardBorder}`,
                borderLeft: 'none'
              }}>
                {t('role.projectManager')}
              </div>
              <div style={{
                padding: '16px 20px',
                background: 'rgba(59, 130, 246, 0.1)',
                fontWeight: '600',
                color: '#3b82f6',
                fontSize: '14px',
                textAlign: 'center',
                border: `1px solid ${theme.cardBorder}`,
                borderLeft: 'none'
              }}>
                {t('role.analysisManager')}
              </div>
              <div style={{
                padding: '16px 20px',
                background: 'rgba(16, 185, 129, 0.1)',
                fontWeight: '600',
                color: '#10b981',
                fontSize: '14px',
                textAlign: 'center',
                border: `1px solid ${theme.cardBorder}`,
                borderLeft: 'none'
              }}>
                {t('role.analyst')}
              </div>
              <div style={{
                padding: '16px 20px',
                background: 'rgba(107, 114, 128, 0.1)',
                fontWeight: '600',
                color: '#6b7280',
                fontSize: '14px',
                textAlign: 'center',
                borderTopRightRadius: '12px',
                border: `1px solid ${theme.cardBorder}`,
                borderLeft: 'none'
              }}>
                {t('role.viewer')}
              </div>

              {/* 데이터 행들 */}
              {[
                { name: t('step2.projectManagement'), manager: true, analyst_admin: false, analyst: false, member: false },
                { name: t('step2.memberInvite'), manager: true, analyst_admin: false, analyst: false, member: false },
                { name: t('step2.sdkConfiguration'), manager: true, analyst_admin: true, analyst: false, member: false },
                { name: t('step2.reportCreation'), manager: true, analyst_admin: true, analyst: true, member: false },
                { name: t('step2.dataAnalysis'), manager: true, analyst_admin: true, analyst: true, member: true }
              ].map((permission, index) => (
                <>
                  <div key={`name-${index}`} style={{
                    padding: '16px 20px',
                    background: 'rgba(139, 92, 246, 0.05)',
                    fontWeight: '500',
                    color: theme.text,
                    fontSize: '14px',
                    border: `1px solid ${theme.cardBorder}`,
                    borderTop: 'none',
                    ...(index === 4 && { borderBottomLeftRadius: '12px' })
                  }}>
                    {permission.name}
                  </div>
                  <div key={`manager-${index}`} style={{
                    padding: '16px 20px',
                    background: permission.manager ? 'rgba(168, 85, 247, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                    textAlign: 'center',
                    border: `1px solid ${theme.cardBorder}`,
                    borderTop: 'none',
                    borderLeft: 'none'
                  }}>
                    {permission.manager ? (
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        background: '#a855f7',
                        borderRadius: '50%',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        ✓
                      </span>
                    ) : (
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        background: '#f3f4f6',
                        borderRadius: '50%',
                        color: '#9ca3af',
                        fontSize: '14px'
                      }}>
                        ✗
                      </span>
                    )}
                  </div>
                  <div key={`analyst_admin-${index}`} style={{
                    padding: '16px 20px',
                    background: permission.analyst_admin ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                    textAlign: 'center',
                    border: `1px solid ${theme.cardBorder}`,
                    borderTop: 'none',
                    borderLeft: 'none'
                  }}>
                    {permission.analyst_admin ? (
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        ✓
                      </span>
                    ) : (
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '50%',
                        color: theme.textSecondary,
                        fontSize: '14px'
                      }}>
                        ✗
                      </span>
                    )}
                  </div>
                  <div key={`analyst-${index}`} style={{
                    padding: '16px 20px',
                    background: permission.analyst ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                    textAlign: 'center',
                    border: `1px solid ${theme.cardBorder}`,
                    borderTop: 'none',
                    borderLeft: 'none'
                  }}>
                    {permission.analyst ? (
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        background: '#10b981',
                        borderRadius: '50%',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        ✓
                      </span>
                    ) : (
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '50%',
                        color: theme.textSecondary,
                        fontSize: '14px'
                      }}>
                        ✗
                      </span>
                    )}
                  </div>
                  <div key={`member-${index}`} style={{
                    padding: '16px 20px',
                    background: permission.member ? 'rgba(107, 114, 128, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                    textAlign: 'center',
                    border: `1px solid ${theme.cardBorder}`,
                    borderTop: 'none',
                    borderLeft: 'none',
                    ...(index === 4 && { borderBottomRightRadius: '12px' })
                  }}>
                    {permission.member ? (
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        background: '#6b7280',
                        borderRadius: '50%',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        ✓
                      </span>
                    ) : (
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '50%',
                        color: theme.textSecondary,
                        fontSize: '14px'
                      }}>
                        ✗
                      </span>
                    )}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>

        {/* 게이밍 스타일 커스텀 역할 생성 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
          borderRadius: '16px',
          marginBottom: '20px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              ⚙️
            </div>
            <h6 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              color: theme.text
            }}>
              🔧 {t('step2.advancedCustomRoleCreation')}
            </h6>
          </div>
          <p style={{
            fontSize: '15px',
            color: theme.textSecondary,
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            {t('step2.customRoleDescription')}
          </p>
          <div style={{
            padding: '16px',
            background: 'rgba(245, 158, 11, 0.15)',
            borderRadius: '12px',
            fontSize: '14px',
            color: theme.text,
            fontWeight: '600',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            💡 <strong>{t('step2.advancedTip')}:</strong> {t('step2.advancedTipDescription')}
          </div>
        </div>
      </div>
      
      {/* 역할 & 권한 시스템 액션 박스 */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.4)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <Shield size={20} />
          <span style={{
            fontSize: '16px',
            fontWeight: '700'
          }}>
            {t('step2.compareRolePermissions')}
          </span>
        </div>
      </div>
    </div>
  );

  const dataPermissionTab = (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          padding: '20px',
          background: `${colors.success}15`,
          borderRadius: '16px',
          border: `1px solid ${colors.success}30`
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}>
            <Eye size={24} color="white" />
          </div>
          <div>
            <h5 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              margin: 0,
              color: colors.success,
              userSelect: 'none'
            }}>
              🔒 {t('step2.dataSecuritySystem')}
            </h5>
            <p style={{ 
              fontSize: '14px', 
              color: theme.textSecondary, 
              margin: '4px 0 0 0',
              fontWeight: '500'
            }}>
              {t('step2.perfectSecurityControl')}
            </p>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px' 
        }}>
          {dataPermissionSettings.map((setting, index) => (
            <div key={index} style={{
              background: theme.cardBg,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ 
                  fontSize: '32px',
                  flexShrink: 0
                }}>
                  {setting.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h6 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    margin: '0 0 12px 0',
                    color: theme.text
                  }}>
                    {setting.name}
                  </h6>
                  <p style={{ 
                    fontSize: '14px', 
                    color: theme.textSecondary, 
                    marginBottom: '16px',
                    lineHeight: '1.6'
                  }}>
                    {setting.description}
                  </p>
                  
                  {/* 예시 표시 */}
                  {setting.example && (
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
                        <p style={{
                          fontSize: '13px',
                          color: theme.text,
                          margin: 0,
                          fontWeight: '500'
                        }}>
                          {setting.example}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 이벤트 표시 설정 예시 */}
                  {setting.examples && setting.examples.map((example, exIndex) => (
                    <div key={exIndex} style={{ marginBottom: '16px' }}>
                      <h6 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: theme.text,
                        marginBottom: '8px',
                        display: 'block'
                      }}>
                        {example.title}
                      </h6>
                      {'items' in example && example.items && (
                        <div style={{
                          background: 'rgba(139, 92, 246, 0.05)',
                          borderRadius: '8px',
                          padding: '12px',
                          border: `1px solid ${theme.cardBorder}`
                        }}>
                          {example.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: itemIndex < example.items.length - 1 ? '8px' : '0'
                            }}>
                              <span style={{ 
                                fontSize: '16px',
                                color: item.checked ? '#10b981' : '#ef4444'
                              }}>
                                {item.icon || (item.checked ? '✅' : '❌')}
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: item.checked ? theme.text : theme.textSecondary,
                                fontWeight: item.checked ? '600' : '400'
                              }}>
                                {item.name || item.type}
                              </span>
                              {item.level && (
                                <Badge variant={item.checked ? 'success' : 'danger'} size="sm">
                                  {item.level}
                                </Badge>
                              )}
                              {item.original && item.masked && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontSize: '12px'
                                }}>
                                  <span style={{ color: theme.textSecondary }}>{t('step2.originalLabel')}:</span>
                                  <code style={{
                                    background: colors.cardBg,
                                    color: theme.text,
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    border: `1px solid ${colors.cardBorder}`
                                  }}>
                                    {item.original}
                                  </code>
                                  <span style={{ color: theme.textSecondary }}>→</span>
                                  <code style={{
                                    background: `${colors.warning}20`,
                                    color: colors.warning,
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    border: `1px solid ${colors.warning}30`
                                  }}>
                                    {item.masked}
                                  </code>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {'tags' in example && example.tags && (
                        <div style={{
                          display: 'flex',
                          gap: '6px',
                          flexWrap: 'wrap',
                          marginTop: '8px'
                        }}>
                          <span style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            fontWeight: '500'
                          }}>
                            {'subtitle' in example ? example.subtitle : ''}:
                          </span>
                          {example.tags.map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="primary" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* 프로세스 단계 */}
                  {setting.process && (
                    <div style={{ marginBottom: '16px' }}>
                      <h6 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: theme.text,
                        marginBottom: '12px',
                        display: 'block'
                      }}>
                        {t('step2.dataPermissionProcessTitle')}
                      </h6>
                      <div style={{
                        background: 'rgba(139, 92, 246, 0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                        border: `1px solid ${theme.cardBorder}`
                      }}>
                        {setting.process.map((step, stepIndex) => (
                          <div key={stepIndex} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: stepIndex < setting.process.length - 1 ? '8px' : '0'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              background: '#3b82f6',
                              color: 'white',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '600',
                              flexShrink: 0
                            }}>
                              {stepIndex + 1}
                            </div>
                            <span style={{
                              fontSize: '13px',
                              color: theme.text,
                              fontWeight: '500'
                            }}>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 노트 */}
                  {setting.note && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
                        <p style={{
                          fontSize: '13px',
                          color: theme.text,
                          margin: 0,
                          fontWeight: '600'
                        }}>
                          {setting.note}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'members',
      label: t('step2.roleTabTitle'),
      content: memberCreationTab
    },
    {
      id: 'roles',
      label: t('step2.teamTabTitle'),
      content: roleCreationTab
    },
    {
      id: 'permissions',
      label: t('step2.dataTabTitle'),
      content: dataPermissionTab
    }
  ];

  return (
    <div style={{ color: theme.text }}>
      {/* 게이밍 스타일 Step Title */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          padding: '20px',
          background: `${colors.accentSecondary}15`,
          borderRadius: '16px',
          border: `1px solid ${colors.accentSecondary}30`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
            borderRadius: '50%',
            filter: 'blur(30px)'
          }} />
          
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #3b82f6, #10b981)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
            position: 'relative',
            zIndex: 1
          }}>
            <Users size={28} color="white" />
          </div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #3b82f6, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              marginBottom: '8px'
            }}>
              {t('step2.mission')} 🛡️
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={16} />
                {t('step2.reward')}
              </span>
            </div>
          </div>
          {/* 단계 버튼 */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 2
          }}>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#3b82f6',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ▷ 2/4 단계
            </div>
          </div>
        </div>
        <p style={{
          fontSize: '18px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          margin: 0,
          padding: '0 20px'
        }}>
          {t('step2.warning')}
        </p>
      </div>

      {/* 게이밍 스타일 Tabs Content */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden'
        }}>
          <Tabs tabs={tabs} defaultTab="members" />
        </div>
      </div>

      {/* 게이밍 스타일 Completion Checkbox */}
      <div style={{ 
        padding: '24px', 
        background: theme.cardBg,
        borderRadius: '20px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '120px',
          height: '120px',
          background: understood 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
          borderRadius: '50%',
          filter: 'blur(30px)',
          transition: 'all 0.3s ease'
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: understood 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #3b82f6, #10b981)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: understood 
              ? '0 8px 20px rgba(16, 185, 129, 0.4)'
              : '0 8px 20px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease'
          }}>
            {understood ? (
              <Crown size={24} color="white" />
            ) : (
              <Shield size={24} color="white" />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <Checkbox
              checked={understood}
              onChange={setUnderstood}
              label={
                <span style={{ 
                  color: theme.text, 
                  fontSize: '16px', 
                  fontWeight: '600',
                  lineHeight: '1.5'
                }}>
                  {understood 
                    ? t('step2.checkboxCompleted')
                    : t('step2.checkboxReady')
                  }
                </span>
              }
            />
            {understood && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#10b981',
                  fontWeight: '600'
                }}>
                  <Crown size={16} />
                  {t('step2.rewardEarned')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};