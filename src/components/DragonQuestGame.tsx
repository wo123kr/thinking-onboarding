import React, { useState } from 'react';

interface GameProps {
  onAction: (eventType: string, data: any) => void;
  isSimulating: boolean;
  currentAction: string | null;
  playerStats: any;
  setPlayerStats: (stats: any) => void;
  currentUser: any;
}

interface Monster {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  emoji: string;
}

interface GameState {
  scene: 'town' | 'battle' | 'victory';
  currentMonster?: Monster;
  battleLog: string[];
  playerTurn: boolean;
}

export const DragonQuestGame: React.FC<GameProps> = ({ 
  onAction, 
  isSimulating, 
  currentAction, 
  playerStats, 
  setPlayerStats,
  currentUser 
}) => {
  const [gameState, setGameState] = useState<GameState>({
    scene: 'town',
    battleLog: [],
    playerTurn: true
  });

  const [inventory, setInventory] = useState([
    { name: '체력 포션', count: 3, type: 'potion' },
    { name: '마법 검', count: 1, type: 'weapon' },
    { name: '방패', count: 1, type: 'armor' }
  ]);

  const monsters = [
    { name: '슬라임', health: 30, maxHealth: 30, attack: 5, emoji: '🟢' },
    { name: '오크', health: 50, maxHealth: 50, attack: 8, emoji: '🗡️' },
    { name: '드래곤', health: 100, maxHealth: 100, attack: 15, emoji: '🐉' },
    { name: '고블린', health: 25, maxHealth: 25, attack: 6, emoji: '👹' }
  ];

  // 몬스터와 전투 시작
  const startBattle = (monster: Monster) => {
    setGameState({
      scene: 'battle',
      currentMonster: { ...monster },
      battleLog: [`${monster.emoji} ${monster.name}이(가) 나타났다!`],
      playerTurn: true
    });
    onAction('battle_start', {
      monster_name: monster.name,
      monster_health: monster.health,
      player_level: playerStats.level
    });
  };

  // 플레이어 공격
  const playerAttack = () => {
    if (!gameState.currentMonster || !gameState.playerTurn) return;

    const damage = Math.floor(Math.random() * 15) + 10;
    const newMonsterHealth = Math.max(0, gameState.currentMonster.health - damage);
    
    const newLog = [...gameState.battleLog, `플레이어가 ${damage} 데미지를 입혔다!`];
    
    if (newMonsterHealth <= 0) {
      // 승리
      const expGain = gameState.currentMonster.maxHealth * 2;
      const goldGain = Math.floor(Math.random() * 100) + 50;
      
      setPlayerStats({
        ...playerStats,
        experience: playerStats.experience + expGain,
        gold: playerStats.gold + goldGain
      });
      
      setGameState({
        ...gameState,
        scene: 'victory',
        battleLog: [...newLog, `${gameState.currentMonster.emoji} ${gameState.currentMonster.name}을(를) 처치했다!`, `경험치 +${expGain}, 골드 +${goldGain}`]
      });
      
      onAction('battle_victory', {
        monster_name: gameState.currentMonster.name,
        damage_dealt: damage,
        exp_gained: expGain,
        gold_gained: goldGain,
        player_level: playerStats.level
      });
    } else {
      // 몬스터 반격
      const monsterDamage = Math.floor(Math.random() * gameState.currentMonster.attack) + 3;
      const newPlayerHealth = Math.max(0, playerStats.health - monsterDamage);
      
      setPlayerStats({
        ...playerStats,
        health: newPlayerHealth
      });
      
      const finalLog = [...newLog, `${gameState.currentMonster.emoji} ${gameState.currentMonster.name}이(가) ${monsterDamage} 데미지를 입혔다!`];
      
      setGameState({
        ...gameState,
        currentMonster: { ...gameState.currentMonster, health: newMonsterHealth },
        battleLog: finalLog,
        playerTurn: true
      });
      
      onAction('battle_damage', {
        monster_name: gameState.currentMonster.name,
        damage_to_monster: damage,
        damage_to_player: monsterDamage,
        player_health_remaining: newPlayerHealth
      });
    }
  };

  // 도망가기
  const runAway = () => {
    setGameState({
      scene: 'town',
      battleLog: [],
      playerTurn: true
    });
    onAction('battle_flee', {
      monster_name: gameState.currentMonster?.name || 'unknown',
      player_level: playerStats.level
    });
  };

  // 아이템 구매
  const buyItem = (itemName: string, price: number) => {
    if (playerStats.gold >= price) {
      setPlayerStats({
        ...playerStats,
        gold: playerStats.gold - price
      });
      
      const existingItem = inventory.find(item => item.name === itemName);
      if (existingItem) {
        existingItem.count++;
      } else {
        setInventory([...inventory, { name: itemName, count: 1, type: 'misc' }]);
      }
      
      onAction('item_purchase', {
        item_name: itemName,
        item_price: price,
        remaining_gold: playerStats.gold - price,
        player_level: playerStats.level
      });
    }
  };

  // 체력 포션 사용
  const handleHealthPotionUse = () => {
    const potion = inventory.find(item => item.name === '체력 포션');
    if (potion && potion.count > 0 && playerStats.health < 100) {
      potion.count--;
      const healAmount = Math.min(30, 100 - playerStats.health);
      setPlayerStats({
        ...playerStats,
        health: playerStats.health + healAmount
      });
      
      onAction('item_use', {
        item_name: '체력 포션',
        heal_amount: healAmount,
        new_health: playerStats.health + healAmount,
        player_level: playerStats.level
      });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '16px',
      padding: '20px',
      border: '2px solid #3b82f6',
      boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '500px'
    }}>
      {/* 게임 배경 효과 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4, #10b981)',
        animation: 'shimmer 2s ease-in-out infinite'
      }} />

      {/* 플레이어 상태 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '12px 16px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🧙‍♂️
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>
              플레이어 #{currentUser?.user_id || 'TD001'}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              레벨 {playerStats.level} • 경험치 {playerStats.experience}/1000
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>골드</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#f59e0b' }}>
              💰 {playerStats.gold}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>체력</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444' }}>
              ❤️ {playerStats.health}/100
            </div>
          </div>
        </div>
      </div>

      {/* 게임 화면 */}
      {gameState.scene === 'town' && (
        <div>
          <h4 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
            🏰 모험가의 마을
          </h4>
          
          {/* 몬스터 선택 */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>전투할 몬스터를 선택하세요:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {monsters.map((monster, index) => (
                <button
                  key={index}
                  onClick={() => startBattle(monster)}
                  disabled={isSimulating}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: isSimulating ? 'not-allowed' : 'pointer',
                    opacity: isSimulating ? 0.6 : 1
                  }}
                >
                  {monster.emoji} {monster.name} (HP: {monster.health})
                </button>
              ))}
            </div>
          </div>

          {/* 상점 */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>🏪 상점:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => buyItem('체력 포션', 100)}
                disabled={isSimulating || playerStats.gold < 100}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: (isSimulating || playerStats.gold < 100) ? 'not-allowed' : 'pointer',
                  opacity: (isSimulating || playerStats.gold < 100) ? 0.6 : 1
                }}
              >
                🧪 체력 포션 (100G)
              </button>
              <button
                onClick={() => buyItem('마법 검', 500)}
                disabled={isSimulating || playerStats.gold < 500}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: (isSimulating || playerStats.gold < 500) ? 'not-allowed' : 'pointer',
                  opacity: (isSimulating || playerStats.gold < 500) ? 0.6 : 1
                }}
              >
                ⚔️ 마법 검 (500G)
              </button>
            </div>
          </div>

          {/* 인벤토리 */}
          <div>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>🎒 인벤토리:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {inventory.filter(item => item.count > 0).map((item, index) => (
                <button
                  key={index}
                  onClick={() => item.name === '체력 포션' && item.count > 0 && playerStats.health < 100 ? handleHealthPotionUse() : null}
                  disabled={isSimulating || (item.name === '체력 포션' && playerStats.health >= 100)}
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid #f59e0b',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    color: '#f59e0b',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: (isSimulating || (item.name === '체력 포션' && playerStats.health >= 100)) ? 'not-allowed' : 'pointer',
                    opacity: (isSimulating || (item.name === '체력 포션' && playerStats.health >= 100)) ? 0.6 : 1
                  }}
                >
                  {item.name} x{item.count}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState.scene === 'battle' && gameState.currentMonster && (
        <div>
          <h4 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
            ⚔️ 전투 중
          </h4>

          {/* 몬스터 상태 */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {gameState.currentMonster.emoji}
            </div>
            <div style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>
              {gameState.currentMonster.name}
            </div>
            <div style={{ color: '#ef4444', fontSize: '14px' }}>
              HP: {gameState.currentMonster.health}/{gameState.currentMonster.maxHealth}
            </div>
            {/* 체력바 */}
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(gameState.currentMonster.health / gameState.currentMonster.maxHealth) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* 전투 액션 */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
            <button
              onClick={playerAttack}
              disabled={isSimulating || !gameState.playerTurn}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (isSimulating || !gameState.playerTurn) ? 'not-allowed' : 'pointer',
                opacity: (isSimulating || !gameState.playerTurn) ? 0.6 : 1
              }}
            >
              ⚔️ 공격
            </button>
            <button
              onClick={runAway}
              disabled={isSimulating}
              style={{
                background: 'rgba(107, 114, 128, 0.8)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSimulating ? 'not-allowed' : 'pointer',
                opacity: isSimulating ? 0.6 : 1
              }}
            >
              🏃 도망
            </button>
          </div>

          {/* 전투 로그 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            maxHeight: '100px',
            overflowY: 'auto'
          }}>
            {gameState.battleLog.map((log, index) => (
              <div key={index} style={{
                color: '#94a3b8',
                fontSize: '12px',
                marginBottom: '4px'
              }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState.scene === 'victory' && (
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#10b981', marginBottom: '20px' }}>
            🎉 승리!
          </h4>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ color: 'white', fontSize: '14px', marginBottom: '12px' }}>
              전투에서 승리했습니다!
            </div>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              maxHeight: '100px',
              overflowY: 'auto'
            }}>
              {gameState.battleLog.map((log, index) => (
                <div key={index} style={{
                  color: '#94a3b8',
                  fontSize: '12px',
                  marginBottom: '4px'
                }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setGameState({ scene: 'town', battleLog: [], playerTurn: true })}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🏰 마을로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};