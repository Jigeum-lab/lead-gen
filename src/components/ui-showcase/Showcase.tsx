import { useState } from "react";
import {
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  Check,
  Bell,
  Search,
  Settings,
  ChevronDown,
  Rocket,
  Target,
  BarChart3,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SWATCHES: { name: string; cls: string; ring?: boolean }[] = [
  { name: "background", cls: "bg-background", ring: true },
  { name: "foreground", cls: "bg-foreground" },
  { name: "primary", cls: "bg-primary" },
  { name: "primary-hover", cls: "bg-primary-hover" },
  { name: "primary-subtle", cls: "bg-primary-subtle" },
  { name: "secondary", cls: "bg-secondary" },
  { name: "muted", cls: "bg-muted" },
  { name: "accent", cls: "bg-accent" },
  { name: "cyan", cls: "bg-cyan" },
  { name: "cyan-soft", cls: "bg-cyan-soft" },
  { name: "ink", cls: "bg-ink" },
  { name: "card", cls: "bg-card", ring: true },
  { name: "border", cls: "bg-border" },
  { name: "success", cls: "bg-success" },
  { name: "warning", cls: "bg-warning" },
  { name: "danger", cls: "bg-danger" },
];

function Section({
  id,
  title,
  desc,
  children,
}: {
  id: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {desc && <p className="text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

const NAV = [
  ["colors", "컬러"],
  ["typography", "타이포그래피"],
  ["buttons", "버튼"],
  ["badges", "뱃지"],
  ["forms", "폼"],
  ["interactive", "인터랙션"],
  ["feedback", "피드백"],
  ["cards", "카드"],
] as const;

export default function Showcase() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">LeadGenLab</p>
                <p className="text-xs text-muted-foreground">디자인 시스템 · /ui</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                shadcn/ui · Tailwind v4
              </Badge>
              <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="테마 전환">
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[180px_1fr]">
          {/* Sidebar nav */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              {NAV.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="space-y-16">
            {/* Hero */}
            <div className="space-y-4">
              <Badge className="gap-1.5">
                <Sparkles className="size-3.5" /> LeadGenLab Design System
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                AVO 브랜드를 위한 일렉트릭 블루 디자인 시스템
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                shadcn/ui(new-york)를 LeadGenLab 브랜드 토큰에 매핑한 컴포넌트 라이브러리.
                모든 색·반경·그림자는 <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                  src/styles/global.css
                </code>의 토큰을 따릅니다.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button size="lg">
                  무료 진단 요청 <ArrowRight className="size-4" />
                </Button>
                <Button size="lg" variant="outline">
                  회사소개서 보기
                </Button>
              </div>
            </div>

            <Separator />

            {/* Colors */}
            <Section id="colors" title="컬러" desc="브랜드 + shadcn 시맨틱 토큰. 항상 토큰 유틸리티로 사용하세요.">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SWATCHES.map((s) => (
                  <div key={s.name} className="space-y-2">
                    <div
                      className={`h-16 rounded-lg ${s.cls} ${
                        s.ring ? "ring-1 ring-border ring-inset" : ""
                      }`}
                    />
                    <p className="font-mono text-xs text-muted-foreground">{s.name}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Separator />

            {/* Typography */}
            <Section id="typography" title="타이포그래피" desc="Pretendard Variable · 한국어 기본.">
              <div className="space-y-3">
                <h1 className="text-5xl font-bold tracking-tight">H1 · AI 가시성 최적화</h1>
                <h2 className="text-3xl font-bold tracking-tight">H2 · AVO 컨설팅</h2>
                <h3 className="text-2xl font-semibold">H3 · 진단 → 전략 → 실행</h3>
                <p className="text-lg">본문 Large — AI가 추천하는 브랜드가 됩니다.</p>
                <p className="text-base text-muted-foreground">
                  본문 Base muted — 검색에서 답변으로, 패러다임이 이동합니다.
                </p>
                <p className="font-mono text-sm">mono · src/styles/global.css</p>
              </div>
            </Section>

            <Separator />

            {/* Buttons */}
            <Section id="buttons" title="버튼" desc="variant × size 매트릭스.">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" aria-label="설정">
                    <Settings className="size-4" />
                  </Button>
                  <Button disabled>Disabled</Button>
                  <Button>
                    <Rocket className="size-4" /> 시작하기
                  </Button>
                </div>
              </div>
            </Section>

            <Separator />

            {/* Badges */}
            <Section id="badges" title="뱃지" desc="상태·라벨 표기.">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-success text-white">진행중</Badge>
                <Badge className="bg-warning text-ink">대기</Badge>
              </div>
            </Section>

            <Separator />

            {/* Forms */}
            <Section id="forms" title="폼" desc="입력 요소 — 진단 요청 폼 예시.">
              <Card className="max-w-xl">
                <CardHeader>
                  <CardTitle>AI 가시성 무료 진단</CardTitle>
                  <CardDescription>브랜드 정보를 입력하면 진단 리포트를 보내드립니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="brand">브랜드명</Label>
                    <Input id="brand" placeholder="예: LeadGenLab" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cat">카테고리</Label>
                    <Select>
                      <SelectTrigger id="cat">
                        <SelectValue placeholder="산업군 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="commerce">커머스</SelectItem>
                        <SelectItem value="finance">금융</SelectItem>
                        <SelectItem value="edu">교육</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="msg">요청사항</Label>
                    <Textarea id="msg" placeholder="현재 고민을 적어주세요." />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="agree" />
                    <Label htmlFor="agree" className="font-normal text-muted-foreground">
                      개인정보 수집·이용에 동의합니다.
                    </Label>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <Label htmlFor="news" className="font-normal">
                      뉴스레터 받기
                    </Label>
                    <Switch id="news" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">진단 요청 보내기</Button>
                </CardFooter>
              </Card>
            </Section>

            <Separator />

            {/* Interactive */}
            <Section id="interactive" title="인터랙션" desc="Tabs · Accordion · Dialog · Dropdown · Tooltip.">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tabs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="avo">
                      <TabsList>
                        <TabsTrigger value="avo">AVO</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                        <TabsTrigger value="geo">GEO</TabsTrigger>
                      </TabsList>
                      <TabsContent value="avo" className="pt-3 text-sm text-muted-foreground">
                        AI 응답 안에 브랜드를 배치하는 최적화.
                      </TabsContent>
                      <TabsContent value="seo" className="pt-3 text-sm text-muted-foreground">
                        검색엔진 가시성 최적화.
                      </TabsContent>
                      <TabsContent value="geo" className="pt-3 text-sm text-muted-foreground">
                        생성형 엔진 최적화(Generative Engine Optimization).
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Accordion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="1">
                        <AccordionTrigger>AVO가 뭔가요?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          AI Visibility Optimization — AI 답변에 브랜드를 노출시키는 전략입니다.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="2">
                        <AccordionTrigger>얼마나 걸리나요?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          진단 1주, 전략 2주, 실행은 범위에 따라 달라집니다.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card className="flex flex-row items-center gap-4 p-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Bell className="size-4" /> Dialog 열기
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>무료 진단 신청 완료</DialogTitle>
                        <DialogDescription>
                          담당 컨설턴트가 1영업일 내 회신드립니다.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button>확인</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        메뉴 <ChevronDown className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>서비스</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Target className="size-4" /> 진단
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="size-4" /> 리포트
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Search className="size-4" /> 키워드
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="도움말">
                        <Sparkles className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>툴팁입니다 ✨</TooltipContent>
                  </Tooltip>
                </Card>
              </div>
            </Section>

            <Separator />

            {/* Feedback */}
            <Section id="feedback" title="피드백" desc="Alert · Progress · Skeleton · Avatar.">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Alert>
                    <Check className="size-4" />
                    <AlertTitle>진단 완료</AlertTitle>
                    <AlertDescription>리포트가 준비되었습니다.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <TriangleAlert className="size-4" />
                    <AlertTitle>가시성 위험</AlertTitle>
                    <AlertDescription>주요 AI 답변에서 브랜드가 누락되었습니다.</AlertDescription>
                  </Alert>
                </div>

                <div className="space-y-2">
                  <Label>AI 가시성 점수 — 64%</Label>
                  <Progress value={64} />
                </div>

                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>LG</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </div>
            </Section>

            <Separator />

            {/* Cards */}
            <Section id="cards" title="카드" desc="콘텐츠 컨테이너 패턴.">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { icon: Target, t: "진단", d: "AI 답변 내 브랜드 노출 현황 분석." },
                  { icon: BarChart3, t: "전략", d: "노출 격차를 메우는 콘텐츠·구조 설계." },
                  { icon: Rocket, t: "실행", d: "GEO·SEO 통합 실행과 모니터링." },
                ].map(({ icon: Icon, t, d }) => (
                  <Card key={t} className="transition hover:shadow-lift">
                    <CardHeader>
                      <span className="flex size-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                        <Icon className="size-5" />
                      </span>
                      <CardTitle className="pt-2">{t}</CardTitle>
                      <CardDescription>{d}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" className="px-0 text-primary">
                        자세히 <ArrowRight className="size-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </Section>

            <footer className="border-t border-border pt-8 text-sm text-muted-foreground">
              LeadGenLab 디자인 시스템 · shadcn/ui new-york · Tailwind v4 · Astro 6
            </footer>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
