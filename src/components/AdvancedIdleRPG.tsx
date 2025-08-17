import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

interface Dungeon {
  id: string;
  name: string;
  level: number;
  description: string;
  floors: number;
  currentFloor: number;
  clearedFloors: Set<number>; // Track which floors have been cleared
  monsters: Monster[];
  rewards: {
    goldRange: [number, number];
    expRange: [number, number];
    itemDropChance: number;
  };
  requiredLevel: number;
  isUnlocked: boolean;
  isComingSoon?: boolean; // 업데이트 예정 던전인지
}

interface Monster {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  exp: number;
  gold: number;
  dropItems: Item[];
  isBoss?: boolean;
}

interface Character {
  id: string;
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  gold: number;
  class: string;
  skills: Skill[];
  equipment: Equipment;
  stats: CharacterStats;
  prestige: number;
  rebirth: number;
  buffs: {
    attack: { amount: number; duration: number };
    defense: { amount: number; duration: number };
    speed: { amount: number; duration: number };
  };
}

interface CharacterStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  luck: number;
  availablePoints: number;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  baseDamage: number;
  damageMultiplier: number; // 레벨당 증가율
  statMultiplier: {
    attack?: number;
    defense?: number;
    hp?: number;
    mp?: number;
  }; // 스탯 기반 데미지 배율
  manaCost: number;
  cooldown: number;
  currentCooldown: number;
  type: "active" | "passive";
  category: "combat" | "magic" | "support" | "passive"; // 스킬 분류
  description: string;
  requiredLevel?: number;
  isUnlocked?: boolean;
  isLearned?: boolean; // 배운 스킬인지 (0레벨에서 1레벨로 업그레이드했는지)
}

interface Equipment {
  weapon?: Item;
  armor?: Item;
  helmet?: Item;
  boots?: Item;
  ring?: Item;
  amulet?: Item;
}

interface Item {
  id: string;
  name: string;
  type:
    | "weapon"
    | "armor"
    | "helmet"
    | "boots"
    | "ring"
    | "amulet"
    | "consumable";
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  level: number;
  stats: {
    attack?: number;
    defense?: number;
    hp?: number;
    mp?: number;
    speed?: number;
    critRate?: number;
    critDamage?: number;
  };
  price: number;
  enhancement: number;
  // 물약용 속성들
  consumableEffect?: {
    healHp?: number;
    healMp?: number;
    buffDuration?: number; // 버프 지속시간 (밀리초)
    buffType?: "attack" | "defense" | "speed"; // 버프 타입
    buffAmount?: number; // 버프 수치
  };
  quantity?: number; // 소비 아이템 수량
}

interface Guild {
  id: string;
  name: string;
  level: number;
  members: number;
  maxMembers: number;
  benefits: {
    expBonus: number;
    goldBonus: number;
    dropBonus: number;
  };
}

interface AppProps {
  onAction: (eventType: string, data: any) => void;
  isSimulating: boolean;
  currentAction: string | null;
  userStats: any;
  setUserStats: (stats: any) => void;
  currentUser: any;
}

