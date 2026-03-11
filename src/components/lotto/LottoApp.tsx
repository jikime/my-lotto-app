"use client";

import { useState, useCallback, useEffect } from "react";
import { LottoGame } from "@/types/lotto";
import {
  generateLottoNumbers,
  generateMultipleGames,
  calculateFrequency,
} from "@/lib/lotto";
import { LottoGameCard } from "./LottoGameCard";
import { FrequencyChart } from "./FrequencyChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dices, Plus, Star, Trash2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DEFAULT_GAME_COUNT = 5;

// Precomputed indicator left positions for 3 equal columns with 4px container padding
// Container: p-1 (4px), each column = (100% - 8px) / 3
const INDICATOR_LEFT = ["4px", "calc(33.333% + 1px)", "calc(66.666% - 2px)"];
const INDICATOR_WIDTH = "calc(33.333% - 3px)";

export function LottoApp() {
  const [games, setGames] = useState<LottoGame[]>([]);
  const [activeTab, setActiveTab] = useState("generate");

  useEffect(() => {
    setGames(generateMultipleGames(DEFAULT_GAME_COUNT));
  }, []);

  const handleGenerateAll = useCallback(() => {
    setGames(generateMultipleGames(DEFAULT_GAME_COUNT));
    toast.success("5게임이 새로 생성되었습니다!");
  }, []);

  const handleAddGame = useCallback(() => {
    if (games.length >= 10) {
      toast.error("최대 10게임까지 추가할 수 있습니다.");
      return;
    }
    const newGame: LottoGame = {
      id: crypto.randomUUID(),
      numbers: generateLottoNumbers(),
      createdAt: new Date(),
      isFavorite: false,
    };
    setGames((prev) => [...prev, newGame]);
    toast.success("게임이 추가되었습니다.");
  }, [games.length]);

  const handleToggleFavorite = useCallback((id: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isFavorite: !g.isFavorite } : g))
    );
  }, []);

  const handleRegenerate = useCallback((id: string) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, numbers: generateLottoNumbers() } : g
      )
    );
    toast.success("번호가 다시 생성되었습니다.");
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (games.length <= 1) {
      toast.error("최소 1게임은 유지해야 합니다.");
      return;
    }
    setGames((prev) => prev.filter((g) => g.id !== id));
  }, [games.length]);

  const handleClearAll = useCallback(() => {
    setGames(generateMultipleGames(DEFAULT_GAME_COUNT));
    toast.info("초기화되었습니다.");
  }, []);

  const favoriteGames = games.filter((g) => g.isFavorite);
  const frequencies = calculateFrequency(games);

  const activeIndex = ["generate", "favorites", "stats"].indexOf(activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dices className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">로또 6/45</h1>
          </div>
          <p className="text-muted-foreground">
            행운의 번호를 생성하세요 ✨
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-1 overflow-hidden">
            {/* Decorative gradient bar at top */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-400 via-amber-400 to-violet-400 opacity-60" />

            {/* Sliding pill indicator */}
            <div
              className={cn(
                "absolute top-1 bottom-1 rounded-xl shadow-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                activeTab === "generate" &&
                  "bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 shadow-blue-500/30",
                activeTab === "favorites" &&
                  "bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shadow-orange-500/30",
                activeTab === "stats" &&
                  "bg-gradient-to-r from-violet-400 via-violet-500 to-purple-700 shadow-violet-500/30"
              )}
              style={{
                left: INDICATOR_LEFT[activeIndex],
                width: INDICATOR_WIDTH,
              }}
            />

            <TabsList className="relative grid w-full grid-cols-3 h-auto p-0 bg-transparent border-0 shadow-none">
              {/* 번호 생성 Tab */}
              <TabsTrigger
                value="generate"
                className="group relative z-10 flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl border-0 outline-none cursor-pointer
                  transition-colors duration-200
                  text-gray-500 dark:text-gray-400
                  hover:text-blue-500 dark:hover:text-blue-400
                  data-active:text-white"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                  bg-blue-50 dark:bg-blue-950/40
                  group-data-active:bg-white/20
                  group-hover:scale-110 group-data-active:scale-100">
                  <Dices className="h-4 w-4 text-blue-500 group-data-active:text-white transition-colors duration-200" />
                </div>
                <span className="text-sm font-semibold tracking-tight transition-colors duration-200">
                  번호 생성
                </span>
              </TabsTrigger>

              {/* 즐겨찾기 Tab */}
              <TabsTrigger
                value="favorites"
                className="group relative z-10 flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl border-0 outline-none cursor-pointer
                  transition-colors duration-200
                  text-gray-500 dark:text-gray-400
                  hover:text-amber-500 dark:hover:text-amber-400
                  data-active:text-white"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                  bg-amber-50 dark:bg-amber-950/40
                  group-data-active:bg-white/20
                  group-hover:scale-110 group-data-active:scale-100">
                  <Star className="h-4 w-4 text-amber-500 group-data-active:text-white transition-colors duration-200" />
                  {favoriteGames.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-0.5 rounded-full
                      bg-rose-500 group-data-active:bg-white/30
                      text-white text-[9px] font-bold shadow-sm border border-white/50 transition-colors duration-200">
                      {favoriteGames.length}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold tracking-tight transition-colors duration-200">
                  즐겨찾기
                </span>
              </TabsTrigger>

              {/* 통계 Tab */}
              <TabsTrigger
                value="stats"
                className="group relative z-10 flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl border-0 outline-none cursor-pointer
                  transition-colors duration-200
                  text-gray-500 dark:text-gray-400
                  hover:text-violet-500 dark:hover:text-violet-400
                  data-active:text-white"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                  bg-violet-50 dark:bg-violet-950/40
                  group-data-active:bg-white/20
                  group-hover:scale-110 group-data-active:scale-100">
                  <BarChart3 className="h-4 w-4 text-violet-500 group-data-active:text-white transition-colors duration-200" />
                </div>
                <span className="text-sm font-semibold tracking-tight transition-colors duration-200">
                  번호 통계
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    생성된 번호
                    <Badge variant="outline" className="ml-2">
                      {games.length}게임
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      className="h-8"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      초기화
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleGenerateAll}
                      className="h-8"
                    >
                      <Dices className="h-3.5 w-3.5 mr-1" />
                      전체 재생성
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {games.map((game, index) => (
                  <LottoGameCard
                    key={game.id}
                    game={game}
                    index={index}
                    onToggleFavorite={handleToggleFavorite}
                    onRegenerate={handleRegenerate}
                    onDelete={handleDelete}
                  />
                ))}
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddGame}
              disabled={games.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              게임 추가 ({games.length}/10)
            </Button>

            {/* Legend */}
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground mb-2 font-medium">번호별 색상 안내</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  {[
                    { range: "1–10", color: "bg-yellow-400 border-yellow-500", label: "노랑" },
                    { range: "11–20", color: "bg-blue-500 border-blue-600", label: "파랑" },
                    { range: "21–30", color: "bg-red-500 border-red-600", label: "빨강" },
                    { range: "31–40", color: "bg-gray-600 border-gray-700", label: "회색" },
                    { range: "41–45", color: "bg-green-500 border-green-600", label: "초록" },
                  ].map(({ range, color, label }) => (
                    <div key={range} className="flex items-center gap-1.5">
                      <div className={`w-4 h-4 rounded-full border-2 ${color}`} />
                      <span className="text-muted-foreground">{range} ({label})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                  즐겨찾기 번호
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {favoriteGames.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Star className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>즐겨찾기한 번호가 없습니다.</p>
                    <p className="text-sm mt-1">번호 생성 탭에서 ★ 버튼을 클릭하세요.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {favoriteGames.map((game, index) => (
                      <LottoGameCard
                        key={game.id}
                        game={game}
                        index={index}
                        onToggleFavorite={handleToggleFavorite}
                        onRegenerate={handleRegenerate}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    번호 통계
                  </CardTitle>
                  <Badge variant="outline">{games.length}게임 기준</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <FrequencyChart frequencies={frequencies} totalGames={games.length} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />
        <p className="text-center text-xs text-muted-foreground">
          로또 6/45 번호 생성기 · 행운을 빕니다! 🍀
        </p>
      </div>
    </div>
  );
}
