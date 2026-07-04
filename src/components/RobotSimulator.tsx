/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Plus, Trash2, ArrowUp, ArrowLeft, ArrowRight, Zap, Trophy, Cpu, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, TRANSLATIONS } from '../translations';

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

interface Position {
  x: number;
  y: number;
}

interface Command {
  id: string;
  type: 'FORWARD' | 'LEFT' | 'RIGHT' | 'ACTIVATE';
  label: string;
  icon: React.ReactNode;
  color: string;
}

export default function RobotSimulator({ lang }: { lang: Language }) {
  const [commands, setCommands] = useState<Command[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [robotPos, setRobotPos] = useState<Position>({ x: 0, y: 3 });
  const [robotDir, setRobotDir] = useState<Direction>('RIGHT');
  const [energyCollected, setEnergyCollected] = useState<Position[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'success' | 'failed' | 'running'>('idle');
  
  const t = TRANSLATIONS[lang];
  const [gameMessage, setGameMessage] = useState<string>(t.simIntro);

  // Sync game message when language toggles on idle/reset
  useEffect(() => {
    if (gameState === 'idle') {
      setGameMessage(t.simIntro);
    } else if (gameState === 'success') {
      setGameMessage(t.simStatusSuccess);
    } else if (gameState === 'failed') {
      // Keep message or reset
      setGameMessage(t.simStatusReset);
    }
  }, [lang, gameState]);

  // Map elements
  const GRID_SIZE = 5;
  const OBSTACLES: Position[] = [
    { x: 1, y: 1 },
    { x: 2, y: 3 },
    { x: 3, y: 0 },
    { x: 3, y: 2 },
  ];
  const ENERGIES: Position[] = [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 4, y: 3 },
  ];
  const MAINFRAME: Position = { x: 4, y: 0 };

  const COMMAND_TEMPLATES: Omit<Command, 'id'>[] = [
    { type: 'FORWARD', label: `${t.simCmdForward} (${t.simCmdForwardSub})`, icon: <ArrowUp className="w-4 h-4" />, color: 'bg-sky-500 hover:bg-sky-600 text-white' },
    { type: 'LEFT', label: `${t.simCmdLeft} (${t.simCmdLeftSub})`, icon: <ArrowLeft className="w-4 h-4" />, color: 'bg-amber-500 hover:bg-amber-600 text-white' },
    { type: 'RIGHT', label: `${t.simCmdRight} (${t.simCmdRightSub})`, icon: <ArrowRight className="w-4 h-4" />, color: 'bg-violet-500 hover:bg-violet-600 text-white' },
    { type: 'ACTIVATE', label: `${t.simCmdActivate} (${t.simCmdActivateSub})`, icon: <Zap className="w-4 h-4" />, color: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
  ];

  const addCommand = (template: Omit<Command, 'id'>) => {
    if (isRunning) return;
    const newCmd: Command = {
      ...template,
      id: Math.random().toString(36).substring(2, 9),
    } as Command;
    setCommands([...commands, newCmd]);
  };

  const removeCommand = (id: string) => {
    if (isRunning) return;
    setCommands(commands.filter(c => c.id !== id));
  };

  const clearCommands = () => {
    if (isRunning) return;
    setCommands([]);
    resetSimulator();
  };

  const resetSimulator = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setRobotPos({ x: 0, y: 3 });
    setRobotDir('RIGHT');
    setEnergyCollected([]);
    setGameState('idle');
    setGameMessage(t.simStatusReset);
  };

  const runProgram = async () => {
    if (commands.length === 0) {
      setGameMessage(t.simStatusNoCmd);
      return;
    }
    if (isRunning) return;

    setIsRunning(true);
    setGameState('running');
    setGameMessage(t.simStatusRunning);

    // Initialize state
    let curX = 0;
    let curY = 3;
    let curDir: Direction = 'RIGHT';
    let collected: Position[] = [];

    setRobotPos({ x: curX, y: curY });
    setRobotDir(curDir);
    setEnergyCollected([]);

    for (let i = 0; i < commands.length; i++) {
      setCurrentStep(i);
      const cmd = commands[i];

      // Delay for execution visualization
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (cmd.type === 'FORWARD') {
        // Move in current direction
        let nextX = curX;
        let nextY = curY;
        if (curDir === 'UP') nextY -= 1;
        else if (curDir === 'RIGHT') nextX += 1;
        else if (curDir === 'DOWN') nextY += 1;
        else if (curDir === 'LEFT') nextX -= 1;

        // Check boundary
        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
          setGameState('failed');
          setGameMessage(t.simStatusWallCrash);
          setIsRunning(false);
          return;
        }

        // Check obstacles
        if (OBSTACLES.some(obs => obs.x === nextX && obs.y === nextY)) {
          setGameState('failed');
          setGameMessage(t.simStatusObstacleCrash);
          setIsRunning(false);
          return;
        }

        curX = nextX;
        curY = nextY;
        setRobotPos({ x: curX, y: curY });
      } else if (cmd.type === 'LEFT') {
        // Turn Left
        const dirs: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        const curIdx = dirs.indexOf(curDir);
        curDir = dirs[(curIdx + 3) % 4]; // -1 index
        setRobotDir(curDir);
      } else if (cmd.type === 'RIGHT') {
        // Turn Right
        const dirs: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        const curIdx = dirs.indexOf(curDir);
        curDir = dirs[(curIdx + 1) % 4]; // +1 index
        setRobotDir(curDir);
      } else if (cmd.type === 'ACTIVATE') {
        // Check if on energy tile
        const hasEnergy = ENERGIES.some(
          eng => eng.x === curX && eng.y === curY && !collected.some(c => c.x === curX && c.y === curY)
        );
        if (hasEnergy) {
          collected = [...collected, { x: curX, y: curY }];
          setEnergyCollected(collected);
          setGameMessage(t.simEnergyChargedSuccess.replace('{count}', collected.length.toString()));
        } else {
          setGameMessage(t.simEnergyChargedFail);
        }
      }
    }

    // Wait short delay after last command
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Finish executing: check if at mainframe and collected all 3 energies
    if (curX === MAINFRAME.x && curY === MAINFRAME.y) {
      if (collected.length === ENERGIES.length) {
        setGameState('success');
        setGameMessage(t.simStatusSuccess);
      } else {
        setGameState('failed');
        setGameMessage(t.simStatusMissingEnergy.replace('{collected}', collected.length.toString()));
      }
    } else {
      setGameState('failed');
      setGameMessage(t.simStatusNotReached);
    }
    setIsRunning(false);
    setCurrentStep(-1);
  };

  // Get rotation degrees for robot arrow
  const getRotationAngle = (dir: Direction) => {
    switch (dir) {
      case 'UP': return -90;
      case 'RIGHT': return 0;
      case 'DOWN': return 90;
      case 'LEFT': return 180;
    }
  };

  return (
    <div id="robot-sim-container" className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col lg:flex-row gap-8">
      {/* Simulation Grid */}
      <div className="flex-1 flex flex-col items-center">
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" /> {t.simSub}
          </span>
          <h3 className="text-xl font-bold text-slate-800 font-display">{t.simTitle}</h3>
        </div>

        {/* Maze Grid */}
        <div className="relative w-full max-w-[340px] aspect-square bg-slate-100 border-4 border-slate-200 rounded-2xl p-1 grid grid-cols-5 grid-rows-5 gap-1.5">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);

            const isStart = x === 0 && y === 3;
            const isObstacle = OBSTACLES.some(obs => obs.x === x && obs.y === y);
            const isEnergy = ENERGIES.some(eng => eng.x === x && eng.y === y);
            const isEnergyCollected = energyCollected.some(eng => eng.x === x && eng.y === y);
            const isMainframe = MAINFRAME.x === x && MAINFRAME.y === y;
            const isRobot = robotPos.x === x && robotPos.y === y;

            return (
              <div
                key={idx}
                id={`grid-cell-${x}-${y}`}
                className={`relative flex items-center justify-center rounded-lg transition-all duration-300 ${
                  isObstacle
                    ? 'bg-slate-300 border border-slate-400 shadow-inner'
                    : isMainframe
                    ? 'bg-emerald-50 border-2 border-dashed border-emerald-400 shadow-sm'
                    : isStart
                    ? 'bg-sky-50/60 border border-sky-200'
                    : 'bg-white border border-slate-200/60'
                }`}
              >
                {/* Visual Indicators */}
                {isObstacle && (
                  <span className="text-xl select-none" title="障碍物">🪨</span>
                )}

                {isMainframe && !isRobot && (
                  <div className="flex flex-col items-center animate-pulse">
                    <span className="text-xl">💻</span>
                    <span className="text-[9px] text-emerald-600 font-bold font-sans">{t.simGridEnd}</span>
                  </div>
                )}

                {isEnergy && !isRobot && (
                  <motion.div
                    animate={isEnergyCollected ? { scale: 0, opacity: 0 } : { y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className={`flex items-center justify-center ${isEnergyCollected ? 'opacity-20' : ''}`}
                  >
                    <span className="text-xl text-yellow-400 filter drop-shadow">⚡</span>
                  </motion.div>
                )}

                {isStart && !isRobot && !isObstacle && (
                  <span className="text-[9px] text-sky-400 font-semibold uppercase absolute bottom-0.5">{t.simGridStart}</span>
                )}

                {/* Robot Agent */}
                {isRobot && (
                  <motion.div
                    layoutId="robot-avatar"
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                    className="z-10 w-11 h-11 bg-indigo-600 rounded-xl shadow-lg border-2 border-white flex flex-col items-center justify-center relative"
                  >
                    <span className="text-xl">🤖</span>
                    {/* Direction Arrow */}
                    <div
                      style={{ transform: `rotate(${getRotationAngle(robotDir)}deg)` }}
                      className="absolute -bottom-1 bg-pink-500 text-white rounded-full p-0.5 border border-white transition-transform duration-300"
                    >
                      <ArrowUp className="w-2.5 h-2.5" />
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic game message bar */}
        <div className={`mt-4 w-full p-3 rounded-xl border text-sm text-center font-medium min-h-[60px] flex items-center justify-center transition-all ${
          gameState === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : gameState === 'failed'
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <span>{gameMessage}</span>
        </div>

        {/* Game Info & Progress Stats */}
        <div className="mt-4 w-full grid grid-cols-2 gap-3 text-xs">
          <div className="bg-indigo-50/50 p-2.5 rounded-xl flex items-center justify-between border border-indigo-100">
            <span className="text-slate-500">{t.simCollectedEnergy}</span>
            <span className="font-bold text-indigo-700 text-sm">⚡ {energyCollected.length} / 3</span>
          </div>
          <div className="bg-indigo-50/50 p-2.5 rounded-xl flex items-center justify-between border border-indigo-100">
            <span className="text-slate-500">{t.simControllerConn}</span>
            <span className="font-bold text-slate-700 text-sm">{robotPos.x === MAINFRAME.x && robotPos.y === MAINFRAME.y ? t.simConnOk : t.simConnNo}</span>
          </div>
        </div>
      </div>

      {/* Programming Command Center */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-3">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-1.5 font-display">
              ⚙️ {t.simAreaTitle}
            </h4>
            <p className="text-xs text-slate-500">{t.simAreaDesc}</p>
          </div>

          {/* Current Program Stack */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 min-h-[160px] max-h-[220px] overflow-y-auto">
            <span className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
              {t.simStackTitle.replace('{count}', commands.length.toString())}
            </span>
            {commands.length === 0 ? (
              <div className="h-28 flex flex-col items-center justify-center text-slate-400 gap-1.5 text-xs">
                <span>{t.simEmptyStack}</span>
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">{t.simAddInstruction}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <AnimatePresence>
                  {commands.map((cmd, idx) => (
                    <motion.div
                      key={cmd.id}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -20 }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border shadow-xs transition-all ${
                        currentStep === idx
                          ? 'border-indigo-500 bg-indigo-100 text-indigo-900 ring-2 ring-indigo-300 scale-105'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className={`p-1 rounded-md text-white shrink-0 ${
                          cmd.type === 'FORWARD' ? 'bg-sky-500' : cmd.type === 'LEFT' ? 'bg-amber-500' : cmd.type === 'RIGHT' ? 'bg-violet-500' : 'bg-emerald-500'
                        }`}>
                          {cmd.icon}
                        </span>
                        <span className="truncate text-[11px] font-sans">{cmd.label.split(' ')[0]}</span>
                      </div>
                      <button
                        onClick={() => removeCommand(cmd.id)}
                        disabled={isRunning}
                        className="text-slate-400 hover:text-rose-500 disabled:opacity-30 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Action Blocks Palette */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
              {t.simPaletteTitle}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
              {COMMAND_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.type}
                  onClick={() => addCommand(tpl)}
                  disabled={isRunning || commands.length >= 12}
                  className="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-40 active:scale-95 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                >
                  <span className={`p-1 rounded-lg text-white ${tpl.type === 'FORWARD' ? 'bg-sky-500' : tpl.type === 'LEFT' ? 'bg-amber-500' : tpl.type === 'RIGHT' ? 'bg-violet-500' : 'bg-emerald-500'}`}>
                    {tpl.icon}
                  </span>
                  <div className="flex flex-col items-start leading-tight min-w-0">
                    <span className="truncate max-w-[80px]">{tpl.label.split(' ')[0]}</span>
                    <span className="text-[9px] text-slate-400 font-normal">{tpl.label.split(' ')[1]}</span>
                  </div>
                </button>
              ))}
            </div>
            {commands.length >= 12 && (
              <span className="text-[10px] text-amber-500 font-medium mt-1.5 block">{t.simMemWarn}</span>
            )}
          </div>
        </div>

        {/* Execution Controls */}
        <div className="flex gap-2 border-t border-slate-100 pt-4 mt-2">
          <button
            onClick={runProgram}
            disabled={isRunning || commands.length === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:translate-y-0.5 text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.simBtnRun}</span>
          </button>
          <button
            onClick={resetSimulator}
            disabled={isRunning}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-xl border border-slate-200 cursor-pointer transition-all active:translate-y-0.5 text-sm"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={clearCommands}
            disabled={isRunning || commands.length === 0}
            className="px-4 py-3 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 text-rose-600 border border-rose-100 font-bold rounded-xl cursor-pointer transition-all active:translate-y-0.5 text-sm"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
