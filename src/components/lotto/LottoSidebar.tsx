"use client";

import { SavedLottoGame } from "@/types/lotto";
import { LottoBall } from "./LottoBall";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, X, Trash2 } from "lucide-react";

interface LottoSidebarProps {
  history: SavedLottoGame[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function LottoSidebar({ history, onDelete, onClearAll }: LottoSidebarProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full lg:w-72 shrink-0">
      <Card className="sticky top-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              저장된 번호
              {history.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                  {history.length}
                </span>
              )}
            </CardTitle>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-7 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                전체 삭제
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">저장된 번호가 없습니다.</p>
              <p className="text-xs mt-1">💾 버튼으로 번호를 저장하세요.</p>
            </div>
          ) : (
            <div
              className="space-y-2 overflow-y-auto pr-1"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {[...history].reverse().map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 group hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">
                    {history.length - index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1">
                      {item.numbers.map((num) => (
                        <LottoBall key={num} number={num} size="sm" />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatTime(item.savedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(item.id)}
                    title="삭제"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