export const AdvancedIdleRPG: React.FC<AppProps> = ({
  onAction,
  isSimulating,
  currentAction,
  userStats,
  setUserStats,
  currentUser,
}) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  // Theme-based color scheme for RPG UI
  const isLightMode = colors.cardBg === "#ffffff";
  const gameColors = {
    // Main containers and backgrounds
    mainBg: colors.background,
    cardBg: colors.cardBg,
    cardBorder: colors.cardBorder,
    
    // Text colors - ensure high contrast
    primaryText: isLightMode ? "#1f2937" : "#f8fafc",
    secondaryText: isLightMode ? "#6b7280" : "#9ca3af",
    
    // Game-specific backgrounds that work better in light mode
    panelBg: isLightMode ? "#ffffff" : "#374151",
    darkPanelBg: isLightMode ? "#f1f5f9" : "#1f2937",
    
    // Character/game info panels
    characterPanelBg: isLightMode 
      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" 
      : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    
    // Combat/battle backgrounds
    combatBg: isLightMode
      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      : "linear-gradient(135deg, #7c2d12 0%, #dc2626 100%)",
    
    // Dungeon card backgrounds
    dungeonUnlockedBg: isLightMode ? "#ffffff" : "#374151",
    dungeonLockedBg: isLightMode ? "#f8fafc" : "#1f2937",
    dungeonUnlockedBorder: isLightMode ? "#10b981" : "#10b981",
    dungeonLockedBorder: isLightMode ? "#d1d5db" : "#4b5563",
    
    // Status colors (these remain consistent for game logic)
    health: "#34d399",
    mana: "#a78bfa",
    attack: "#f87171",
    defense: "#60a5fa",
    gold: "#fbbf24",
    exp: "#f59e0b",
    
    // Rarity colors (consistent across themes)
    common: "#9ca3af",
    uncommon: "#10b981",
    rare: "#3b82f6",
    epic: "#8b5cf6",
    legendary: "#f59e0b",
    mythic: "#ef4444",
    
    // Interactive elements
    buttonBg: colors.cardBg === "#ffffff" ? "#3b82f6" : "#4f46e5",
    buttonText: "#ffffff",
    buttonHover: colors.cardBg === "#ffffff" ? "#2563eb" : "#6366f1",
    
    // Progress/warning backgrounds
    progressBg: isLightMode
      ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    
    // Borders and dividers
    border: colors.cardBorder,
    divider: colors.cardBg === "#ffffff" ? "#e5e7eb" : "#4b5563"
  };

  // 스킬 데미지 계산 함수
  const calculateSkillDamage = (skill: Skill, character: Character): number => {
    if (skill.level === 0 || !skill.isLearned) return 0;

    let damage = skill.baseDamage;

    // 레벨에 따른 데미지 증가
    damage += skill.baseDamage * skill.damageMultiplier * (skill.level - 1);

    // 스탯에 따른 데미지 증가
    if (skill.statMultiplier.attack) {
      damage += character.attack * skill.statMultiplier.attack * skill.level;
    }
    if (skill.statMultiplier.defense) {
      damage += character.defense * skill.statMultiplier.defense * skill.level;
    }
    if (skill.statMultiplier.hp) {
      damage += character.maxHp * skill.statMultiplier.hp * skill.level;
    }
    if (skill.statMultiplier.mp) {
      damage += character.maxMp * skill.statMultiplier.mp * skill.level;
    }

    return Math.floor(damage);
  };

  // CSS 애니메이션 추가
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes progress {
        0% {
          width: 0%;
        }
        100% {
          width: 100%;
        }
      }
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [character, setCharacter] = useState<Character>({
    id: "1",
    name: "용사",
    level: 1,
    exp: 0,
    maxExp: 100,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    attack: 20,
    defense: 10,
    speed: 15,
    gold: 100,
    class: t("rpg.class.warrior"),
    skills: [
      // 기본 스킬들을 미리 정의하여 초기화 문제 방지
      {
        id: "basic-attack",
        name: "기본 공격",
        level: 1,
        maxLevel: 10,
        baseDamage: 15,
        damageMultiplier: 0.2,
        statMultiplier: { attack: 1.0 },
        manaCost: 0,
        cooldown: 1000,
        currentCooldown: 0,
        type: "active",
        category: "combat",
        description: "기본적인 물리 공격입니다.",
        requiredLevel: 1,
        isUnlocked: true,
        isLearned: true,
      },
      {
        id: "power-strike",
        name: "강력한 베기",
        level: 0,
        maxLevel: 10,
        baseDamage: 25,
        damageMultiplier: 0.3,
        statMultiplier: { attack: 1.5 },
        manaCost: 15,
        cooldown: 3000,
        currentCooldown: 0,
        type: "active",
        category: "combat",
        description: "강력한 일격을 가합니다.",
        requiredLevel: 3,
        isUnlocked: true,
        isLearned: false,
      },
      {
        id: "heal",
        name: "치유",
        level: 0,
        maxLevel: 10,
        baseDamage: 30,
        damageMultiplier: 0.25,
        statMultiplier: { mp: 0.5 },
        manaCost: 20,
        cooldown: 5000,
        currentCooldown: 0,
        type: "active",
        category: "support",
        description: "HP를 회복합니다.",
        requiredLevel: 2,
        isUnlocked: true,
        isLearned: false,
      },
      {
        id: "strength-boost",
        name: t("rpg.skills.strengthBoost.name"),
        level: 0,
        maxLevel: 5,
        baseDamage: 0,
        damageMultiplier: 0,
        statMultiplier: { attack: 0.1 },
        manaCost: 0,
        cooldown: 0,
        currentCooldown: 0,
        type: "passive",
        category: "passive",
        description: t("rpg.skills.strengthBoost.description"),
        requiredLevel: 5,
        isUnlocked: true,
        isLearned: false,
      },
    ],
    equipment: {},
    stats: {
      strength: 10,
      agility: 8,
      intelligence: 5,
      vitality: 12,
      luck: 7,
      availablePoints: 0,
    },
    prestige: 0,
    rebirth: 0,
    buffs: {
      attack: { amount: 0, duration: 0 },
      defense: { amount: 0, duration: 0 },
      speed: { amount: 0, duration: 0 },
    },
  });

  const [currentTab, setCurrentTab] = useState<
    "lobby" | "dungeon" | "character" | "inventory" | "skills" | "shop"
  >("lobby");
  const [gameMode, setGameMode] = useState<"lobby" | "dungeon" | "combat">(
    "lobby"
  );
  const [isAutoFighting, setIsAutoFighting] = useState(false);
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [availableDungeons, setAvailableDungeons] = useState<Dungeon[]>([]);
  const [currentDungeon, setCurrentDungeon] = useState<Dungeon | null>(null);
  const [inDungeon, setInDungeon] = useState(false);
  const [guild, setGuild] = useState<Guild | null>(null);
  const [shop, setShop] = useState<Item[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [monstersDefeated, setMonstersDefeated] = useState(0);
  const [totalGoldEarned, setTotalGoldEarned] = useState(0);
  const [showDungeonChoice, setShowDungeonChoice] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);

  // 게임 초기화 - 언어 변경 시에도 다시 초기화
  useEffect(() => {
    initializeGame();
  }, [t]);

  // 캐릭터 상태가 변경될 때마다 userStats 업데이트
  useEffect(() => {
    setUserStats({
      level: character.level,
      gold: character.gold,
      attack: character.attack,
      defense: character.defense,
      hp: character.hp,
      maxHp: character.maxHp,
      exp: character.exp,
      maxExp: character.maxExp,
      monsters_defeated: monstersDefeated,
      character_class: character.class,
      total_gold_earned: totalGoldEarned,
      inventory_items: inventory.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        quantity: item.quantity || 1,
        stats: item.stats,
      })),
      skills: character.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        type: skill.type,
      })),
      current_buffs: Object.entries(character.buffs)
        .filter(([_, buff]) => buff.duration > 0)
        .map(([type, buff]) => ({
          type,
          amount: buff.amount,
          duration: Math.ceil(buff.duration / 1000),
        })),
    });
  }, [character, inventory, monstersDefeated, totalGoldEarned, setUserStats]);

  const initializeGame = () => {
    // LanguageContext에서 번역 함수 사용
    const texts = {
      character: {
        name: t("rpg.character.name"),
        class: t("rpg.character.class"),
      },
      dungeon: {
        forest: {
          name: t("rpg.dungeon.forest.name"),
          description: t("rpg.dungeon.forest.description"),
        },
        cave: {
          name: t("rpg.dungeon.cave.name"),
          description: t("rpg.dungeon.cave.description"),
        },
        tower: {
          name: t("rpg.dungeon.tower.name"),
          description: t("rpg.dungeon.tower.description"),
        },
      },
      monsters: {
        slime: t("rpg.monsters.slime"),
        goblin: t("rpg.monsters.goblin"),
        orc: t("rpg.monsters.orc"),
        troll: t("rpg.monsters.troll"),
        dragon: t("rpg.monsters.dragon"),
      },
      combat: {
        appeared: t("rpg.combat.appeared"),
        attack: t("rpg.combat.attack"),
        damage: t("rpg.combat.damage"),
        critical: t("rpg.combat.critical"),
        levelUp: t("rpg.combat.levelUp"),
        defeated: t("rpg.combat.defeated"),
        gold: t("rpg.combat.gold"),
        itemObtained: t("rpg.combat.itemObtained"),
        dungeonCleared: t("rpg.combat.dungeonCleared"),
        nextFloor: t("rpg.combat.nextFloor"),
      },
    };
    // 모든 스킬 정의 함수 (공통 사용)
    const getAllSkills = (
      currentLevel: number,
      existingSkills?: Skill[]
    ): Skill[] => {
      const allSkills = [
        // 전투 스킬 (레벨 1)
        {
          id: "slash",
          name: t("rpg.skills.slash.name"),
          level: existingSkills?.find((s) => s.id === "slash")?.level || 0,
          maxLevel: 10,
          baseDamage: 20,
          damageMultiplier: 0.5,
          statMultiplier: { attack: 2.0 },
          manaCost: 10,
          cooldown: 3000,
          currentCooldown: 0,
          type: "active" as const,
          category: "combat" as const,
          description: t("rpg.skills.slash.description"),
          requiredLevel: 1,
          isUnlocked: currentLevel >= 1,
          isLearned: false,
        },
        {
          id: "heal",
          name: t("rpg.skills.heal.name"),
          level: 0,
          maxLevel: 10,
          baseDamage: 30,
          damageMultiplier: 0.3,
          statMultiplier: { mp: 1.5 },
          manaCost: 15,
          cooldown: 5000,
          currentCooldown: 0,
          type: "active" as const,
          category: "support" as const,
          description: t("rpg.skills.heal.description"),
          requiredLevel: 1,
          isUnlocked: currentLevel >= 1,
          isLearned: false,
        },
        {
          id: "critical",
          name: t("rpg.skills.critical.name"),
          level: 0,
          maxLevel: 10,
          baseDamage: 0,
          damageMultiplier: 0,
          statMultiplier: {},
          manaCost: 0,
          cooldown: 0,
          currentCooldown: 0,
          type: "passive" as const,
          category: "passive" as const,
          description: t("rpg.skills.critical.description"),
          requiredLevel: 1,
          isUnlocked: currentLevel >= 1,
          isLearned: false,
        },
        // 레벨 5 스킬
        {
          id: "double_strike",
          name: "이중 공격",
          level: 0,
          maxLevel: 10,
          baseDamage: 25,
          damageMultiplier: 0.4,
          statMultiplier: { attack: 1.5 },
          manaCost: 20,
          cooldown: 4000,
          currentCooldown: 0,
          type: "active" as const,
          category: "combat" as const,
          description:
            "연속으로 두 번 공격합니다. (기본 데미지 x 2 + 공격력 x 1.5)",
          requiredLevel: 5,
          isUnlocked: currentLevel >= 5,
          isLearned: false,
        },
        {
          id: "mana_shield",
          name: "마나 방패",
          level: 0,
          maxLevel: 10,
          baseDamage: 20,
          damageMultiplier: 0.2,
          statMultiplier: { mp: 1.0, defense: 0.5 },
          manaCost: 25,
          cooldown: 8000,
          currentCooldown: 0,
          type: "active" as const,
          category: "magic" as const,
          description: "마나로 피해를 흡수합니다. (방어력 + 마나 x 1.0)",
          requiredLevel: 5,
          isUnlocked: currentLevel >= 5,
          isLearned: false,
        },
        {
          id: "defense_mastery",
          name: "방어 숙련",
          level: 0,
          maxLevel: 10,
          baseDamage: 0,
          damageMultiplier: 0,
          statMultiplier: {},
          manaCost: 0,
          cooldown: 0,
          currentCooldown: 0,
          type: "passive" as const,
          category: "passive" as const,
          description: "방어력을 영구히 증가시킵니다. (레벨당 +3 방어력)",
          requiredLevel: 5,
          isUnlocked: currentLevel >= 5,
          isLearned: false,
        },
        // 레벨 10 스킬
        {
          id: "whirlwind",
          name: "회오리 공격",
          level: 0,
          maxLevel: 10,
          baseDamage: 40,
          damageMultiplier: 0.6,
          statMultiplier: { attack: 1.8 },
          manaCost: 35,
          cooldown: 6000,
          currentCooldown: 0,
          type: "active" as const,
          category: "combat" as const,
          description:
            "주변의 모든 적을 공격합니다. (기본 데미지 + 공격력 x 1.8)",
          requiredLevel: 10,
          isUnlocked: currentLevel >= 10,
          isLearned: false,
        },
        {
          id: "regeneration",
          name: "재생",
          level: 0,
          maxLevel: 10,
          baseDamage: 50,
          damageMultiplier: 0.4,
          statMultiplier: { hp: 0.1, mp: 2.0 },
          manaCost: 40,
          cooldown: 12000,
          currentCooldown: 0,
          type: "active" as const,
          category: "support" as const,
          description:
            "지속적으로 HP를 회복합니다. (기본 회복량 + 최대체력 x 0.1 + 마나 x 2.0)",
          requiredLevel: 10,
          isUnlocked: currentLevel >= 10,
          isLearned: false,
        },
        {
          id: "mp_efficiency",
          name: "마나 효율",
          level: 0,
          maxLevel: 10,
          baseDamage: 0,
          damageMultiplier: 0,
          statMultiplier: {},
          manaCost: 0,
          cooldown: 0,
          currentCooldown: 0,
          type: "passive" as const,
          category: "passive" as const,
          description: "모든 스킬의 마나 소모량을 감소시킵니다. (레벨당 -5%)",
          requiredLevel: 10,
          isUnlocked: currentLevel >= 10,
          isLearned: false,
        },
        // 레벨 15 스킬
        {
          id: "meteor",
          name: "메테오",
          level: 0,
          maxLevel: 10,
          baseDamage: 80,
          damageMultiplier: 1.0,
          statMultiplier: { mp: 3.0, attack: 1.0 },
          manaCost: 60,
          cooldown: 10000,
          currentCooldown: 0,
          type: "active" as const,
          category: "magic" as const,
          description:
            "강력한 마법 공격을 가합니다. (기본 데미지 + 마나 x 3.0 + 공격력 x 1.0)",
          requiredLevel: 15,
          isUnlocked: currentLevel >= 15,
          isLearned: false,
        },
        {
          id: "time_stop",
          name: "시간 정지",
          level: 0,
          maxLevel: 10,
          baseDamage: 0,
          damageMultiplier: 0,
          statMultiplier: { mp: 1.0 },
          manaCost: 80,
          cooldown: 15000,
          currentCooldown: 0,
          type: "active" as const,
          category: "magic" as const,
          description:
            "모든 적의 움직임을 잠시 멈춥니다. (지속시간: 마나 x 0.1초)",
          requiredLevel: 15,
          isUnlocked: currentLevel >= 15,
          isLearned: false,
        },
        {
          id: "exp_boost",
          name: t("rpg.skills.expAmplify.name"),
          level: 0,
          maxLevel: 10,
          baseDamage: 0,
          damageMultiplier: 0,
          statMultiplier: {},
          manaCost: 0,
          cooldown: 0,
          currentCooldown: 0,
          type: "passive" as const,
          category: "passive" as const,
          description: t("rpg.skills.expAmplify.description"),
          requiredLevel: 15,
          isUnlocked: currentLevel >= 15,
          isLearned: false,
        },
      ];

      // 해금된 스킬만 반환
      return allSkills.filter((skill) => skill.isUnlocked);
    };

    const initialSkills = getAllSkills(1);

    // 던전 초기화
    const initialDungeons: Dungeon[] = [
      {
        id: "forest",
        name: texts.dungeon.forest.name,
        level: 1,
        description: texts.dungeon.forest.description,
        floors: 10,
        currentFloor: 1,
        clearedFloors: new Set<number>(),
        monsters: [],
        rewards: {
          goldRange: [10, 25],
          expRange: [15, 30],
          itemDropChance: 0.1,
        },
        requiredLevel: 1,
        isUnlocked: true,
      },
      {
        id: "cave",
        name: texts.dungeon.cave.name,
        level: 5,
        description: texts.dungeon.cave.description,
        floors: 15,
        currentFloor: 1,
        clearedFloors: new Set<number>(),
        monsters: [],
        rewards: {
          goldRange: [25, 50],
          expRange: [40, 75],
          itemDropChance: 0.15,
        },
        requiredLevel: 5,
        isUnlocked: false,
      },
      {
        id: "tower",
        name: texts.dungeon.tower.name,
        level: 10,
        description: texts.dungeon.tower.description,
        floors: 20,
        currentFloor: 1,
        clearedFloors: new Set<number>(),
        monsters: [],
        rewards: {
          goldRange: [50, 100],
          expRange: [80, 150],
          itemDropChance: 0.2,
        },
        requiredLevel: 10,
        isUnlocked: false,
      },
      {
        id: "abyss",
        name: t("rpg.dungeon.abyss.name"),
        level: 20,
        description: t("rpg.dungeon.abyss.description"),
        floors: 50,
        currentFloor: 1,
        clearedFloors: new Set<number>(),
        monsters: [],
        rewards: {
          goldRange: [100, 200],
          expRange: [200, 300],
          itemDropChance: 0.3,
        },
        requiredLevel: 20,
        isUnlocked: false,
        isComingSoon: true, // 업데이트 예정 플래그
      },
    ];

    // 상점 아이템 초기화 (기본 아이템들)
    const getShopItems = () => {
      const baseItems: Item[] = [
        {
          id: "sword1",
          name: t("rpg.items.sword1"),
          type: "weapon",
          rarity: "common",
          level: 1,
          stats: { attack: 15 },
          price: 200,
          enhancement: 0,
        },
        {
          id: "armor1",
          name: t("rpg.items.armor1"),
          type: "armor",
          rarity: "common",
          level: 1,
          stats: { defense: 10, hp: 20 },
          price: 150,
          enhancement: 0,
        },
        {
          id: "helmet1",
          name: t("rpg.items.helmet1"),
          type: "helmet",
          rarity: "common",
          level: 1,
          stats: { defense: 5, hp: 15 },
          price: 100,
          enhancement: 0,
        },
        // 기본 물약들
        {
          id: "health_potion",
          name: t("rpg.items.health_potion"),
          type: "consumable",
          rarity: "common",
          level: 1,
          stats: {},
          price: 50,
          enhancement: 0,
          consumableEffect: {
            healHp: 50,
          },
          quantity: 1,
        },
        {
          id: "mana_potion",
          name: t("rpg.items.mana_potion"),
          type: "consumable",
          rarity: "common",
          level: 1,
          stats: {},
          price: 40,
          enhancement: 0,
          consumableEffect: {
            healMp: 30,
          },
          quantity: 1,
        },
      ];

      // 고블린 동굴이 해금되면 고급 아이템 추가
      const goblinCaveUnlocked = availableDungeons.find(
        (d) => d.id === "cave"
      )?.isUnlocked;
      if (goblinCaveUnlocked) {
        baseItems.push(
          // 고급 장비
          {
            id: "steel_sword",
            name: t("rpg.items.enhanced_steel_sword"),
            type: "weapon",
            rarity: "rare",
            level: 3,
            stats: { attack: 25 },
            price: 500,
            enhancement: 0,
          },
          {
            id: "plate_armor",
            name: "판금 갑옷",
            type: "armor",
            rarity: "rare",
            level: 3,
            stats: { defense: 20, hp: 40 },
            price: 400,
            enhancement: 0,
          },
          {
            id: "steel_helmet",
            name: t("rpg.items.steel_helmet"),
            type: "helmet",
            rarity: "rare",
            level: 3,
            stats: { defense: 12, hp: 25 },
            price: 300,
            enhancement: 0,
          },
          // 고급 물약들
          {
            id: "greater_health_potion",
            name: t("rpg.items.greater_health_potion"),
            type: "consumable",
            rarity: "rare",
            level: 2,
            stats: {},
            price: 120,
            enhancement: 0,
            consumableEffect: {
              healHp: 120,
            },
            quantity: 1,
          },
          {
            id: "greater_mana_potion",
            name: "고급 마나 물약",
            type: "consumable",
            rarity: "rare",
            level: 2,
            stats: {},
            price: 100,
            enhancement: 0,
            consumableEffect: {
              healMp: 80,
            },
            quantity: 1,
          },
          {
            id: "strength_potion",
            name: t("rpg.items.strength_potion"),
            type: "consumable",
            rarity: "rare",
            level: 2,
            stats: {},
            price: 150,
            enhancement: 0,
            consumableEffect: {
              buffType: "attack",
              buffAmount: 10,
              buffDuration: 30000,
            },
            quantity: 1,
          },
          {
            id: "defense_potion",
            name: t("rpg.items.defense_potion"),
            type: "consumable",
            rarity: "rare",
            level: 2,
            stats: {},
            price: 150,
            enhancement: 0,
            consumableEffect: {
              buffType: "defense",
              buffAmount: 8,
              buffDuration: 30000,
            },
            quantity: 1,
          }
        );
      }

      return baseItems;
    };

    const shopItems = getShopItems();

    setCharacter((prev) => {
      // 기존 스킬이 있으면 보존하고, 없으면 새로 생성
      const existingSkills =
        prev.skills && prev.skills.length > 0 ? prev.skills : initialSkills;

      // 새로운 스킬이 있으면 추가하되, 기존 스킬의 진행도는 보존
      const mergedSkills = initialSkills.map((newSkill) => {
        const existingSkill = existingSkills.find((s) => s.id === newSkill.id);
        if (existingSkill) {
          // 기존 스킬이 있으면 레벨과 학습 상태 보존
          return {
            ...newSkill,
            level: existingSkill.level,
            isLearned: existingSkill.isLearned,
            isUnlocked: prev.level >= (newSkill.requiredLevel || 1),
          };
        }
        return newSkill;
      });

      return {
        ...prev,
        name: texts.character.name,
        class: texts.character.class,
        skills: mergedSkills,
      };
    });
    setAvailableDungeons(initialDungeons);
    setShop(shopItems);
    // Store texts globally for other functions to use
    (window as any).gameTexts = texts;

    // 던전에 있지 않을 때만 일반 몬스터 생성
    if (!inDungeon) {
      spawnMonster();
    }
  };

  // 던전 해금 상태에 따른 상점 업데이트
  useEffect(() => {
    const updateShop = () => {
      const getShopItems = () => {
        const baseItems: Item[] = [
          {
            id: "sword1",
            name: t("rpg.items.steel_sword"),
            type: "weapon",
            rarity: "common",
            level: 1,
            stats: { attack: 15 },
            price: 200,
            enhancement: 0,
          },
          {
            id: "armor1",
            name: t("rpg.items.leather_armor"),
            type: "armor",
            rarity: "common",
            level: 1,
            stats: { defense: 10, hp: 20 },
            price: 150,
            enhancement: 0,
          },
          {
            id: "helmet1",
            name: t("rpg.items.iron_helmet"),
            type: "helmet",
            rarity: "common",
            level: 1,
            stats: { defense: 5, hp: 15 },
            price: 100,
            enhancement: 0,
          },
          // 기본 물약들
          {
            id: "health_potion",
            name: t("rpg.items.health_potion"),
            type: "consumable",
            rarity: "common",
            level: 1,
            stats: {},
            price: 50,
            enhancement: 0,
            consumableEffect: {
              healHp: 50,
            },
            quantity: 1,
          },
          {
            id: "mana_potion",
            name: t("rpg.items.mana_potion"),
            type: "consumable",
            rarity: "common",
            level: 1,
            stats: {},
            price: 40,
            enhancement: 0,
            consumableEffect: {
              healMp: 30,
            },
            quantity: 1,
          },
        ];

        // 고블린 동굴이 해금되면 고급 아이템 추가
        const goblinCaveUnlocked = availableDungeons.find(
          (d) => d.id === "cave"
        )?.isUnlocked;
        if (goblinCaveUnlocked) {
          // 중복 방지: 이미 있는 아이템은 추가하지 않음
          const existingIds = baseItems.map((item) => item.id);
          const newItems = [
            {
              id: "steel_sword",
              name: t("rpg.items.enhanced_steel_sword"),
              type: "weapon" as const,
              rarity: "rare" as const,
              level: 3,
              stats: { attack: 25 },
              price: 500,
              enhancement: 0,
            },
            {
              id: "plate_armor",
              name: t("rpg.items.plate_armor"),
              type: "armor" as const,
              rarity: "rare" as const,
              level: 3,
              stats: { defense: 20, hp: 40 },
              price: 400,
              enhancement: 0,
            },
            {
              id: "steel_helmet",
              name: t("rpg.items.steel_helmet"),
              type: "helmet" as const,
              rarity: "rare" as const,
              level: 3,
              stats: { defense: 12, hp: 25 },
              price: 300,
              enhancement: 0,
            },
            {
              id: "greater_health_potion",
              name: t("rpg.items.greater_health_potion"),
              type: "consumable" as const,
              rarity: "rare" as const,
              level: 2,
              stats: {},
              price: 120,
              enhancement: 0,
              consumableEffect: {
                healHp: 120,
              },
              quantity: 1,
            },
            {
              id: "greater_mana_potion",
              name: "고급 마나 물약",
              type: "consumable" as const,
              rarity: "rare" as const,
              level: 2,
              stats: {},
              price: 100,
              enhancement: 0,
              consumableEffect: {
                healMp: 80,
              },
              quantity: 1,
            },
            {
              id: "strength_potion",
              name: t("rpg.items.strength_potion"),
              type: "consumable" as const,
              rarity: "rare" as const,
              level: 2,
              stats: {},
              price: 150,
              enhancement: 0,
              consumableEffect: {
                buffType: "attack" as const,
                buffAmount: 10,
                buffDuration: 30000,
              },
              quantity: 1,
            },
            {
              id: "defense_potion",
              name: t("rpg.items.defense_potion"),
              type: "consumable" as const,
              rarity: "rare" as const,
              level: 2,
              stats: {},
              price: 150,
              enhancement: 0,
              consumableEffect: {
                buffType: "defense" as const,
                buffAmount: 8,
                buffDuration: 30000,
              },
              quantity: 1,
            },
          ].filter((item) => !existingIds.includes(item.id));

          baseItems.push(...newItems);
        }

        // 마법사의 탑이 해금되면 최고급 아이템 추가
        const wizardTowerUnlocked = availableDungeons.find(
          (d) => d.id === "tower"
        )?.isUnlocked;
        if (wizardTowerUnlocked) {
          const existingIds = baseItems.map((item) => item.id);
          const wizardItems = [
            {
              id: "enchanted_sword",
              name: "마법 부여 검",
              type: "weapon" as const,
              rarity: "epic" as const,
              level: 5,
              stats: { attack: 40, mp: 20 },
              price: 1200,
              enhancement: 0,
            },
            {
              id: "dragon_armor",
              name: "드래곤 갑옷",
              type: "armor" as const,
              rarity: "epic" as const,
              level: 5,
              stats: { defense: 35, hp: 80 },
              price: 1000,
              enhancement: 0,
            },
            {
              id: "mystic_helmet",
              name: "신비의 투구",
              type: "helmet" as const,
              rarity: "epic" as const,
              level: 5,
              stats: { defense: 20, hp: 40, mp: 30 },
              price: 800,
              enhancement: 0,
            },
            {
              id: "supreme_health_potion",
              name: "최고급 체력 물약",
              type: "consumable" as const,
              rarity: "epic" as const,
              level: 3,
              stats: {},
              price: 300,
              enhancement: 0,
              consumableEffect: {
                healHp: 250,
              },
              quantity: 1,
            },
            {
              id: "supreme_mana_potion",
              name: "최고급 마나 물약",
              type: "consumable" as const,
              rarity: "epic" as const,
              level: 3,
              stats: {},
              price: 250,
              enhancement: 0,
              consumableEffect: {
                healMp: 200,
              },
              quantity: 1,
            },
            {
              id: "berserker_potion",
              name: t("rpg.items.berserker_potion"),
              type: "consumable" as const,
              rarity: "epic" as const,
              level: 3,
              stats: {},
              price: 400,
              enhancement: 0,
              consumableEffect: {
                buffType: "attack" as const,
                buffAmount: 25,
                buffDuration: 60000,
              },
              quantity: 1,
            },
            {
              id: "guardian_potion",
              name: "수호자의 물약",
              type: "consumable" as const,
              rarity: "epic" as const,
              level: 3,
              stats: {},
              price: 400,
              enhancement: 0,
              consumableEffect: {
                buffType: "defense" as const,
                buffAmount: 20,
                buffDuration: 60000,
              },
              quantity: 1,
            },
          ].filter((item) => !existingIds.includes(item.id));

          baseItems.push(...wizardItems);
        }

        return baseItems;
      };

      setShop(getShopItems());
    };

    updateShop();
  }, [availableDungeons]);

  // 레벨업 시 스킬 업데이트
  useEffect(() => {
    const updateSkills = () => {
      setCharacter((prev) => {
        // 기존 스킬들의 해금 상태만 업데이트
        const updatedSkills = prev.skills.map((skill) => ({
          ...skill,
          isUnlocked: prev.level >= (skill.requiredLevel || 1),
        }));
        return { ...prev, skills: updatedSkills };
      });
    };

    updateSkills();
  }, [character.level]);

  // 스킬 사용 함수 (수정된 데미지 계산 포함)
  const executeSkill = (skill: Skill) => {
    if (!skill.isLearned || skill.level === 0) {
      addToCombatLog(t("rpg.combat.skillLearnFirst"));
      return;
    }

    if (character.mp < skill.manaCost) {
      addToCombatLog(t("rpg.combat.notEnoughMana"));
      return;
    }

    if (skill.currentCooldown > 0) {
      addToCombatLog(t("rpg.combat.skillCooldown"));
      return;
    }

    const damage = calculateSkillDamage(skill, character);

    // 스킬 사용 로직
    if (skill.id === "heal" || skill.id === "regeneration") {
      // 힐링 스킬
      const healAmount = damage;
      setCharacter((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount),
        mp: prev.mp - skill.manaCost,
      }));
      addToCombatLog(`${skill.name} 사용! ${healAmount} 체력 회복!`);
    } else if (currentMonster) {
      // 공격 스킬
      const newMonsterHp = Math.max(0, currentMonster.hp - damage);
      setCurrentMonster((prev) =>
        prev ? { ...prev, hp: newMonsterHp } : null
      );
      setCharacter((prev) => ({ ...prev, mp: prev.mp - skill.manaCost }));
      addToCombatLog(`${skill.name} 사용! ${damage} 데미지!`);

      if (newMonsterHp === 0) {
        setTimeout(defeatMonster, 500);
      }
    }

    // 쿨다운 설정
    setCharacter((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.id === skill.id ? { ...s, currentCooldown: skill.cooldown } : s
      ),
    }));
  };

  // 스킬 배우기 (0레벨에서 1레벨로 업그레이드) 함수
  const learnSkill = (skill: Skill) => {
    if (skill.level > 0) {
      addToCombatLog(t("rpg.combat.alreadyLearned"));
      return;
    }

    const cost = 100; // 스킬 배우기 비용
    if (character.gold < cost) {
      addToCombatLog(t("rpg.combat.notEnoughGold"));
      return;
    }

    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      skills: prev.skills.map((s) =>
        s.id === skill.id ? { ...s, level: 1, isLearned: true } : s
      ),
    }));
    addToCombatLog(`${skill.name}을(를) 배웠습니다!`);
  };

  // 스킬 렌더링 함수 (분류별)
  // 스킬 아이콘 맵핑
  const getSkillIcon = (skill: Skill) => {
    const iconMap: { [key: string]: string } = {
      // 전투 스킬
      "basic-attack": "⚔️",
      "power-strike": "💥",
      "fire-slash": "🔥",
      "lightning-bolt": "⚡",
      "ice-shard": "❄️",
      "double-attack": "⚔️⚔️",
      // 지원 스킬
      heal: "💚",
      "mana-recovery": "💙",
      shield: "🛡️",
      haste: "💨",
      blessing: "✨",
      // 패시브 스킬
      "strength-boost": "💪",
      "defense-boost": "🛡️",
      "agility-boost": "🏃",
      "mana-boost": "🔮",
      "critical-chance": "💎",
      vampire: "🩸",
    };
    return iconMap[skill.id] || "📜";
  };

  // 선택된 스킬 상태
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // 스킬 탭 내부의 서브 탭 상태
  const [skillSubTab, setSkillSubTab] = React.useState<
    "combat" | "support" | "passive"
  >("combat");

  // 스킬 탭 컨텐츠 렌더링 (게임 스타일 UI)
  const renderSkillsTab = () => (
    <div style={{ padding: "20px", background: gameColors.mainBg, minHeight: "600px" }}>
      {/* 공통 캐릭터 헤더 */}
      {renderCharacterHeader()}

      <div style={{ display: "flex", gap: "20px" }}>
        {/* 왼쪽 카테고리 사이드바 */}
        <div style={{ width: "200px" }}>
          <h3
            style={{ color: gameColors.primaryText, marginBottom: "15px", fontSize: "16px" }}
          >
            📚 {t("rpg.ui.skillInfo")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {[
              {
                id: "combat",
                label: t("rpg.skills.category.all"),
                count: character.skills.filter((s) => s.isUnlocked).length,
                color: "#8b5cf6",
              },
              {
                id: "combat",
                label: t("rpg.skills.category.combat"),
                count: character.skills.filter(
                  (s) =>
                    s.isUnlocked &&
                    (s.category === "combat" || s.category === "magic")
                ).length,
                color: "#dc2626",
              },
              {
                id: "support",
                label: t("rpg.skills.category.support"),
                count: character.skills.filter(
                  (s) => s.isUnlocked && s.category === "support"
                ).length,
                color: "#10b981",
              },
              {
                id: "passive",
                label: t("rpg.skills.category.passive"),
                count: character.skills.filter(
                  (s) => s.isUnlocked && s.category === "passive"
                ).length,
                color: "#f59e0b",
              },
            ].map((tab, index) => (
              <button
                key={index}
                onClick={() =>
                  setSkillSubTab(index === 0 ? "combat" : (tab.id as any))
                }
                style={{
                  padding: "12px 15px",
                  background:
                    (index === 0 && skillSubTab) || skillSubTab === tab.id
                      ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}CC 100%)`
                      : "rgba(255, 255, 255, 0.1)",
                  color:
                    (index === 0 && skillSubTab) || skillSubTab === tab.id
                      ? "white"
                      : "#9ca3af",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "normal",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",
                    color: gameColors.primaryText,
                    fontSize: "11px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  {index === 0
                    ? character.skills.filter((s) => s.isUnlocked).length
                    : tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 중앙 스킬 그리드 */}
        <div style={{ flex: 1 }}>
          <h3
            style={{ color: gameColors.primaryText, marginBottom: "15px", fontSize: "16px" }}
          >
            🎯{" "}
            {skillSubTab === "combat"
              ? t("rpg.ui.combatSkills")
              : skillSubTab === "support"
              ? t("rpg.skills.supportSkills")
              : t("rpg.skills.category.passive")}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "6px",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "15px",
              borderRadius: "10px",
              border: "2px solid #4b5563",
              minHeight: "400px",
            }}
          >
            {/* 스킬 슬롯 렌더링 */}
            {Array.from({ length: 32 }, (_, index) => {
              const filteredSkills = character.skills.filter((skill) => {
                if (skillSubTab === "combat") {
                  return (
                    skill.isUnlocked &&
                    (skill.category === "combat" || skill.category === "magic")
                  );
                }
                return skill.isUnlocked && skill.category === skillSubTab;
              });

              const skill = filteredSkills[index];
              const isEmpty = !skill;

              return (
                <div
                  key={index}
                  onClick={() => skill && setSelectedSkill(skill)}
                  style={{
                    width: "50px",
                    height: "50px",
                    background: isEmpty
                      ? "rgba(255, 255, 255, 0.05)"
                      : skill.isLearned
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(107, 114, 128, 0.2)",
                    border: isEmpty
                      ? "1px solid #374151"
                      : skill.isLearned
                      ? "2px solid #10b981"
                      : "2px solid #6b7280",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: skill ? "pointer" : "default",
                    position: "relative",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (skill) {
                      e.currentTarget.style.transform = "scale(1.1)";
                      e.currentTarget.style.boxShadow = skill.isLearned
                        ? "0 0 15px #10b98150"
                        : "0 0 15px #6b728050";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (skill) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {skill && (
                    <>
                      <div
                        style={{
                          fontSize: "20px",
                          filter: skill.isLearned ? "none" : "grayscale(1)",
                          opacity: skill.isLearned ? 1 : 0.5,
                        }}
                      >
                        {getSkillIcon(skill)}
                      </div>
                      {/* 레벨 표시 */}
                      {skill.level > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "2px",
                            right: "2px",
                            background: gameColors.uncommon,
                            color: gameColors.primaryText,
                            fontSize: "10px",
                            padding: "1px 4px",
                            borderRadius: "3px",
                            lineHeight: "1",
                            fontWeight: "bold",
                          }}
                        >
                          {skill.level}
                        </div>
                      )}
                      {/* 배울 수 있음 표시 */}
                      {skill.level === 0 && character.gold >= 100 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            background: gameColors.gold,
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            animation: "pulse 2s infinite",
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 오른쪽 스킬 상세 정보 */}
        <div style={{ width: "300px" }}>
          <h3
            style={{ color: gameColors.primaryText, marginBottom: "15px", fontSize: "16px" }}
          >
            📋 {t("rpg.ui.skillInfoPanel")}
          </h3>
          {selectedSkill ? (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: selectedSkill.isLearned
                  ? "2px solid #10b981"
                  : "2px solid #6b7280",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "10px",
                    filter: selectedSkill.isLearned ? "none" : "grayscale(1)",
                    opacity: selectedSkill.isLearned ? 1 : 0.7,
                  }}
                >
                  {getSkillIcon(selectedSkill)}
                </div>
                <h4
                  style={{
                    color: selectedSkill.isLearned ? "#10b981" : "#9ca3af",
                    margin: "0 0 5px 0",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {selectedSkill.name}
                </h4>
                <p
                  style={{
                    color: gameColors.secondaryText,
                    margin: "0 0 15px 0",
                    fontSize: "14px",
                  }}
                >
                  Lv.{selectedSkill.level}/{selectedSkill.maxLevel} •{" "}
                  {selectedSkill.type === "active" ? t("rpg.skills.active") : t("rpg.skills.passive")}
                </p>
              </div>

              {/* 스킬 효과 */}
              <div style={{ marginBottom: "15px" }}>
                <h5
                  style={{
                    color: gameColors.primaryText,
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                  }}
                >
                  {t("rpg.skills.effect")}
                </h5>
                <p
                  style={{
                    color: gameColors.primaryText,
                    fontSize: "12px",
                    lineHeight: "1.4",
                    margin: 0,
                  }}
                >
                  {selectedSkill.description}
                </p>
                {selectedSkill.level > 0 && selectedSkill.type === "active" && (
                  <p
                    style={{
                      color: "#fbbf24",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    데미지: {calculateSkillDamage(selectedSkill, character)}
                  </p>
                )}
              </div>

              {/* 스킬 정보 */}
              {selectedSkill.type === "active" && (
                <div style={{ marginBottom: "15px" }}>
                  <h5
                    style={{
                      color: gameColors.primaryText,
                      margin: "0 0 10px 0",
                      fontSize: "14px",
                    }}
                  >
                    {t("rpg.skills.usageInfo")}
                  </h5>
                  <div style={{ fontSize: "12px", color: gameColors.secondaryText }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "5px",
                      }}
                    >
                      <span>{t("rpg.skills.manaCost")}</span>
                      <span style={{ color: "#60a5fa" }}>
                        {selectedSkill.manaCost}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "5px",
                      }}
                    >
                      <span>{t("rpg.skills.cooldown")}</span>
                      <span style={{ color: "#f472b6" }}>
                        {selectedSkill.cooldown / 1000}초
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 업그레이드 비용 */}
              <div style={{ marginBottom: "15px" }}>
                <h5
                  style={{
                    color: gameColors.primaryText,
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                  }}
                >
                  {selectedSkill.level === 0 ? t("rpg.skills.learnCost") : t("rpg.skills.upgradeCost")}
                </h5>
                <p style={{ color: "#f59e0b", fontSize: "12px", margin: 0 }}>
                  {selectedSkill.level === 0
                    ? "100"
                    : (selectedSkill.level * 100).toLocaleString()}
{t("rpg.item.gold")}
                </p>
              </div>

              {/* 액션 버튼 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {selectedSkill.level === 0 ? (
                  <button
                    onClick={() => {
                      learnSkill(selectedSkill);
                      setSelectedSkill(null);
                    }}
                    disabled={character.gold < 100}
                    style={{
                      background:
                        character.gold >= 100
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : "#6b7280",
                      color: gameColors.primaryText,
                      border: "none",
                      borderRadius: "6px",
                      padding: "12px",
                      fontSize: "14px",
                      cursor: character.gold >= 100 ? "pointer" : "not-allowed",
                      fontWeight: "bold",
                    }}
                  >
                    {t("rpg.skills.learn")} (100G)
                  </button>
                ) : selectedSkill.level < selectedSkill.maxLevel ? (
                  <button
                    onClick={() => {
                      const cost = selectedSkill.level * 100;
                      if (character.gold >= cost) {
                        setCharacter((prev) => ({
                          ...prev,
                          gold: prev.gold - cost,
                          skills: prev.skills.map((s) =>
                            s.id === selectedSkill.id
                              ? { ...s, level: s.level + 1 }
                              : s
                          ),
                        }));
                        addToCombatLog(
                          `${selectedSkill.name}을(를) 레벨업했다! (Lv.${
                            selectedSkill.level + 1
                          })`
                        );
                        setSelectedSkill((prev) =>
                          prev ? { ...prev, level: prev.level + 1 } : null
                        );
                      }
                    }}
                    disabled={character.gold < selectedSkill.level * 100}
                    style={{
                      background:
                        character.gold >= selectedSkill.level * 100
                          ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                          : "#6b7280",
                      color: gameColors.primaryText,
                      border: "none",
                      borderRadius: "6px",
                      padding: "12px",
                      fontSize: "14px",
                      cursor:
                        character.gold >= selectedSkill.level * 100
                          ? "pointer"
                          : "not-allowed",
                      fontWeight: "bold",
                    }}
                  >
                    레벨업 ({(selectedSkill.level * 100).toLocaleString()}G)
                  </button>
                ) : (
                  <div
                    style={{
                      background: gameColors.panelBg,
                      color: gameColors.secondaryText,
                      border: "none",
                      borderRadius: "6px",
                      padding: "12px",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    최대 레벨 달성
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
                padding: "40px",
                textAlign: "center",
                color: gameColors.secondaryText,
              }}
            >
              <p>{t("rpg.skills.info.description")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 몬스터 생성
  const spawnMonster = () => {
    // 이미 몬스터가 있거나 던전에 있으면 새로 생성하지 않음
    if (currentMonster || inDungeon) {
      return;
    }

    const gameTexts = (window as any).gameTexts || {
      monsters: {
        slime: t("rpg.monsters.slime"),
        goblin: t("rpg.monsters.goblin"),
        orc: t("rpg.monsters.orc"),
        troll: t("rpg.monsters.troll"),
        dragon: t("rpg.monsters.dragon"),
      },
      combat: { appeared: t("rpg.combat.appeared") },
    };
    const monsters = [
      {
        name: gameTexts.monsters.slime,
        baseHp: 40,
        baseAttack: 8,
        baseDefense: 2,
        exp: 15,
        gold: 10,
        minLevel: 1,
        maxLevel: 3,
      },
      {
        name: gameTexts.monsters.goblin,
        baseHp: 60,
        baseAttack: 12,
        baseDefense: 4,
        exp: 25,
        gold: 18,
        minLevel: 3,
        maxLevel: 6,
      },
      {
        name: gameTexts.monsters.orc,
        baseHp: 100,
        baseAttack: 18,
        baseDefense: 8,
        exp: 40,
        gold: 30,
        minLevel: 6,
        maxLevel: 10,
      },
      {
        name: gameTexts.monsters.troll,
        baseHp: 150,
        baseAttack: 25,
        baseDefense: 12,
        exp: 60,
        gold: 45,
        minLevel: 10,
        maxLevel: 15,
      },
      {
        name: gameTexts.monsters.dragon,
        baseHp: 300,
        baseAttack: 40,
        baseDefense: 20,
        exp: 120,
        gold: 100,
        minLevel: 15,
        maxLevel: 999,
      },
    ];

    // 캐릭터 레벨에 적합한 몬스터만 필터링
    const availableMonsters = monsters.filter(
      (monster) =>
        character.level >= monster.minLevel &&
        character.level <= monster.maxLevel
    );

    // 적합한 몬스터가 없으면 레벨 범위를 확장
    const finalMonsters =
      availableMonsters.length > 0
        ? availableMonsters
        : monsters.filter(
            (monster) => Math.abs(character.level - monster.minLevel) <= 2
          );

    const randomMonster =
      finalMonsters[Math.floor(Math.random() * finalMonsters.length)];
    const levelMultiplier = 1 + (character.level - 1) * 0.3;

    const monster: Monster = {
      id: `monster_${Date.now()}`,
      name: randomMonster.name,
      level: Math.max(1, character.level + Math.floor(Math.random() * 3 - 1)),
      hp: Math.floor(randomMonster.baseHp * levelMultiplier),
      maxHp: Math.floor(randomMonster.baseHp * levelMultiplier),
      attack: Math.floor(randomMonster.baseAttack * levelMultiplier),
      defense: Math.floor(randomMonster.baseDefense * levelMultiplier),
      speed: 10,
      exp: Math.floor(randomMonster.exp * levelMultiplier),
      gold: Math.floor(randomMonster.gold * levelMultiplier),
      dropItems: generateDropItems(),
      isBoss: Math.random() < 0.1, // 10% 보스 확률
    };

    if (monster.isBoss) {
      monster.name = `보스 ${monster.name}`;
      monster.hp *= 3;
      monster.maxHp *= 3;
      monster.attack *= 2;
      monster.defense *= 2;
      monster.exp *= 5;
      monster.gold *= 3;
    }

    setCurrentMonster(monster);
    addToCombatLog(
      `${monster.name} Lv.${monster.level}${gameTexts.combat.appeared}`
    );
  };

  // 드롭 아이템 생성
  const generateDropItems = (): Item[] => {
    const dropChance = Math.random();
    if (dropChance < 0.1) {
      // 10% 확률로 아이템 드롭
      const rarities: Array<
        "common" | "rare" | "epic" | "legendary" | "mythic"
      > = ["common", "rare", "epic", "legendary", "mythic"];
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      const itemTypes = [
        "weapon",
        "armor",
        "helmet",
        "boots",
        "ring",
        "amulet",
      ] as const;
      const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];

      return [
        {
          id: `drop_${Date.now()}`,
          name: generateItemName(rarity, itemType),
          type: itemType,
          rarity,
          level: character.level,
          stats: generateItemStats(rarity),
          price: calculateItemPrice(rarity, character.level),
          enhancement: 0,
        },
      ];
    }
    return [];
  };

  const generateItemName = (rarity: string, itemType: string): string => {
    const prefixes = {
      common: ["낡은", "일반적인", "기본"],
      rare: ["날카로운", "튼튼한", "마법의"],
      epic: ["전설적인", "고대의", "신성한"],
      legendary: ["전설의", "영웅의", "불멸의"],
      mythic: ["신화의", "창조의", "절대의"],
    };

    const itemNames = {
      weapon: ["검", "도끼", "창", "활", "지팡이"],
      armor: ["갑옷", "로브", "사슬갑옷", "가죽갑옷"],
      helmet: ["투구", "모자", "관", "헬름"],
      boots: ["신발", "부츠", "장화", "샌들"],
      ring: ["반지", "링", "밴드"],
      amulet: ["목걸이", "부적", "펜던트"],
    };

    const prefix =
      prefixes[rarity as keyof typeof prefixes][Math.floor(Math.random() * 3)];
    const itemTypeNames = itemNames[itemType as keyof typeof itemNames] || [
      "아이템",
    ];
    const item =
      itemTypeNames[Math.floor(Math.random() * itemTypeNames.length)];

    return `${prefix} ${item}`;
  };

  const generateItemStats = (rarity: string) => {
    const multipliers = {
      common: 1,
      rare: 1.5,
      epic: 2.5,
      legendary: 4,
      mythic: 7,
    };

    const base = multipliers[rarity as keyof typeof multipliers];
    return {
      attack: Math.floor(Math.random() * 20 * base),
      defense: Math.floor(Math.random() * 15 * base),
      hp: Math.floor(Math.random() * 50 * base),
      mp: Math.floor(Math.random() * 30 * base),
      speed: Math.floor(Math.random() * 10 * base),
      critRate: Math.floor(Math.random() * 10 * base),
      critDamage: Math.floor(Math.random() * 20 * base),
    };
  };

  const calculateItemPrice = (rarity: string, level: number): number => {
    const basePrice = {
      common: 50,
      rare: 150,
      epic: 500,
      legendary: 2000,
      mythic: 10000,
    };

    return Math.floor(
      basePrice[rarity as keyof typeof basePrice] * (1 + level * 0.2)
    );
  };

  // 전투 시스템
  const attack = () => {
    if (!currentMonster) return;

    const buffedAttack = character.attack + character.buffs.attack.amount;
    const damage = calculateDamage(buffedAttack, currentMonster.defense);
    const isCritical = Math.random() < 0.1 + character.stats.luck * 0.01;
    const finalDamage = isCritical ? Math.floor(damage * 1.5) : damage;

    const newMonsterHp = Math.max(0, currentMonster.hp - finalDamage);
    setCurrentMonster((prev) => (prev ? { ...prev, hp: newMonsterHp } : null));

    const gameTexts = (window as any).gameTexts || {
      combat: { attack: "의 공격!", damage: "데미지!", critical: "치명타!" },
    };
    addToCombatLog(
      `${character.name}${gameTexts.combat.attack} ${finalDamage}${
        isCritical ? ` (${gameTexts.combat.critical})` : ""
      } ${gameTexts.combat.damage}`
    );

    onAction("combat_attack", {
      user_id: currentUser.user_id,
      damage: finalDamage,
      is_critical: isCritical,
      monster_name: currentMonster.name,
      monster_level: currentMonster.level,
      character_level: character.level,
      character_attack: character.attack,
      monster_hp_remaining: newMonsterHp,
      dungeon_name: currentDungeon?.name || null,
      dungeon_floor: currentDungeon?.currentFloor || null,
    });

    if (newMonsterHp <= 0) {
      defeatMonster();
    } else {
      // 몬스터 반격
      setTimeout(() => monsterAttack(), 1000);
    }
  };

  const monsterAttack = () => {
    if (!currentMonster || currentMonster.hp <= 0) return;

    const buffedDefense = character.defense + character.buffs.defense.amount;
    const damage = calculateDamage(currentMonster.attack, buffedDefense);
    const newHp = Math.max(0, character.hp - damage);

    setCharacter((prev) => ({ ...prev, hp: newHp }));
    const gameTexts = (window as any).gameTexts || {
      combat: { attack: "의 공격!", damage: "데미지!" },
    };
    addToCombatLog(
      `${currentMonster.name}${gameTexts.combat.attack} ${damage} ${gameTexts.combat.damage}`
    );

    if (newHp <= 0) {
      const gameTexts = (window as any).gameTexts || {
        combat: { defeat: "전투에서 패배했습니다..." },
      };
      addToCombatLog(gameTexts.combat.defeat);
      setIsAutoFighting(false);

      // 전투 실패 이벤트 로깅
      onAction("combat_defeat", {
        monster_name: currentMonster.name,
        monster_level: currentMonster.level,
        character_level: character.level,
        dungeon_id: currentDungeon?.id || "field",
        dungeon_name: currentDungeon?.name || "field",
        damage_taken: currentMonster.attack,
        character_defense: character.defense,
      });

      // 던전에서 나가고 체력/마나 완전 회복
      setTimeout(() => {
        setCharacter((prev) => ({
          ...prev,
          hp: prev.maxHp,
          mp: prev.maxMp,
        }));

        if (inDungeon && currentDungeon) {
          // 던전에서 나가기 (죽음으로 인한 자동 퇴장)
          onAction("dungeon_exited", {
            dungeon_id: currentDungeon.id,
            dungeon_name: currentDungeon.name,
            current_floor: currentDungeon.currentFloor,
            total_floors: currentDungeon.floors,
            character_level: character.level,
            exit_reason: "death",
            time_spent: new Date().getTime(),
          });
          setInDungeon(false);
          setCurrentDungeon(null);
          setCurrentTab("lobby");
          setGameMode("lobby");
          addToCombatLog(
            "던전에서 나왔습니다. 체력과 마나가 완전히 회복되었습니다!"
          );
        } else {
          // 일반 필드에서는 새 몬스터 스폰
          addToCombatLog("체력과 마나가 완전히 회복되었습니다!");
          spawnMonster();
        }
      }, 2000);
    }
  };

  const calculateDamage = (attack: number, defense: number): number => {
    const baseDamage = Math.max(1, attack - Math.floor(defense * 0.5));
    return Math.floor(baseDamage * (0.8 + Math.random() * 0.4));
  };

  const defeatMonster = () => {
    if (!currentMonster) return;

    const expGained = currentMonster.exp;
    const goldGained = currentMonster.gold;

    setCharacter((prev) => {
      let newExp = prev.exp + expGained;
      const newGold = prev.gold + goldGained;
      let newLevel = prev.level;
      let newMaxExp = prev.maxExp;
      let newHp = prev.hp;
      let newMp = prev.mp;
      let newMaxHp = prev.maxHp;
      let newMaxMp = prev.maxMp;
      let availablePoints = prev.stats.availablePoints;

      // 레벨업 체크
      while (newExp >= newMaxExp) {
        newLevel += 1;
        newExp -= newMaxExp;
        newMaxExp = Math.floor(newMaxExp * 1.5);
        newMaxHp += 20;
        newMaxMp += 10;
        newHp = newMaxHp; // 레벨업 시 체력 완전 회복
        newMp = newMaxMp; // 레벨업 시 마나 완전 회복
        availablePoints += 5;

        addToCombatLog(`🎉 레벨업! Lv.${newLevel}이 되었습니다!`);

        onAction("level_up", {
          user_id: currentUser.user_id,
          new_level: newLevel,
          character_class: prev.class,
          stat_points_gained: 5,
        });

        // 던전 해금 체크
        setAvailableDungeons((prevDungeons) =>
          prevDungeons.map((dungeon) => ({
            ...dungeon,
            isUnlocked: dungeon.isUnlocked || newLevel >= dungeon.requiredLevel,
          }))
        );
      }

      return {
        ...prev,
        exp: newExp,
        gold: newGold,
        level: newLevel,
        maxExp: newMaxExp,
        hp: newHp,
        mp: newMp,
        maxHp: newMaxHp,
        maxMp: newMaxMp,
        stats: { ...prev.stats, availablePoints },
      };
    });

    // 아이템 드롭 처리
    if (currentMonster.dropItems.length > 0) {
      setInventory((prev) => [...prev, ...currentMonster.dropItems]);
      addToCombatLog(`✨ ${currentMonster.dropItems[0].name}을 획득했습니다!`);
    }

    addToCombatLog(
      `${currentMonster.name}를 물리쳤다! EXP +${expGained}, 골드 +${goldGained}`
    );

    // 추적 카운터 업데이트
    setMonstersDefeated((prev) => prev + 1);
    setTotalGoldEarned((prev) => prev + goldGained);

    onAction("monster_defeated", {
      user_id: currentUser.user_id,
      monster_name: currentMonster.name,
      monster_level: currentMonster.level,
      character_level: character.level,
      exp_gained: expGained,
      gold_gained: goldGained,
      items_dropped: currentMonster.dropItems.length,
      character_attack: character.attack,
      dungeon_name: currentDungeon?.name || null,
      dungeon_floor: currentDungeon?.currentFloor || null,
    });

    // 현재 몬스터 제거
    setCurrentMonster(null);

    // 던전에 있는 경우 현재 층에서 새로운 몬스터 생성, 아니면 일반 몬스터 생성
    if (inDungeon && currentDungeon) {
      // 현재 층을 클리어한 것으로 마킹
      const updatedDungeon = {
        ...currentDungeon,
        clearedFloors: new Set([
          ...Array.from(currentDungeon.clearedFloors),
          currentDungeon.currentFloor,
        ]),
      };
      setCurrentDungeon(updatedDungeon);

      // 던전 리스트에서도 업데이트
      setAvailableDungeons((prev) =>
        prev.map((d) => (d.id === updatedDungeon.id ? updatedDungeon : d))
      );

      // 던전에서는 현재 층에서 계속 사냥할 수 있도록 새 몬스터 생성
      addToCombatLog(
        t("rpg.messages.monsterDefeatedFloorCleared").replace("{floor}", currentDungeon.currentFloor.toString())
      );
      setTimeout(() => {
        spawnDungeonMonster(updatedDungeon, true);
      }, 2000);
    } else {
      // 일반 방치형 전투에서 새 몬스터 생성 (던전 상태가 아닐 때만)
      if (!inDungeon) {
        setTimeout(() => {
          spawnMonster();
        }, 2000);
      }
    }
  };

  // 다음 층으로 진행
  const proceedToNextFloor = () => {
    if (!currentDungeon) return;

    const updatedDungeon = {
      ...currentDungeon,
      currentFloor: currentDungeon.currentFloor + 1,
    };
    setCurrentDungeon(updatedDungeon);
    setShowDungeonChoice(false);
    setTimeout(() => {
      spawnDungeonMonster(updatedDungeon, true); // 강제 스폰
      addToCombatLog(t("rpg.messages.proceedToFloor").replace("{floor}", updatedDungeon.currentFloor.toString()));
    }, 500);
  };

  // 던전 나가기
  const exitDungeonAfterVictory = () => {
    if (!currentDungeon) return;

    // 던전 나가기 이벤트 로깅
    onAction("dungeon_exited", {
      dungeon_id: currentDungeon.id,
      dungeon_name: currentDungeon.name,
      current_floor: currentDungeon.currentFloor,
      total_floors: currentDungeon.floors,
      character_level: character.level,
      exit_reason: "victory_choice",
      time_spent: new Date().getTime(),
    });

    // 던전 리셋 (현재 층을 1층으로 되돌림)
    const resetDungeon = { ...currentDungeon, currentFloor: 1 };
    setAvailableDungeons((prev) =>
      prev.map((d) => (d.id === resetDungeon.id ? resetDungeon : d))
    );

    setInDungeon(false);
    setCurrentDungeon(null);
    setCurrentTab("lobby");
    setGameMode("lobby");
    setShowDungeonChoice(false);

    // 체력과 마나 완전 회복
    setCharacter((prev) => ({ ...prev, hp: prev.maxHp, mp: prev.maxMp }));
    addToCombatLog("던전에서 나왔습니다. 체력과 마나가 완전히 회복되었습니다!");

    // 새로운 일반 몬스터 생성
    setTimeout(() => {
      spawnMonster();
    }, 1000);
  };

  // 자동 전투
  useEffect(() => {
    if (
      isAutoFighting &&
      currentMonster &&
      currentMonster.hp > 0 &&
      character.hp > 0
    ) {
      const autoAttackTimer = setTimeout(() => {
        attack();
      }, 2000);

      return () => clearTimeout(autoAttackTimer);
    }
  }, [isAutoFighting, currentMonster, character.hp]);

  // 스킬 쿨다운 및 MP 회복
  useEffect(() => {
    const interval = setInterval(() => {
      setCharacter((prev) => ({
        ...prev,
        mp: Math.min(prev.maxMp, prev.mp + 1),
        skills: prev.skills.map((skill) => ({
          ...skill,
          currentCooldown: Math.max(0, skill.currentCooldown - 100),
        })),
        buffs: {
          attack: {
            amount:
              prev.buffs.attack.duration > 0 ? prev.buffs.attack.amount : 0,
            duration: Math.max(0, prev.buffs.attack.duration - 100),
          },
          defense: {
            amount:
              prev.buffs.defense.duration > 0 ? prev.buffs.defense.amount : 0,
            duration: Math.max(0, prev.buffs.defense.duration - 100),
          },
          speed: {
            amount: prev.buffs.speed.duration > 0 ? prev.buffs.speed.amount : 0,
            duration: Math.max(0, prev.buffs.speed.duration - 100),
          },
        },
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const addToCombatLog = (message: string) => {
    setCombatLog((prev) => {
      const newLog = [...prev, message];
      if (newLog.length > 50) newLog.shift();
      return newLog;
    });

    // Auto-scroll to bottom immediately and with backup timing
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }

    // Additional scroll with slight delay to ensure content is rendered
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 10);

    // Final backup scroll
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 100);
  };

  // 스탯 분배
  const allocateStatPoint = (
    stat: keyof Omit<CharacterStats, "availablePoints">
  ) => {
    if (character.stats.availablePoints <= 0) return;

    setCharacter((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: prev.stats[stat] + 1,
        availablePoints: prev.stats.availablePoints - 1,
      },
      // 스탯에 따른 능력치 업데이트
      attack: stat === "strength" ? prev.attack + 2 : prev.attack,
      defense: stat === "vitality" ? prev.defense + 1 : prev.defense,
      maxHp: stat === "vitality" ? prev.maxHp + 10 : prev.maxHp,
      maxMp: stat === "intelligence" ? prev.maxMp + 5 : prev.maxMp,
      speed: stat === "agility" ? prev.speed + 1 : prev.speed,
    }));
  };

  // 아이템 장착
  const equipItem = (item: Item) => {
    // 소비 아이템은 장착할 수 없음
    if (item.type === "consumable") {
      return;
    }

    // 기존에 장착된 아이템이 있는지 확인
    const slot = item.type as keyof Equipment;
    const currentEquippedItem = character.equipment[slot];

    setCharacter((prev) => {
      const newEquipment = { ...prev.equipment };
      newEquipment[slot] = item;

      // 기존 아이템의 스탯 제거
      let newAttack = prev.attack;
      let newDefense = prev.defense;
      let newMaxHp = prev.maxHp;
      let newMaxMp = prev.maxMp;
      let newSpeed = prev.speed;

      if (currentEquippedItem) {
        if (currentEquippedItem.stats.attack)
          newAttack -= currentEquippedItem.stats.attack;
        if (currentEquippedItem.stats.defense)
          newDefense -= currentEquippedItem.stats.defense;
        if (currentEquippedItem.stats.hp)
          newMaxHp -= currentEquippedItem.stats.hp;
        if (currentEquippedItem.stats.mp)
          newMaxMp -= currentEquippedItem.stats.mp;
        if (currentEquippedItem.stats.speed)
          newSpeed -= currentEquippedItem.stats.speed;
      }

      // 새 아이템의 스탯 적용
      if (item.stats.attack) newAttack += item.stats.attack;
      if (item.stats.defense) newDefense += item.stats.defense;
      if (item.stats.hp) newMaxHp += item.stats.hp;
      if (item.stats.mp) newMaxMp += item.stats.mp;
      if (item.stats.speed) newSpeed += item.stats.speed;

      // 스탯이 최소값 이하로 내려가지 않도록 보정
      newAttack = Math.max(1, newAttack);
      newDefense = Math.max(0, newDefense);
      newMaxHp = Math.max(100, newMaxHp);
      newMaxMp = Math.max(50, newMaxMp);
      newSpeed = Math.max(1, newSpeed);

      return {
        ...prev,
        equipment: newEquipment,
        attack: newAttack,
        defense: newDefense,
        maxHp: newMaxHp,
        maxMp: newMaxMp,
        speed: newSpeed,
        hp: Math.min(prev.hp, newMaxHp), // 최대 체력이 줄어들 경우 현재 체력도 조정
        mp: Math.min(prev.mp, newMaxMp), // 최대 마나가 줄어들 경우 현재 마나도 조정
      };
    });

    // 기존에 장착된 아이템이 있었다면 인벤토리로 보내기
    if (currentEquippedItem) {
      setInventory((prev) => [...prev, currentEquippedItem]);
      addToCombatLog(
        `기존 ${currentEquippedItem.name}을 해제하고 ${item.name}을 장착했습니다!`
      );
    } else {
      addToCombatLog(`${item.name}을 장착했습니다!`);
    }

    // 인벤토리에서 새 아이템 제거
    setInventory((prev) => prev.filter((invItem) => invItem.id !== item.id));
  };

  // 장비 해제
  const unequipItem = (slot: keyof Equipment) => {
    const equippedItem = character.equipment[slot];
    if (!equippedItem) return;

    setCharacter((prev) => {
      const newEquipment = { ...prev.equipment };
      newEquipment[slot] = undefined;

      // 장착 해제한 아이템의 스탯 제거
      let newAttack = prev.attack;
      let newDefense = prev.defense;
      let newMaxHp = prev.maxHp;
      let newMaxMp = prev.maxMp;
      let newSpeed = prev.speed;

      if (equippedItem.stats.attack) newAttack -= equippedItem.stats.attack;
      if (equippedItem.stats.defense) newDefense -= equippedItem.stats.defense;
      if (equippedItem.stats.hp) newMaxHp -= equippedItem.stats.hp;
      if (equippedItem.stats.mp) newMaxMp -= equippedItem.stats.mp;
      if (equippedItem.stats.speed) newSpeed -= equippedItem.stats.speed;

      // HP가 maxHp를 초과하지 않도록 조정
      const adjustedHp = Math.min(prev.hp, newMaxHp);
      const adjustedMp = Math.min(prev.mp, newMaxMp);

      return {
        ...prev,
        equipment: newEquipment,
        attack: Math.max(1, newAttack), // 최소 공격력 1
        defense: Math.max(0, newDefense),
        maxHp: Math.max(100, newMaxHp), // 최소 체력 100
        maxMp: Math.max(50, newMaxMp), // 최소 마나 50
        speed: Math.max(1, newSpeed), // 최소 속도 1
        hp: adjustedHp,
        mp: adjustedMp,
      };
    });

    // 인벤토리에 아이템 추가
    setInventory((prev) => [...prev, equippedItem]);
    addToCombatLog(`${equippedItem.name}을 해제했습니다!`);
  };

  // 아이템 판매
  const sellItem = (item: Item) => {
    const sellPrice = Math.floor(item.price * 0.7);
    setCharacter((prev) => ({ ...prev, gold: prev.gold + sellPrice }));
    setInventory((prev) => prev.filter((invItem) => invItem.id !== item.id));
    addToCombatLog(`${item.name}을 ${sellPrice} 골드에 판매했습니다!`);
  };

  // 아이템 구매
  const buyItem = (item: Item) => {
    if (character.gold < item.price) return;

    setCharacter((prev) => ({ ...prev, gold: prev.gold - item.price }));
    setInventory((prev) => [
      ...prev,
      { ...item, id: `${item.id}_${Date.now()}` },
    ]);
    addToCombatLog(`${item.name}${t("rpg.combat.itemPurchased")}`);
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "#9ca3af",
      rare: "#3b82f6",
      epic: "#8b5cf6",
      legendary: "#f59e0b",
      mythic: "#ef4444",
    };
    return colors[rarity as keyof typeof colors] || "#9ca3af";
  };

  // 던전 입장 함수
  const enterDungeon = (dungeon: Dungeon) => {
    if (dungeon.isComingSoon) {
      addToCombatLog(t("rpg.combat.comingSoonDungeon"));
      return;
    }
    if (character.level < dungeon.requiredLevel) {
      addToCombatLog(
        `레벨 ${dungeon.requiredLevel} 이상이어야 입장 가능합니다.`
      );
      return;
    }
    setCurrentDungeon(dungeon);
    setInDungeon(true);
    setGameMode("dungeon");
    setCurrentTab("dungeon");
    spawnDungeonMonster(dungeon);

    // 이벤트 로깅
    onAction("dungeon_entered", {
      dungeon_id: dungeon.id,
      dungeon_name: dungeon.name,
      character_level: character.level,
      floor: dungeon.currentFloor,
      character_attack: character.attack,
      character_defense: character.defense,
      character_hp: character.hp,
      character_mp: character.mp,
      entry_time: new Date().getTime(),
    });
  };

  // 던전 몬스터 스폰
  const spawnDungeonMonster = (dungeon: Dungeon, forceSpawn = false) => {
    // 이미 몬스터가 있으면 새로 생성하지 않음 (강제 생성이 아닌 경우)
    if (currentMonster && !forceSpawn) return;

    // 강제 생성인 경우 기존 몬스터를 먼저 제거
    if (forceSpawn && currentMonster) {
      setCurrentMonster(null);
    }
    // 던전별 고유 몬스터 타입 정의
    const getDungeonMonsters = (dungeonId: string) => {
      switch (dungeonId) {
        case "forest": // 어둠의 숲
          return [
            { name: t("rpg.monsters.wolf"), baseHp: 40, baseAttack: 10, baseDefense: 3 },
            { name: t("rpg.monsters.bear"), baseHp: 80, baseAttack: 16, baseDefense: 6 },
            { name: t("rpg.monsters.giantSpider"), baseHp: 120, baseAttack: 22, baseDefense: 10 },
            {
              name: "숲의 수호자",
              baseHp: 200,
              baseAttack: 35,
              baseDefense: 18,
            },
            { name: "고대 엔트", baseHp: 350, baseAttack: 45, baseDefense: 25 },
          ];
        case "cave": // 고블린 동굴
          return [
            { name: t("rpg.monsters.goblinWarrior"), baseHp: 60, baseAttack: 14, baseDefense: 5 },
            { name: t("rpg.monsters.goblinArcher"), baseHp: 45, baseAttack: 18, baseDefense: 3 },
            {
              name: t("rpg.monsters.goblinMage"),
              baseHp: 50,
              baseAttack: 20,
              baseDefense: 4,
            },
            {
              name: t("rpg.monsters.goblinChief"),
              baseHp: 180,
              baseAttack: 30,
              baseDefense: 15,
            },
            { name: t("rpg.monsters.goblinKing"), baseHp: 400, baseAttack: 50, baseDefense: 28 },
          ];
        case "tower": // 마법사의 탑
          return [
            { name: t("rpg.monsters.magicGolem"), baseHp: 100, baseAttack: 20, baseDefense: 12 },
            {
              name: t("rpg.monsters.skeletonMage"),
              baseHp: 70,
              baseAttack: 25,
              baseDefense: 8,
            },
            {
              name: t("rpg.monsters.flameElemental"),
              baseHp: 110,
              baseAttack: 28,
              baseDefense: 10,
            },
            { name: t("rpg.monsters.lich"), baseHp: 250, baseAttack: 40, baseDefense: 20 },
            {
              name: t("rpg.monsters.ancientMage"),
              baseHp: 500,
              baseAttack: 60,
              baseDefense: 35,
            },
          ];
        default:
          return [
            { name: t("rpg.monsters.slime"), baseHp: 30, baseAttack: 8, baseDefense: 2 },
            { name: t("rpg.monsters.goblin"), baseHp: 50, baseAttack: 12, baseDefense: 4 },
            { name: t("rpg.monsters.orc"), baseHp: 100, baseAttack: 18, baseDefense: 8 },
            { name: t("rpg.monsters.troll"), baseHp: 150, baseAttack: 25, baseDefense: 12 },
            { name: t("rpg.monsters.dragon"), baseHp: 300, baseAttack: 40, baseDefense: 20 },
          ];
      }
    };

    const baseMonsters = getDungeonMonsters(dungeon.id);

    // 층수에 따른 점진적 몬스터 선택 로직
    const floorBasedMonsterIndex = () => {
      const currentFloor = dungeon.currentFloor;
      if (currentFloor <= 3) return 0; // 첫 번째 몬스터 (1~3층)
      if (currentFloor <= 7) return 1; // 두 번째 몬스터 (4~7층)
      if (currentFloor <= 12) return 2; // 세 번째 몬스터 (8~12층)
      if (currentFloor <= 18) return 3; // 네 번째 몬스터 (13~18층)
      return 4; // 다섯 번째 몬스터 (19층 이상)
    };

    // 층수 기반 기본 몬스터 + 약간의 랜덤성 추가
    const baseIndex = floorBasedMonsterIndex();
    const randomVariation = Math.random() < 0.3 && baseIndex > 0 ? -1 : 0; // 30% 확률로 한 단계 낮은 몬스터
    const selectedIndex = Math.max(0, baseIndex + randomVariation);

    const selectedMonster = baseMonsters[selectedIndex];
    const levelMultiplier =
      1 + (dungeon.level + dungeon.currentFloor - 1) * 0.2;

    const monster: Monster = {
      id: `dungeon_${dungeon.id}_${Date.now()}`,
      name: selectedMonster.name,
      level: dungeon.level + dungeon.currentFloor,
      hp: Math.floor(selectedMonster.baseHp * levelMultiplier),
      maxHp: Math.floor(selectedMonster.baseHp * levelMultiplier),
      attack: Math.floor(selectedMonster.baseAttack * levelMultiplier),
      defense: Math.floor(selectedMonster.baseDefense * levelMultiplier),
      speed: 10,
      exp: Math.floor(
        (20 + dungeon.level * 8 + dungeon.currentFloor * 3) * levelMultiplier
      ),
      gold: Math.floor((10 + dungeon.level * 3) * levelMultiplier),
      dropItems: generateDropItems(),
      isBoss: dungeon.currentFloor % 5 === 0,
    };

    if (monster.isBoss) {
      monster.name = `보스 ${monster.name}`;
      monster.hp *= 2;
      monster.maxHp *= 2;
      monster.attack *= 1.5;
      monster.exp *= 3;
      monster.gold *= 2;
    }

    setCurrentMonster(monster);
    addToCombatLog(`${monster.name} Lv.${monster.level}이 나타났다!`);
  };

  // 물약 사용 함수
  const consumeItem = (item: Item) => {
    if (item.type !== "consumable" || !item.consumableEffect) return;

    const effect = item.consumableEffect;

    // 체력 회복
    if (effect.healHp) {
      setCharacter((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + effect.healHp!),
      }));
      addToCombatLog(`${item.name}을 사용하여 HP ${effect.healHp} 회복!`);
    }

    // 마나 회복
    if (effect.healMp) {
      setCharacter((prev) => ({
        ...prev,
        mp: Math.min(prev.maxMp, prev.mp + effect.healMp!),
      }));
      addToCombatLog(`${item.name}을 사용하여 MP ${effect.healMp} 회복!`);
    }

    // 버프 효과
    if (effect.buffType && effect.buffAmount && effect.buffDuration) {
      setCharacter((prev) => ({
        ...prev,
        buffs: {
          ...prev.buffs,
          [effect.buffType!]: {
            amount: effect.buffAmount!,
            duration: effect.buffDuration!,
          },
        },
      }));
      addToCombatLog(
        `${item.name}을 사용하여 ${
          effect.buffType === "attack"
            ? "공격력"
            : effect.buffType === "defense"
            ? "방어력"
            : t("rpg.speed")
        } ${effect.buffAmount} 증가! (${effect.buffDuration / 1000}초)`
      );
    }

    // 인벤토리에서 물약 제거 또는 수량 감소
    setInventory((prev) => {
      const itemIndex = prev.findIndex((invItem) => invItem.id === item.id);
      if (itemIndex !== -1) {
        const newInventory = [...prev];
        const currentItem = newInventory[itemIndex];
        if (currentItem.quantity && currentItem.quantity > 1) {
          newInventory[itemIndex] = {
            ...currentItem,
            quantity: currentItem.quantity - 1,
          };
        } else {
          newInventory.splice(itemIndex, 1);
        }
        return newInventory;
      }
      return prev;
    });

    // 이벤트 로깅
    onAction("consumable_used", {
      item_name: item.name,
      item_type: item.type,
      character_level: character.level,
      heal_hp: effect.healHp || 0,
      heal_mp: effect.healMp || 0,
      buff_type: effect.buffType || "none",
      buff_amount: effect.buffAmount || 0,
      character_hp_before: character.hp,
      character_mp_before: character.mp,
      dungeon_name: currentDungeon?.name || null,
    });
  };

  // 스킬 사용 함수
  const castSkill = (skill: Skill) => {
    if (!skill.isLearned || skill.level === 0) {
      addToCombatLog(t("rpg.combat.skillLearnFirst"));
      return;
    }
    if (skill.currentCooldown > 0 || character.mp < skill.manaCost) return;

    // 스킬 사용 로직
    if (skill.id === "heal") {
      const healAmount = 30 + skill.level * 5;
      setCharacter((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount),
        mp: prev.mp - skill.manaCost,
      }));
      addToCombatLog(`${healAmount}만큼 회복했다!`);
    } else {
      // 공격 스킬
      if (currentMonster) {
        const damage = calculateSkillDamage(skill, character);
        const newMonsterHp = Math.max(0, currentMonster.hp - damage);
        setCurrentMonster((prev) =>
          prev ? { ...prev, hp: newMonsterHp } : null
        );
        setCharacter((prev) => ({ ...prev, mp: prev.mp - skill.manaCost }));
        addToCombatLog(`${skill.name}로 ${damage} 데미지!`);

        // 몬스터가 죽지 않았으면 반격
        if (newMonsterHp > 0) {
          setTimeout(() => {
            monsterAttack();
          }, 1000);
        } else {
          // 몬스터가 죽었으면 처치 처리
          setTimeout(() => {
            defeatMonster();
          }, 1500);
        }
      }
    }

    // 쿨다운 적용
    setCharacter((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.id === skill.id ? { ...s, currentCooldown: s.cooldown } : s
      ),
    }));

    // 이벤트 로깅
    onAction("skill_used", {
      skill_name: skill.name,
      skill_level: skill.level,
      mana_cost: skill.manaCost,
      character_level: character.level,
      character_mp_before: character.mp,
      character_mp_after: character.mp - skill.manaCost,
      dungeon_name: currentDungeon?.name || null,
    });
  };

  // 스탯 포인트 할당
  const allocateStat = (statName: keyof CharacterStats) => {
    if (character.stats.availablePoints <= 0) return;

    setCharacter((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statName]: prev.stats[statName] + 1,
        availablePoints: prev.stats.availablePoints - 1,
      },
    }));

    // 스탯에 따른 능력치 업데이트
    let hpBonus = 0,
      mpBonus = 0,
      attackBonus = 0,
      defenseBonus = 0;
    if (statName === "vitality") hpBonus = 5;
    if (statName === "intelligence") mpBonus = 3;
    if (statName === "strength") attackBonus = 2;
    if (statName === "agility") {
      attackBonus = 1;
      defenseBonus = 1;
    }

    setCharacter((prev) => ({
      ...prev,
      maxHp: prev.maxHp + hpBonus,
      hp: prev.hp + hpBonus,
      maxMp: prev.maxMp + mpBonus,
      mp: prev.mp + mpBonus,
      attack: prev.attack + attackBonus,
      defense: prev.defense + defenseBonus,
    }));

    // 이벤트 로깅
    onAction("stat_allocated", {
      stat_name: statName,
      stat_value: character.stats[statName] + 1,
      character_level: character.level,
      available_points: character.stats.availablePoints - 1,
    });
  };

  // 공통 캐릭터 정보 헤더 컴포넌트
  const renderCharacterHeader = () => {
    const expPercentage = (character.exp / character.maxExp) * 100;

    return (
      <div
        style={{
          background: gameColors.characterPanelBg,
          borderRadius: "15px",
          padding: "15px 20px",
          marginBottom: "20px",
          color: gameColors.primaryText,
        }}
      >
        {/* 기본 스탯 정보 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "15px",
            marginBottom: "15px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: gameColors.buttonText }}
            >
              Lv.{character.level}
            </div>
            <div style={{ color: gameColors.secondaryText, fontSize: "12px" }}>{t("rpg.ui.level")}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: gameColors.gold }}
            >
              {character.gold}G
            </div>
            <div style={{ color: gameColors.secondaryText, fontSize: "12px" }}>{t("rpg.ui.gold")}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "16px", fontWeight: "bold", color: gameColors.attack }}
            >
              {character.attack}
            </div>
            <div style={{ color: gameColors.secondaryText, fontSize: "12px" }}>{t("rpg.ui.attack")}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "16px", fontWeight: "bold", color: gameColors.defense }}
            >
              {character.defense}
            </div>
            <div style={{ color: gameColors.secondaryText, fontSize: "12px" }}>{t("rpg.ui.defense")}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "16px", fontWeight: "bold", color: gameColors.health }}
            >
              {character.hp}/{character.maxHp}
            </div>
            <div style={{ color: gameColors.secondaryText, fontSize: "12px" }}>{t("rpg.ui.health")}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "16px", fontWeight: "bold", color: gameColors.mana }}
            >
              {character.mp}/{character.maxMp}
            </div>
            <div style={{ color: gameColors.secondaryText, fontSize: "12px" }}>{t("rpg.ui.mana")}</div>
          </div>
        </div>

        {/* 경험치 바 */}
        <div style={{ marginTop: "15px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontSize: "14px", color: gameColors.secondaryText }}>{t("rpg.ui.exp")}</span>
            <span
              style={{ fontSize: "14px", color: gameColors.buttonText, fontWeight: "bold" }}
            >
              {character.exp} / {character.maxExp} ({Math.floor(expPercentage)}
              %)
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${expPercentage}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${gameColors.exp} 0%, ${gameColors.gold} 100%)`,
                borderRadius: "10px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // 로비 렌더링
  const renderLobbyTab = () => (
    <div style={{ padding: "20px", background: gameColors.mainBg, minHeight: "600px" }}>
      {/* 공통 캐릭터 헤더 */}
      {renderCharacterHeader()}

      {/* 던전 목록 */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ color: gameColors.primaryText, marginBottom: "15px", fontSize: "20px" }}>
          🏰 {t("rpg.ui.dungeonList")}
        </h3>
        <div style={{ display: "grid", gap: "15px" }}>
          {availableDungeons.map((dungeon) => (
            <div
              key={dungeon.id}
              style={{
                background: dungeon.isUnlocked ? gameColors.dungeonUnlockedBg : gameColors.dungeonLockedBg,
                borderRadius: "10px",
                padding: "20px",
                border: dungeon.isUnlocked
                  ? `2px solid ${gameColors.dungeonUnlockedBorder}`
                  : `2px solid ${gameColors.dungeonLockedBorder}`,
                opacity: dungeon.isUnlocked ? 1 : 0.6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4
                    style={{
                      color: gameColors.primaryText,
                      margin: "0 0 5px 0",
                      fontSize: "18px",
                    }}
                  >
                    {dungeon.name} (Lv.{dungeon.level})
                  </h4>
                  <p
                    style={{
                      color: gameColors.secondaryText,
                      margin: "0 0 10px 0",
                      fontSize: "14px",
                    }}
                  >
                    {dungeon.description}
                  </p>
                  <div style={{ fontSize: "12px", color: gameColors.secondaryText }}>
                    {t("rpg.ui.requiredLevel")}: {dungeon.requiredLevel} | {t("rpg.ui.floors")}: {dungeon.floors}
                    {t("rpg.floor")} | {t("rpg.ui.currentFloor")}: {t("rpg.floorDisplay").replace("{floor}", dungeon.currentFloor.toString())}
                  </div>
                </div>
                <button
                  onClick={() => enterDungeon(dungeon)}
                  disabled={
                    !dungeon.isUnlocked ||
                    character.level < dungeon.requiredLevel ||
                    dungeon.isComingSoon
                  }
                  style={{
                    background: dungeon.isComingSoon
                      ? "linear-gradient(135deg, #7c2d12 0%, #dc2626 100%)"
                      : dungeon.isUnlocked &&
                        character.level >= dungeon.requiredLevel
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                      : "#4b5563",
                    color: gameColors.primaryText,
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor:
                      dungeon.isUnlocked &&
                      character.level >= dungeon.requiredLevel &&
                      !dungeon.isComingSoon
                        ? "pointer"
                        : "not-allowed",
                    transition: "all 0.3s ease",
                  }}
                >
                  {dungeon.isComingSoon
                    ? t("rpg.ui.comingSoon")
                    : dungeon.isUnlocked &&
                      character.level >= dungeon.requiredLevel
                    ? t("rpg.ui.enter")
                    : t("rpg.ui.locked")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 던전 탭 렌더링
  const renderDungeonTab = () => {
    if (!inDungeon || !currentDungeon) {
      return (
        <div
          style={{
            padding: "100px 20px",
            textAlign: "center",
            background: gameColors.darkPanelBg,
            color: gameColors.secondaryText,
          }}
        >
          <h3>{t("rpg.dungeon.notEntered")}</h3>
          <p>{t("rpg.dungeon.selectFromLobby")}</p>
        </div>
      );
    }

    return (
      <div
        style={{ padding: "20px", background: gameColors.mainBg, minHeight: "600px" }}
      >
        {/* 공통 캐릭터 헤더 */}
        {renderCharacterHeader()}

        {/* 던전 정보 */}
        <div
          style={{
            background: gameColors.combatBg,
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "20px",
            color: gameColors.primaryText,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 5px 0", fontSize: "24px" }}>
                🏰 {currentDungeon.name}
              </h2>
              <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
                {t("rpg.floorDisplay").replace("{floor}", currentDungeon.currentFloor.toString())} / {t("rpg.floorDisplay").replace("{floor}", currentDungeon.floors.toString())}
              </p>
            </div>
            <button
              onClick={() => {
                // 던전 나가기 이벤트 로깅
                onAction("dungeon_exited", {
                  dungeon_id: currentDungeon.id,
                  dungeon_name: currentDungeon.name,
                  current_floor: currentDungeon.currentFloor,
                  total_floors: currentDungeon.floors,
                  character_level: character.level,
                  exit_reason: "manual",
                  time_spent: new Date().getTime(),
                });
                setInDungeon(false);
                setCurrentDungeon(null);
                setCurrentTab("lobby");
                setGameMode("lobby");
              }}
              style={{
                background: gameColors.panelBg,
                color: gameColors.primaryText,
                border: "none",
                borderRadius: "8px",
                padding: "10px 15px",
                cursor: "pointer",
              }}
            >
              {t("rpg.ui.exitDungeon")}
            </button>
          </div>

          {/* 층 진행 컨트롤 */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
              padding: "15px",
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            }}
          >
            <button
              onClick={() => {
                if (currentDungeon.currentFloor > 1) {
                  const updatedDungeon = {
                    ...currentDungeon,
                    currentFloor: currentDungeon.currentFloor - 1,
                  };
                  setCurrentDungeon(updatedDungeon);
                  setCurrentMonster(null);
                  addToCombatLog(
                    t("rpg.messages.movedToFloor").replace("{floor}", updatedDungeon.currentFloor.toString())
                  );
                  setTimeout(() => {
                    spawnDungeonMonster(updatedDungeon, true);
                  }, 1000);
                }
              }}
              disabled={currentDungeon.currentFloor <= 1}
              style={{
                background:
                  currentDungeon.currentFloor <= 1 ? "#6b7280" : "#3b82f6",
                color: gameColors.primaryText,
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor:
                  currentDungeon.currentFloor <= 1 ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
            >
              {t("rpg.previousFloor")}
            </button>

            <input
              type="number"
              min="1"
              max={currentDungeon.floors}
              value={currentDungeon.currentFloor}
              placeholder="층"
              onChange={(e) => {
                const targetFloor = parseInt(e.target.value);
                if (targetFloor >= 1 && targetFloor <= currentDungeon.floors) {
                  // Check if all previous floors are cleared
                  let canMoveTo = true;
                  for (let i = 1; i < targetFloor; i++) {
                    if (!currentDungeon.clearedFloors.has(i)) {
                      canMoveTo = false;
                      addToCombatLog(
                        t("rpg.messages.clearRequiredForFloor").replace("{requiredFloor}", i.toString()).replace("{targetFloor}", targetFloor.toString())
                      );
                      break;
                    }
                  }

                  if (canMoveTo) {
                    const updatedDungeon = {
                      ...currentDungeon,
                      currentFloor: targetFloor,
                    };
                    setCurrentDungeon(updatedDungeon);
                    setCurrentMonster(null);
                    addToCombatLog(t("rpg.messages.movedToFloor").replace("{floor}", targetFloor.toString()));
                    setTimeout(() => {
                      spawnDungeonMonster(updatedDungeon, true);
                    }, 1000);
                  }
                }
              }}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: gameColors.primaryText,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
                width: "80px",
              }}
            />

            <button
              onClick={() => {
                const nextFloor = currentDungeon.currentFloor + 1;
                const currentFloorCleared = currentDungeon.clearedFloors.has(
                  currentDungeon.currentFloor
                );

                if (
                  currentDungeon.currentFloor < currentDungeon.floors &&
                  currentFloorCleared
                ) {
                  const updatedDungeon = {
                    ...currentDungeon,
                    currentFloor: nextFloor,
                  };
                  setCurrentDungeon(updatedDungeon);
                  setCurrentMonster(null);
                  addToCombatLog(
                    t("rpg.messages.movedToFloor").replace("{floor}", updatedDungeon.currentFloor.toString())
                  );
                  setTimeout(() => {
                    spawnDungeonMonster(updatedDungeon, true);
                  }, 1000);
                } else if (!currentFloorCleared) {
                  addToCombatLog(
                    t("rpg.messages.killRequiredForNext")
                  );
                }
              }}
              disabled={
                currentDungeon.currentFloor >= currentDungeon.floors ||
                !currentDungeon.clearedFloors.has(currentDungeon.currentFloor)
              }
              style={{
                background:
                  currentDungeon.currentFloor >= currentDungeon.floors ||
                  !currentDungeon.clearedFloors.has(currentDungeon.currentFloor)
                    ? "#6b7280"
                    : "#10b981",
                color: gameColors.primaryText,
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor:
                  currentDungeon.currentFloor >= currentDungeon.floors ||
                  !currentDungeon.clearedFloors.has(currentDungeon.currentFloor)
                    ? "not-allowed"
                    : "pointer",
                fontSize: "14px",
              }}
            >
              {t("rpg.nextFloor")}
            </button>
          </div>
        </div>

        {/* 층 진행 상태 표시 */}
        {showDungeonChoice && (
          <div
            style={{
              background: gameColors.progressBg,
              borderRadius: "15px",
              padding: "20px",
              marginBottom: "20px",
              color: gameColors.primaryText,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {t("rpg.messages.movingToNext")}
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                height: "8px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: `linear-gradient(90deg, ${gameColors.uncommon}, ${gameColors.rare})`,
                  height: "100%",
                  width: "100%",
                  borderRadius: "10px",
                  animation: "progress 3s linear",
                }}
              />
            </div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>
              잠시만 기다려주세요...
            </div>
          </div>
        )}

        {/* 전투 영역 - 기존 renderCombatTab과 동일한 전투 시스템 */}
        {currentMonster && (
          <div
            style={{
              background: gameColors.panelBg,
              borderRadius: "15px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              {/* 캐릭터 */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    borderRadius: "50%",
                    margin: "0 auto 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                  }}
                >
                  ⚔️
                </div>
                <div style={{ color: gameColors.primaryText, marginBottom: "10px" }}>
                  {character.name} Lv.{character.level}
                </div>
                <div
                  style={{
                    background: gameColors.darkPanelBg,
                    borderRadius: "10px",
                    padding: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
                      height: "8px",
                      borderRadius: "4px",
                      width: `${(character.hp / character.maxHp) * 100}%`,
                    }}
                  />
                  <div
                    style={{
                      color: gameColors.primaryText,
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    HP: {character.hp}/{character.maxHp}
                  </div>
                </div>
              </div>

              {/* 몬스터 */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background:
                      "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                    borderRadius: "50%",
                    margin: "0 auto 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                  }}
                >
                  👹
                </div>
                <div style={{ color: gameColors.primaryText, marginBottom: "10px" }}>
                  {currentMonster.name} Lv.{currentMonster.level}
                  {currentMonster.isBoss && (
                    <span style={{ color: "#fbbf24" }}> 👑</span>
                  )}
                </div>
                <div
                  style={{
                    background: gameColors.darkPanelBg,
                    borderRadius: "10px",
                    padding: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
                      height: "8px",
                      borderRadius: "4px",
                      width: `${
                        (currentMonster.hp / currentMonster.maxHp) * 100
                      }%`,
                    }}
                  />
                  <div
                    style={{
                      color: gameColors.primaryText,
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    HP: {currentMonster.hp}/{currentMonster.maxHp}
                  </div>
                </div>
              </div>
            </div>

            {/* 전투 버튼들 */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={attack}
                disabled={character.hp <= 0}
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: gameColors.primaryText,
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: character.hp > 0 ? "pointer" : "not-allowed",
                  opacity: character.hp > 0 ? 1 : 0.5,
                }}
              >
                ⚔️ {t("rpg.ui.attackButton")}
              </button>
              <button
                onClick={() => setIsAutoFighting(!isAutoFighting)}
                style={{
                  background: isAutoFighting
                    ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: gameColors.primaryText,
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {isAutoFighting ? "⏸️ 자동 중지" : `▶️ ${t("rpg.ui.autoFight")}`}
              </button>
            </div>

            {/* 스킬 버튼들 */}
            {character.skills.filter(
              (skill) =>
                skill.type === "active" && skill.isLearned && skill.level > 0
            ).length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4
                  style={{
                    color: gameColors.primaryText,
                    marginBottom: "10px",
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                >
                  ✨ 스킬 사용 (MP: {character.mp}/{character.maxMp})
                </h4>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {character.skills
                    .filter(
                      (skill) =>
                        skill.type === "active" &&
                        skill.isLearned &&
                        skill.level > 0
                    )
                    .map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => castSkill(skill)}
                        disabled={
                          character.hp <= 0 ||
                          skill.currentCooldown > 0 ||
                          character.mp < skill.manaCost
                        }
                        style={{
                          background:
                            character.hp > 0 &&
                            skill.currentCooldown === 0 &&
                            character.mp >= skill.manaCost
                              ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                              : "#4b5563",
                          color: gameColors.primaryText,
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 16px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          cursor:
                            character.hp > 0 &&
                            skill.currentCooldown === 0 &&
                            character.mp >= skill.manaCost
                              ? "pointer"
                              : "not-allowed",
                          opacity:
                            character.hp > 0 &&
                            skill.currentCooldown === 0 &&
                            character.mp >= skill.manaCost
                              ? 1
                              : 0.6,
                          position: "relative",
                        }}
                        title={`${
                          skill.description
                        }\n대미지: ${calculateSkillDamage(
                          skill,
                          character
                        )} | 마나: ${skill.manaCost}`}
                      >
                        <div>{skill.name}</div>
                        <div style={{ fontSize: "10px", opacity: 0.8 }}>
                          MP: {skill.manaCost}
                          {skill.currentCooldown > 0 && (
                            <> | {(skill.currentCooldown / 1000).toFixed(1)}s</>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* 물약 버튼들 */}
            {inventory.filter((item) => item.type === "consumable").length >
              0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4
                  style={{
                    color: gameColors.primaryText,
                    marginBottom: "10px",
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                >
                  🧪 물약 사용
                </h4>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {inventory
                    .filter((item) => item.type === "consumable")
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => consumeItem(item)}
                        disabled={character.hp <= 0}
                        style={{
                          background:
                            character.hp > 0
                              ? `linear-gradient(135deg, ${getRarityColor(
                                  item.rarity
                                )} 0%, #374151 100%)`
                              : "#4b5563",
                          color: gameColors.primaryText,
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          cursor: character.hp > 0 ? "pointer" : "not-allowed",
                          opacity: character.hp > 0 ? 1 : 0.6,
                          position: "relative",
                        }}
                        title={`${item.name}\n${
                          item.consumableEffect?.healHp
                            ? `HP +${item.consumableEffect.healHp}`
                            : ""
                        }${
                          item.consumableEffect?.healMp
                            ? `MP +${item.consumableEffect.healMp}`
                            : ""
                        }${
                          item.consumableEffect?.buffType
                            ? `${item.consumableEffect.buffType} +${item.consumableEffect.buffAmount}`
                            : ""
                        }`}
                      >
                        <div>{item.name}</div>
                        <div style={{ fontSize: "10px", opacity: 0.8 }}>
                          {item.quantity && item.quantity > 1
                            ? `x${item.quantity}`
                            : ""}
                          {item.consumableEffect?.healHp &&
                            ` HP+${item.consumableEffect.healHp}`}
                          {item.consumableEffect?.healMp &&
                            ` MP+${item.consumableEffect.healMp}`}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* 전투 로그 */}
            <div
              style={{
                background: gameColors.darkPanelBg,
                borderRadius: "10px",
                padding: "15px",
                height: "200px",
                overflowY: "auto",
                fontSize: "14px",
              }}
            >
              <div
                style={{
                  color: gameColors.secondaryText,
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
{t("rpg.ui.combatLog")}:
              </div>
              {combatLog.slice(-10).map((log, index) => (
                <div
                  key={index}
                  style={{
                    color: gameColors.primaryText,
                    marginBottom: "5px",
                    lineHeight: "1.4",
                  }}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 캐릭터 탭 렌더링 (RPG 스타일 UI)
  const renderCharacterTab = () => (
    <div style={{ padding: "20px", background: gameColors.mainBg, minHeight: "600px" }}>
      {/* 공통 캐릭터 헤더 */}
      {renderCharacterHeader()}

      {/* 메인 캐릭터 창 - RPG 스타일 */}
      <div
        style={{
          background: gameColors.panelBg,
          border: `2px solid ${gameColors.border}`,
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          gap: "30px",
          minHeight: "500px",
        }}
      >
        {/* 좌측: 장비 슬롯 영역 */}
        <div style={{ flex: "0 0 300px" }}>
          <h3
            style={{
              color: gameColors.primaryText,
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            ⚔️ {t("rpg.stats.equipment")}
          </h3>

          {/* 장비 슬롯 그리드 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {/* 투구 */}
            {renderEquipmentSlot("helmet", "⛑️")}
            <div></div> {/* 빈 공간 */}
            <div></div> {/* 빈 공간 */}
            {/* 반지 */}
            {renderEquipmentSlot("ring", "💍")}
            {/* 갑옷 */}
            {renderEquipmentSlot("armor", "🛡️")}
            {/* 무기 */}
            {renderEquipmentSlot("weapon", "⚔️")}
            {/* 신발 */}
            {renderEquipmentSlot("boots", "👢")}
            {/* 목걸이 */}
            {renderEquipmentSlot("amulet", "📿")}
            <div></div> {/* 빈 공간 */}
          </div>
        </div>

        {/* 우측: 능력치 정보 영역 */}
        <div style={{ flex: "1" }}>
          {/* 사용 가능한 포인트 */}
          {character.stats.availablePoints > 0 && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.2)",
                border: "1px solid #10b981",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#10b981",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                사용 가능한 포인트: {character.stats.availablePoints}
              </div>
            </div>
          )}

          {/* 기본 능력치 */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid #475569",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            <h4
              style={{
                color: gameColors.primaryText,
                margin: "0 0 15px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              📊 {t("rpg.stats.baseStats")}
            </h4>

            {/* 능력치 리스트 */}
            {[
              {
                key: "strength",
                name: t("rpg.stats.strength"),
                icon: "💪",
                color: "#dc2626",
                bonus: character.stats.strength * 2,
                bonusType: t("rpg.character.attack"),
              },
              {
                key: "agility",
                name: t("rpg.stats.agility"),
                icon: "⚡",
                color: "#10b981",
                bonus: character.stats.agility,
                bonusType: t("rpg.speed"),
              },
              {
                key: "vitality",
                name: t("rpg.stats.vitality"),
                icon: "🛡️",
                color: "#3b82f6",
                bonus: character.stats.vitality * 10,
                bonusType: "HP",
              },
              {
                key: "intelligence",
                name: t("rpg.stats.intelligence"),
                icon: "🧠",
                color: "#7c3aed",
                bonus: character.stats.intelligence * 5,
                bonusType: "MP",
              },
            ].map((stat) => (
              <div
                key={stat.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(71, 85, 105, 0.3)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "16px" }}>{stat.icon}</span>
                  <span style={{ color: gameColors.primaryText, fontSize: "14px" }}>
                    {stat.name}
                  </span>
                  <span
                    style={{
                      color: stat.color,
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {character.stats[stat.key as keyof typeof character.stats]}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ color: stat.color, fontSize: "12px" }}>
                    +{stat.bonus} {stat.bonusType}
                  </span>
                  <button
                    onClick={() =>
                      allocateStat(stat.key as keyof CharacterStats)
                    }
                    disabled={character.stats.availablePoints <= 0}
                    style={{
                      background:
                        character.stats.availablePoints > 0
                          ? stat.color
                          : "#4b5563",
                      color: gameColors.primaryText,
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor:
                        character.stats.availablePoints > 0
                          ? "pointer"
                          : "not-allowed",
                      minWidth: "24px",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 전투 능력치 */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid #475569",
              borderRadius: "8px",
              padding: "15px",
            }}
          >
            <h4
              style={{
                color: gameColors.primaryText,
                margin: "0 0 15px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              ⚔️ {t("rpg.stats.combatStats")}
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#dc2626",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("rpg.character.attack")}
                </div>
                <div
                  style={{
                    color: gameColors.primaryText,
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {character.attack}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("rpg.stats.defense")}
                </div>
                <div
                  style={{
                    color: gameColors.primaryText,
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {character.defense}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("rpg.stats.vitality")}
                </div>
                <div style={{ color: gameColors.primaryText, fontSize: "16px" }}>
                  {character.hp} / {character.maxHp}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#8b5cf6",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("rpg.ui.mana")}
                </div>
                <div style={{ color: gameColors.primaryText, fontSize: "16px" }}>
                  {character.mp} / {character.maxMp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 장비 슬롯 렌더링 함수
  const renderEquipmentSlot = (slot: keyof Equipment, icon: string) => {
    const item = character.equipment[slot];
    const rarityColor =
      item?.rarity === "legendary"
        ? "#f59e0b"
        : item?.rarity === "epic"
        ? "#a855f7"
        : item?.rarity === "rare"
        ? "#3b82f6"
        : item?.rarity === "mythic"
        ? "#ef4444"
        : "#9ca3af";

    return (
      <div
        style={{
          width: "70px",
          height: "70px",
          background: item
            ? "rgba(16, 185, 129, 0.2)"
            : "rgba(71, 85, 105, 0.3)",
          border: item ? `2px solid ${rarityColor}` : "2px solid #475569",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: item ? "pointer" : "default",
        }}
      >
        {item ? (
          <>
            <div style={{ fontSize: "24px" }}>{icon}</div>
            <div
              style={{
                fontSize: "8px",
                color: rarityColor,
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: "1",
              }}
            >
              {item.name.length > 6
                ? item.name.substring(0, 6) + "..."
                : item.name}
            </div>
            <button
              onClick={() => unequipItem(slot)}
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: gameColors.mythic,
                color: gameColors.primaryText,
                border: "none",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                fontSize: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </>
        ) : (
          <div style={{ fontSize: "24px", opacity: 0.3 }}>{icon}</div>
        )}
      </div>
    );
  };

  // 인벤토리 탭 렌더링
  // 아이템 아이콘 맵핑
  const getItemIcon = (item: Item) => {
    const iconMap: { [key: string]: string } = {
      // 무기들
      "sword1": "⚔️",
      "steel_sword": "🗡️",
      "enchanted_sword": "✨",
      "dragon_sword": "🐉",
      "iron-sword": "⚔️",
      "steel-sword": "🗡️",
      "magic-sword": "⚡",
      "legendary-sword": "🔥",
      "dragon-slayer": "🐉",
      
      // 방어구들
      "armor1": "🦺",
      "plate_armor": "🛡️",
      "dragon_armor": "🐲",
      "leather-armor": "🛡️",
      "iron-armor": "⛨",
      "steel-armor": "🛡️",
      "magic-armor": "✨",
      
      // 투구들
      "helmet1": "⛑️",
      "steel_helmet": "🪖",
      "mystic_helmet": "👑",
      "iron-helmet": "⛑️",
      "steel-helmet": "👑",
      "magic-helmet": "💎",
      
      // 부츠들
      "boots1": "👢",
      "steel_boots": "🥾",
      "mystic_boots": "✨",
      "leather-boots": "👢",
      "iron-boots": "🥾",
      "magic-boots": "⚡",
      
      // 반지들
      "ring1": "💍",
      "power_ring": "💎",
      "mystic_ring": "🔮",
      "power-ring": "💍",
      "magic-ring": "💫",
      "health-ring": "❤️",
      "defense-ring": "🛡️",
      
      // 소모품들
      "health_potion": "❤️",
      "mana_potion": "💙",
      "greater_health_potion": "💖",
      "greater_mana_potion": "💎",
      "strength_potion": "💪",
      "defense_potion": "🛡️",
      "speed_potion": "💨",
      "health-potion": "🧪",
      "mana-potion": "💙",
      "strength-potion": "💪",
      
      // 타입별 기본 아이콘
      weapon: "⚔️",
      armor: "🛡️",
      helmet: "⛑️",
      boots: "👢",
      ring: "💍",
      consumable: "🧪",
    };
    
    // ID로 먼저 찾고, 없으면 타입으로 찾기
    return iconMap[item.id] || iconMap[item.type] || "📦";
  };

  // 선택된 아이템 상세 정보
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const renderInventoryTab = () => (
    <div style={{ padding: "20px", background: gameColors.mainBg, minHeight: "600px" }}>
      {/* 공통 캐릭터 헤더 */}
      {renderCharacterHeader()}

      <div style={{ display: "flex", gap: "20px" }}>
        {/* 인벤토리 그리드 */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: gameColors.primaryText, marginBottom: "15px" }}>
            📦 {t("rpg.inventory.items")} ({inventory.length}/50)
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: "4px",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "15px",
              borderRadius: "10px",
              border: "2px solid #4b5563",
            }}
          >
            {/* 인벤토리 슬롯 50개 */}
            {Array.from({ length: 50 }, (_, index) => {
              const item = inventory[index];
              const isEmpty = !item;

              return (
                <div
                  key={index}
                  onClick={() => item && setSelectedItem(item)}
                  style={{
                    width: "50px",
                    height: "50px",
                    background: isEmpty
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.1)",
                    border: isEmpty
                      ? "1px solid #374151"
                      : `2px solid ${getRarityColor(item.rarity)}`,
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: item ? "pointer" : "default",
                    position: "relative",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (item) {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = `0 0 15px ${getRarityColor(
                        item.rarity
                      )}50`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {item && (
                    <>
                      <div style={{ fontSize: "24px" }}>
                        {getItemIcon(item)}
                      </div>
                      {/* 수량 표시 (같은 아이템이 여러 개일 때) */}
                      {inventory.filter((inv) => inv.name === item.name)
                        .length > 1 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "2px",
                            right: "2px",
                            background: gameColors.darkPanelBg,
                            color: gameColors.primaryText,
                            fontSize: "10px",
                            padding: "1px 3px",
                            borderRadius: "3px",
                            lineHeight: "1",
                          }}
                        >
                          {
                            inventory.filter((inv) => inv.name === item.name)
                              .length
                          }
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 아이템 상세 정보 */}
        <div style={{ width: "300px" }}>
          <h3 style={{ color: gameColors.primaryText, marginBottom: "15px" }}>
            📋 {t("rpg.inventory.itemInfo")}
          </h3>
          {selectedItem ? (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: `2px solid ${getRarityColor(selectedItem.rarity)}`,
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                  {getItemIcon(selectedItem)}
                </div>
                <h4
                  style={{
                    color: getRarityColor(selectedItem.rarity),
                    margin: "0 0 5px 0",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {selectedItem.name}
                </h4>
                <p
                  style={{
                    color: gameColors.secondaryText,
                    margin: "0 0 15px 0",
                    fontSize: "14px",
                    textTransform: "capitalize",
                  }}
                >
                  {selectedItem.type} • {selectedItem.rarity}
                </p>
              </div>

              {/* 능력치 */}
              {selectedItem.stats &&
                Object.keys(selectedItem.stats).length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <h5
                      style={{
                        color: gameColors.primaryText,
                        margin: "0 0 10px 0",
                        fontSize: "14px",
                      }}
                    >
                      {t("rpg.item.stats")}
                    </h5>
                    {Object.entries(selectedItem.stats).map(([stat, value]) => (
                      <div
                        key={stat}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#10b981",
                          fontSize: "12px",
                          marginBottom: "5px",
                        }}
                      >
                        <span>
                          {stat === "attack"
                            ? "공격력"
                            : stat === "defense"
                            ? "방어력"
                            : stat === "hp"
                            ? "체력"
                            : stat === "mp"
                            ? t("rpg.ui.mana")
                            : stat}
                        </span>
                        <span>+{value}</span>
                      </div>
                    ))}
                  </div>
                )}

              {/* 가격 */}
              <div style={{ marginBottom: "15px" }}>
                <h5
                  style={{
                    color: gameColors.primaryText,
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                  }}
                >
                  {t("rpg.shop.price")}
                </h5>
                <p style={{ color: "#f59e0b", fontSize: "12px", margin: 0 }}>
                  {selectedItem.price.toLocaleString()}G
                </p>
              </div>

              {/* 액션 버튼 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {selectedItem.type !== "consumable" && (
                  <button
                    onClick={() => {
                      equipItem(selectedItem);
                      setSelectedItem(null);
                    }}
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: gameColors.primaryText,
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    장착
                  </button>
                )}
                {selectedItem.type === "consumable" && (
                  <button
                    onClick={() => {
                      // 사용 로직 (임시)
                      console.log("Use item:", selectedItem.name);
                      setSelectedItem(null);
                    }}
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      color: gameColors.primaryText,
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    사용
                  </button>
                )}
                <button
                  onClick={() => {
                    const sellPrice = Math.floor(selectedItem.price * 0.7);
                    setCharacter((prev) => ({
                      ...prev,
                      gold: prev.gold + sellPrice,
                    }));
                    setInventory((prev) =>
                      prev.filter((invItem) => invItem.id !== selectedItem.id)
                    );
                    addToCombatLog(
                      `${selectedItem.name}을 ${sellPrice} 골드에 판매했습니다!`
                    );
                    setSelectedItem(null);
                  }}
                  style={{
                    background: gameColors.mythic,
                    color: gameColors.primaryText,
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  판매 ({Math.floor(selectedItem.price * 0.7)}G)
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
                padding: "40px",
                textAlign: "center",
                color: gameColors.secondaryText,
              }}
            >
              <p>{t("rpg.inventory.clickForInfo")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 상점 카테고리 상태
  const [shopCategory, setShopCategory] = useState<"equipment" | "consumable">(
    "equipment"
  );
  const [selectedShopItem, setSelectedShopItem] = useState<Item | null>(null);

  const renderShopTab = () => (
    <div style={{ padding: "20px", background: gameColors.mainBg, minHeight: "600px" }}>
      {/* 공통 캐릭터 헤더 */}
      {renderCharacterHeader()}

      {/* 상점 카테고리 탭 */}
      <div
        style={{
          display: "flex",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          marginBottom: "20px",
          overflow: "hidden",
        }}
      >
        {[
          { id: "equipment", label: t("rpg.shop.equipment"), icon: "⚔️", color: "#10b981" },
          { id: "consumable", label: t("rpg.shop.consumable"), icon: "🧪", color: "#f59e0b" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setShopCategory(tab.id as any)}
            style={{
              flex: 1,
              padding: "15px 20px",
              background:
                shopCategory === tab.id
                  ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}AA 100%)`
                  : "transparent",
              color: shopCategory === tab.id ? "white" : gameColors.secondaryText,
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: shopCategory === tab.id ? "bold" : "normal",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* 좌측 아이템 그리드 */}
        <div style={{ flex: 1 }}>
          <h3
            style={{ color: gameColors.primaryText, marginBottom: "15px", fontSize: "16px" }}
          >
            {shopCategory === "equipment"
              ? `⚔️ ${t("rpg.shop.equipment")} ${t("rpg.shop")}`
              : `🧪 ${t("rpg.shop.consumable")} ${t("rpg.shop")}`}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "6px",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "15px",
              borderRadius: "10px",
              border: "2px solid #4b5563",
              minHeight: "400px",
            }}
          >
            {/* 상점 아이템 그리드 */}
            {Array.from({ length: 32 }, (_, index) => {
              let items: Item[] = [];

              if (shopCategory === "equipment") {
                // 장비 아이템 (무기, 방어구, 투구, 부츠, 반지)
                items = shop.filter(
                  (item) => item.type !== "consumable"
                );
              } else {
                // 소모품 아이템
                items = shop.filter(
                  (item) => item.type === "consumable"
                );
              }

              const item = items[index];
              const isEmpty = !item;
              const canAfford = character.gold >= (item?.price || 0);

              return (
                <div
                  key={index}
                  onClick={() => item && setSelectedShopItem(item)}
                  style={{
                    width: "50px",
                    height: "50px",
                    background: isEmpty
                      ? "rgba(255, 255, 255, 0.05)"
                      : canAfford
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(107, 114, 128, 0.1)",
                    border: isEmpty
                      ? "1px solid #374151"
                      : `2px solid ${getRarityColor(item.rarity)}`,
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: item ? "pointer" : "default",
                    position: "relative",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (item) {
                      e.currentTarget.style.transform = "scale(1.1)";
                      e.currentTarget.style.boxShadow = `0 0 15px ${getRarityColor(
                        item.rarity
                      )}50`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {item && (
                    <>
                      <div
                        style={{
                          fontSize: "20px",
                          opacity: canAfford ? 1 : 0.5,
                        }}
                      >
                        {getItemIcon(item)}
                      </div>
                      {/* 가격 표시 */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "2px",
                          right: "2px",
                          background: canAfford ? gameColors.uncommon : gameColors.mythic,
                          color: gameColors.primaryText,
                          fontSize: "8px",
                          padding: "1px 3px",
                          borderRadius: "3px",
                          lineHeight: "1",
                        }}
                      >
                        {item.price >= 1000
                          ? `${Math.floor(item.price / 1000)}K`
                          : item.price}G
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측 아이템 상세 정보 */}
        <div style={{ width: "300px" }}>
          <h3
            style={{ color: gameColors.primaryText, marginBottom: "15px", fontSize: "16px" }}
          >
            📋 {t("rpg.shop.itemInfo")}
          </h3>
          {selectedShopItem ? (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: `2px solid ${getRarityColor(selectedShopItem.rarity)}`,
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                  {getItemIcon(selectedShopItem)}
                </div>
                <h4
                  style={{
                    color: getRarityColor(selectedShopItem.rarity),
                    margin: "0 0 5px 0",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {selectedShopItem.name}
                </h4>
                <p
                  style={{
                    color: gameColors.secondaryText,
                    margin: "0 0 15px 0",
                    fontSize: "14px",
                    textTransform: "capitalize",
                  }}
                >
                  {selectedShopItem.type} • Lv.{selectedShopItem.level} •{" "}
                  {selectedShopItem.rarity}
                </p>
              </div>

              {/* 아이템 능력치 */}
              {selectedShopItem.stats &&
                Object.keys(selectedShopItem.stats).length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <h5
                      style={{
                        color: gameColors.primaryText,
                        margin: "0 0 10px 0",
                        fontSize: "14px",
                      }}
                    >
                      {t("rpg.item.stats")}
                    </h5>
                    {Object.entries(selectedShopItem.stats).map(
                      ([stat, value]) =>
                        value > 0 && (
                          <div
                            key={stat}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              color: "#10b981",
                              fontSize: "12px",
                              marginBottom: "5px",
                            }}
                          >
                            <span>
                              {stat === "attack"
                                ? t("rpg.attackWithIcon")
                                : stat === "defense"
                                ? t("rpg.defenseWithIcon")
                                : stat === "hp"
                                ? t("rpg.healthWithIcon")
                                : stat === "mp"
                                ? t("rpg.manaWithIcon")
                                : stat === "speed"
                                ? `💨 ${t("rpg.speed")}`
                                : stat === "critRate"
                                ? "💥 크리티컬"
                                : stat}
                            </span>
                            <span>+{value}</span>
                          </div>
                        )
                    )}
                  </div>
                )}

              {/* 가격 정보 */}
              <div style={{ marginBottom: "15px" }}>
                <h5
                  style={{
                    color: gameColors.primaryText,
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                  }}
                >
                  {t("rpg.shop.price")}
                </h5>
                <p
                  style={{
                    color: "#f59e0b",
                    fontSize: "14px",
                    margin: 0,
                    fontWeight: "bold",
                  }}
                >
                  {selectedShopItem.price.toLocaleString()}{t("rpg.item.gold")}
                </p>
              </div>

              {/* 액션 버튼 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => {
                    buyItem(selectedShopItem);
                    setSelectedShopItem(null);
                  }}
                  disabled={character.gold < selectedShopItem.price}
                  style={{
                    background:
                      character.gold >= selectedShopItem.price
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : "#6b7280",
                    color: gameColors.primaryText,
                    border: "none",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "14px",
                    cursor:
                      character.gold >= selectedShopItem.price
                        ? "pointer"
                        : "not-allowed",
                    fontWeight: "bold",
                  }}
                >
                  {t("rpg.shop.buy")} ({selectedShopItem.price.toLocaleString()}G)
                </button>

              </div>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
                padding: "40px",
                textAlign: "center",
                color: gameColors.secondaryText,
              }}
            >
              <p>{t("rpg.item.clickForInfo")}</p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 골드 정보 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          marginTop: "20px",
          border: "2px solid #4b5563",
        }}
      >
        <div>
          <div style={{ fontSize: "14px", opacity: 0.9, color: "white" }}>
            {t("rpg.item.ownedGold")}
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#f59e0b",
            }}
          >
            {character.gold.toLocaleString()}G
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", opacity: 0.8, color: gameColors.secondaryText }}>
            {shopCategory === "equipment"
              ? t("rpg.shop.equipment.description")
              : t("rpg.shop.consumables.description")}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div
      style={{
        background: gameColors.panelBg,
        display: "flex",
        borderRadius: "15px 15px 0 0",
        overflow: "hidden",
      }}
    >
      {[
        { id: "lobby", name: t("rpg.tabs.lobby"), icon: "🏠" },
        { id: "character", name: t("rpg.tabs.character"), icon: "👤" },
        { id: "inventory", name: t("rpg.tabs.inventory"), icon: "🎒" },
        { id: "skills", name: t("rpg.tabs.skills"), icon: "✨" },
        { id: "dungeon", name: t("rpg.tabs.dungeon"), icon: "🏰" },
        { id: "shop", name: t("rpg.tabs.shop"), icon: "🛒" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id as any)}
          style={{
            background: currentTab === tab.id ? colors.accent : "transparent",
            color: colors.text,
            border: "none",
            padding: "15px 20px",
            fontSize: "14px",
            cursor: "pointer",
            flex: 1,
            transition: "all 0.3s ease",
          }}
        >
          <div>{tab.icon}</div>
          <div style={{ fontSize: "12px", marginTop: "5px" }}>{tab.name}</div>
        </button>
      ))}
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        background: colors.cardBg,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        border: `1px solid ${colors.cardBorder}`,
      }}
    >
      {/* 게임 타이틀 */}
      <div
        style={{
          background: colors.backgroundSecondary,
          padding: "20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 70%)",
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "bold",
            color: colors.text,
            textShadow: "0 4px 20px rgba(147, 51, 234, 0.5)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {t("rpg.title")}
        </h1>
        <p
          style={{
            margin: "10px 0 0 0",
            color: colors.textSecondary,
            fontSize: "16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {t("rpg.subtitle")}
        </p>
      </div>

      {/* 탭 메뉴 */}
      {renderTabs()}

      {/* 현재 탭 컨텐츠 */}
      {currentTab === "lobby" && renderLobbyTab()}
      {currentTab === "dungeon" && renderDungeonTab()}
      {currentTab === "character" && renderCharacterTab()}
      {currentTab === "inventory" && renderInventoryTab()}
      {currentTab === "skills" && renderSkillsTab()}
      {currentTab === "shop" && renderShopTab()}
    </div>
  );
};
