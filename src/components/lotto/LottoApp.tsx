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

const DEFAULT_GAME_COUNT = 5;

export function LottoApp() {
  const [games, setGames] = useState<LottoGame[]>([]);

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

        <Tabs defaultValue="generate" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-black/5 p-2">
            {/* Decorative gradient bar at top */}
            <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-3xl bg-gradient-to-r from-blue-400 via-amber-400 to-violet-400 opacity-60" />

            <TabsList className="grid w-full grid-cols-3 h-auto p-0 bg-transparent border-0 shadow-none gap-2">
              {/* 번호 생성 Tab */}
              <TabsTrigger
                value="generate"
                className="group relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-0 outline-none transition-all duration-300 cursor-pointer
                  text-gray-400 dark:text-gray-500
                  hover:text-blue-500 dark:hover:text-blue-400
                  data-active:text-white
                  data-active:bg-gradient-to-br data-active:from-blue-400 data-active:via-blue-500 data-active:to-indigo-600
                  data-active:shadow-lg data-active:shadow-blue-500/30
                  hover:bg-blue-50/80 dark:hover:bg-blue-950/30"
              >
                {/* Glow effect for active state */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 opacity-0 group-data-active:opacity-20 blur-lg transition-opacity duration-300" />

                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300
                  bg-blue-100/80 dark:bg-blue-900/30
                  group-data-active:bg-white/20 dark:group-data-active:bg-white/10
                  group-hover:scale-110 group-data-active:scale-105
                  shadow-sm group-data-active:shadow-none">
                  <Dices className="h-6 w-6 text-blue-500 group-data-active:text-white transition-colors duration-200 drop-shadow-sm" />
                </div>
                <div className="relative flex flex-col items-center gap-0.5">
                  <span className="text-[11px] font-extrabold tracking-widest uppercase">번호</span>
                  <span className="text-[10px] font-medium opacity-70">생성</span>
                </div>
              </TabsTrigger>

              {/* 즐겨찾기 Tab */}
              <TabsTrigger
                value="favorites"
                className="group relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-0 outline-none transition-all duration-300 cursor-pointer
                  text-gray-400 dark:text-gray-500
                  hover:text-amber-500 dark:hover:text-amber-400
                  data-active:text-white
                  data-active:bg-gradient-to-br data-active:from-amber-400 data-active:via-orange-500 data-active:to-rose-500
                  data-active:shadow-lg data-active:shadow-orange-500/30
                  hover:bg-amber-50/80 dark:hover:bg-amber-950/30"
              >
                {/* Glow effect for active state */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 opacity-0 group-data-active:opacity-20 blur-lg transition-opacity duration-300" />

                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300
                  bg-amber-100/80 dark:bg-amber-900/30
                  group-data-active:bg-white/20 dark:group-data-active:bg-white/10
                  group-hover:scale-110 group-data-active:scale-105
                  shadow-sm group-data-active:shadow-none">
                  <Star className="h-6 w-6 text-amber-500 group-data-active:text-white transition-colors duration-200 drop-shadow-sm" />
                  {favoriteGames.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full
                      bg-rose-500 group-data-active:bg-white group-data-active:text-rose-500
                      text-white text-[9px] font-extrabold shadow-lg border-2 border-white dark:border-gray-900 transition-colors duration-200">
                      {favoriteGames.length}
                    </span>
                  )}
                </div>
                <div className="relative flex flex-col items-center gap-0.5">
                  <span className="text-[11px] font-extrabold tracking-widest uppercase">즐겨</span>
                  <span className="text-[10px] font-medium opacity-70">찾기</span>
                </div>
              </TabsTrigger>

              {/* 통계 Tab */}
              <TabsTrigger
                value="stats"
                className="group relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-0 outline-none transition-all duration-300 cursor-pointer
                  text-gray-400 dark:text-gray-500
                  hover:text-violet-500 dark:hover:text-violet-400
                  data-active:text-white
                  data-active:bg-gradient-to-br data-active:from-violet-400 data-active:via-violet-500 data-active:to-purple-700
                  data-active:shadow-lg data-active:shadow-violet-500/30
                  hover:bg-violet-50/80 dark:hover:bg-violet-950/30"
              >
                {/* Glow effect for active state */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-700 opacity-0 group-data-active:opacity-20 blur-lg transition-opacity duration-300" />

                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300
                  bg-violet-100/80 dark:bg-violet-900/30
                  group-data-active:bg-white/20 dark:group-data-active:bg-white/10
                  group-hover:scale-110 group-data-active:scale-105
                  shadow-sm group-data-active:shadow-none">
                  <BarChart3 className="h-6 w-6 text-violet-500 group-data-active:text-white transition-colors duration-200 drop-shadow-sm" />
                </div>
                <div className="relative flex flex-col items-center gap-0.5">
                  <span className="text-[11px] font-extrabold tracking-widest uppercase">번호</span>
                  <span className="text-[10px] font-medium opacity-70">통계</span>
                </div>
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
