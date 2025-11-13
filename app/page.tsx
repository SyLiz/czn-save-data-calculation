'use client';

import { useState } from 'react';
import NumberInput from './components/NumberInput';

interface CombatantData {
  neutralCards: number;
  monsterCards: number;
  commonEpiphanies: number;
  divineEpiphanies: number;
  cardRemovals: number;
  characterCardRemovals: number;
  cardDuplications: number;
  cardConversions: number;
}

const initialCombatantData: CombatantData = {
  neutralCards: 0,
  monsterCards: 0,
  commonEpiphanies: 0,
  divineEpiphanies: 0,
  cardRemovals: 0,
  characterCardRemovals: 0,
  cardDuplications: 0,
  cardConversions: 0,
};

export default function Home() {
  const [saveDataTier, setSaveDataTier] = useState<number>(1);
  const [numCombatants, setNumCombatants] = useState<number>(1);
  const [combatants, setCombatants] = useState<CombatantData[]>([
    { ...initialCombatantData },
    { ...initialCombatantData },
    { ...initialCombatantData },
  ]);
  const [expandedCombatants, setExpandedCombatants] = useState<boolean[]>([true, false, false]);

  // Update combatant data
  const updateCombatant = (index: number, field: keyof CombatantData, value: number) => {
    const newCombatants = [...combatants];
    newCombatants[index] = { ...newCombatants[index], [field]: value };
    setCombatants(newCombatants);
  };

  // Toggle combatant expansion
  const toggleCombatant = (index: number) => {
    const newExpanded = [...expandedCombatants];
    newExpanded[index] = !newExpanded[index];
    setExpandedCombatants(newExpanded);
  };

  // Calculate point limit based on tier
  const calculatePointLimit = () => {
    return 30 + 10 * (saveDataTier - 1);
  };

  // Calculate removal cost
  const calculateRemovalCost = (count: number) => {
    const costs = [0, 10, 30, 50, 70];
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += costs[Math.min(i, costs.length - 1)];
    }
    return total;
  };

  // Calculate duplication cost
  const calculateDuplicationCost = (count: number) => {
    const costs = [0, 10, 30, 50, 70];
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += costs[Math.min(i, costs.length - 1)];
    }
    return total;
  };

  // Calculate points for a single combatant
  const calculateCombatantPoints = (combatant: CombatantData) => {
    let total = 0;
    total += combatant.neutralCards * 20;
    total += combatant.monsterCards * 80;
    total += combatant.commonEpiphanies * 10;
    total += combatant.divineEpiphanies * 20;
    total += calculateRemovalCost(combatant.cardRemovals);
    total += combatant.characterCardRemovals * 20;
    total += calculateDuplicationCost(combatant.cardDuplications);
    total += combatant.cardConversions * 10;
    return total;
  };

  // Calculate total faint memory points for all active combatants
  const calculateTotalPoints = () => {
    let total = 0;
    for (let i = 0; i < numCombatants; i++) {
      total += calculateCombatantPoints(combatants[i]);
    }
    return total;
  };

  const pointLimit = calculatePointLimit();
  const totalPoints = calculateTotalPoints();
  const isOverLimit = totalPoints > pointLimit;

  const resetAll = () => {
    setSaveDataTier(1);
    setNumCombatants(1);
    setCombatants([
      { ...initialCombatantData },
      { ...initialCombatantData },
      { ...initialCombatantData },
    ]);
    setExpandedCombatants([true, false, false]);
  };

  return (
    <div className="min-h-screen gradient-gaming-radial">
      {/* Header */}
      <header className="border-b border-[#2a2a3e] bg-[#0a0a0f]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-gaming flex items-center justify-center">
                <span className="text-2xl">💾</span>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-[var(--foreground-secondary)] mb-1">
                  Chaos Zero Nightmare
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-glow-cyan" style={{ color: 'var(--accent-cyan)' }}>
                  Save Data Calculator
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
        
        {/* Results Card - Top */}
        <div className={`gaming-card rounded-xl p-6 mb-6 ${isOverLimit ? 'border-2' : ''}`}
             style={isOverLimit ? { borderColor: 'var(--error)' } : {}}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-[var(--foreground-secondary)] mb-1">Point Limit (Tier {saveDataTier})</div>
              <div className="text-4xl font-bold" style={{ color: 'var(--accent-cyan)' }}>
                {pointLimit}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-[var(--foreground-secondary)] mb-1">Faint Memory Points</div>
              <div className={`text-4xl font-bold ${isOverLimit ? 'text-glow-pink' : 'text-glow-purple'}`}
                   style={{ color: isOverLimit ? 'var(--error)' : 'var(--accent-purple)' }}>
                {totalPoints}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-[var(--foreground-secondary)] mb-1">Remaining</div>
              <div className={`text-4xl font-bold ${isOverLimit ? 'text-glow-pink' : ''}`}
                   style={{ color: isOverLimit ? 'var(--error)' : 'var(--accent-green)' }}>
                {pointLimit - totalPoints}
              </div>
            </div>
          </div>
          {isOverLimit && (
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 0, 85, 0.1)', border: '1px solid var(--error)' }}>
              <p className="text-center text-sm" style={{ color: 'var(--error)' }}>
                ⚠️ Over limit! Random Faint Memory additions will be reverted until under the cap.
              </p>
            </div>
          )}
        </div>

        {/* Global Settings */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Tier Input */}
          <div className="gaming-card rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--accent-cyan)' }}>
              📊 Save Data Tier
            </h3>
            <div className="space-y-3">
              <label className="block text-sm text-[var(--foreground-secondary)]">
                Tier (Difficulty + Nightmare + Codex modifiers)
              </label>
              <NumberInput
                value={saveDataTier}
                onChange={setSaveDataTier}
                min={1}
                max={99}
                large={true}
              />
              <p className="text-xs text-[var(--foreground-secondary)]">
                Formula: 30 + 10(x-1) = <span style={{ color: 'var(--accent-cyan)' }}>{pointLimit} points</span>
              </p>
            </div>
          </div>

          {/* Number of Combatants */}
          <div className="gaming-card rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--accent-purple)' }}>
              👥 Number of Combatants
            </h3>
            <div className="space-y-3">
              <label className="block text-sm text-[var(--foreground-secondary)]">
                Select number of combatants (1-3)
              </label>
              <NumberInput
                value={numCombatants}
                onChange={setNumCombatants}
                min={1}
                max={3}
                large={true}
              />
              <p className="text-xs text-[var(--foreground-secondary)]">
                Each combatant has their own card data
              </p>
            </div>
          </div>
        </div>

        {/* Combatants */}
        <div className="space-y-4">
          {Array.from({ length: numCombatants }).map((_, index) => {
            const combatant = combatants[index];
            const isExpanded = expandedCombatants[index];
            const combatantPoints = calculateCombatantPoints(combatant);
            
            return (
              <div key={index} className="gaming-card rounded-xl overflow-hidden">
                {/* Combatant Header */}
                <button
                  onClick={() => toggleCombatant(index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-[var(--card-hover)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                         style={{ backgroundColor: 'rgba(157, 78, 221, 0.2)', border: '1px solid var(--accent-purple)' }}>
                      {index === 0 ? '⚔️' : index === 1 ? '🛡️' : '🏹'}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold" style={{ color: 'var(--accent-purple)' }}>
                        Combatant {index + 1}
                      </h3>
                      <p className="text-sm text-[var(--foreground-secondary)]">
                        Points: <span style={{ color: 'var(--accent-cyan)' }}>{combatantPoints}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </div>
                </button>

                {/* Combatant Content */}
                {isExpanded && (
                  <div className="border-t border-[var(--border)] p-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Cards Section */}
                        <div>
                          <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-purple)' }}>
                            🃏 Common Cards
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                                Neutral Cards (+20 each)
                              </label>
                              <NumberInput
                                value={combatant.neutralCards}
                                onChange={(val) => updateCombatant(index, 'neutralCards', val)}
                                min={0}
                                max={999}
                              />
                              <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                                Points: <span style={{ color: 'var(--accent-cyan)' }}>{combatant.neutralCards * 20}</span>
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                                Monster Cards (+80 each)
                              </label>
                              <NumberInput
                                value={combatant.monsterCards}
                                onChange={(val) => updateCombatant(index, 'monsterCards', val)}
                                min={0}
                                max={999}
                              />
                              <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                                Points: <span style={{ color: 'var(--accent-cyan)' }}>{combatant.monsterCards * 80}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Epiphanies Section */}
                        <div>
                          <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-pink)' }}>
                            ✨ Epiphanies
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                                Common Card Epiphanies (+10 each)
                              </label>
                              <NumberInput
                                value={combatant.commonEpiphanies}
                                onChange={(val) => updateCombatant(index, 'commonEpiphanies', val)}
                                min={0}
                                max={999}
                              />
                              <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                                Points: <span style={{ color: 'var(--accent-cyan)' }}>{combatant.commonEpiphanies * 10}</span>
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                                Divine Epiphanies (+20 each)
                              </label>
                              <NumberInput
                                value={combatant.divineEpiphanies}
                                onChange={(val) => updateCombatant(index, 'divineEpiphanies', val)}
                                min={0}
                                max={999}
                              />
                              <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                                Points: <span style={{ color: 'var(--accent-cyan)' }}>{combatant.divineEpiphanies * 20}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* Card Removals */}
                        <div>
                          <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-green)' }}>
                            🗑️ Card Removals
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                                Common Card Removals (0/10/30/50/70)
                              </label>
                              <NumberInput
                                value={combatant.cardRemovals}
                                onChange={(val) => updateCombatant(index, 'cardRemovals', val)}
                                min={0}
                                max={999}
                              />
                              <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                                Points: <span style={{ color: 'var(--accent-cyan)' }}>{calculateRemovalCost(combatant.cardRemovals)}</span>
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                                Character Card Removals (+20 each)
                              </label>
                              <NumberInput
                                value={combatant.characterCardRemovals}
                                onChange={(val) => updateCombatant(index, 'characterCardRemovals', val)}
                                min={0}
                                max={999}
                              />
                              <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                                Points: <span style={{ color: 'var(--accent-cyan)' }}>{combatant.characterCardRemovals * 20}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Duplications */}
                        <div>
                          <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-orange)' }}>
                            📑 Card Duplications
                          </h4>
                          <div>
                            <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                              Number of Duplications (0/10/30/50/70)
                            </label>
                            <NumberInput
                              value={combatant.cardDuplications}
                              onChange={(val) => updateCombatant(index, 'cardDuplications', val)}
                              min={0}
                              max={999}
                            />
                            <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                              Points: <span style={{ color: 'var(--accent-cyan)' }}>{calculateDuplicationCost(combatant.cardDuplications)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Card Conversions */}
                        <div>
                          <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-purple)' }}>
                            🔄 Card Conversions
                          </h4>
                          <div>
                            <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                              Number of Conversions (+10 each)
                            </label>
                            <NumberInput
                              value={combatant.cardConversions}
                              onChange={(val) => updateCombatant(index, 'cardConversions', val)}
                              min={0}
                              max={999}
                            />
                            <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                              Points: <span style={{ color: 'var(--accent-cyan)' }}>{combatant.cardConversions * 10}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reset Button */}
        <div className="mt-6">
          <button
            onClick={resetAll}
            className="w-full btn-secondary"
          >
            🔄 Reset All
          </button>
        </div>

        {/* Info Section */}
        <div className="gaming-card rounded-xl p-6 mt-6">
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-cyan)' }}>
            ℹ️ Save Data Rules
          </h3>
          <div className="space-y-2 text-sm text-[var(--foreground-secondary)]">
            <p><strong style={{ color: 'var(--accent-green)' }}>Vivid Memories (Always Saved):</strong> Equipment, character card epiphanies, and Unique cards</p>
            <p><strong style={{ color: 'var(--accent-purple)' }}>Faint Memories (May Not Save):</strong> Common cards, their epiphanies, Divine epiphanies, and card operations</p>
            <p><strong style={{ color: 'var(--accent-pink)' }}>Note:</strong> If point limit is exceeded, Faint Memory additions are reverted at random until under the cap</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a3e] mt-8">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="text-center text-[var(--foreground-secondary)] text-sm">
            <p className="mb-1"><strong style={{ color: 'var(--accent-cyan)' }}>Chaos Zero Nightmare</strong> - Save Data Calculator</p>
            <p>Calculate your Faint Memory points</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
