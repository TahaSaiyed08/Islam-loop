"use client";

import { CheckCircle2, Flame, Sparkles, Zap } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/store/use-progress";

export const DailyQuests = () => {
  const { ready, points, completed, streak } = useProgress();
  const xp = ready ? points : 0;
  const doneCount = ready ? completed.length : 0;
  const streakCount = ready ? streak : 0;

  const quests = [
    {
      id: "xp",
      title: "Earn 20 XP",
      current: Math.min(xp, 20),
      target: 20,
      icon: Zap,
      iconColor: "text-sand-dark",
    },
    {
      id: "lesson",
      title: "Complete 1 lesson",
      current: Math.min(doneCount, 1),
      target: 1,
      icon: Sparkles,
      iconColor: "text-[#1CB0F6]",
    },
    {
      id: "streak",
      title: "Start a daily streak",
      current: Math.min(streakCount, 1),
      target: 1,
      icon: Flame,
      iconColor: "text-[#FF9600]",
    },
  ];

  return (
    <div
      className="space-y-4 rounded-2xl border-2 border-swan bg-white p-6"
      data-testid="daily-quests"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-eel">Daily Quests</h3>
      </div>

      <ul className="space-y-4">
        {quests.map((q) => {
          const Icon = q.icon;
          const pct = Math.round((q.current / q.target) * 100);
          const complete = q.current >= q.target;

          return (
            <li key={q.id} className="flex items-center gap-x-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-polar">
                {complete ? (
                  <CheckCircle2
                    aria-hidden
                    className="size-6 text-[#46A302]"
                  />
                ) : (
                  <Icon aria-hidden className={`size-6 ${q.iconColor}`} />
                )}
              </div>

              <div className="flex w-full flex-col gap-y-1.5">
                <div className="flex items-center justify-between text-sm font-extrabold text-eel">
                  <span>{q.title}</span>
                  <span className="font-mono text-xs text-wolf">
                    {q.current} / {q.target}
                  </span>
                </div>
                <Progress
                  value={pct}
                  className="h-3"
                  indicatorClassName={complete ? "bg-[#58CC02]" : "bg-sand"}
                  aria-label={q.title}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
