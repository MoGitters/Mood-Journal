import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  BarChart, LineChart, PieChart, Line, Bar, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedBackground from "@/components/AnimatedBackground";
import { JournalEntry } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BarChart2, PieChart as PieChartIcon, TrendingUp, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Define chart colors
const chartColors = {
  happy: "#FFD700", // Gold for happy emotions
  sad: "#6495ED",   // Blue for sad emotions
  neutral: "#98FB98", // Green for neutral emotions
  angry: "#FF6347",  // Red for angry emotions
  love: "#FF69B4",   // Pink for love emotions
};

// Map emojis to mood categories for analytics
const moodCategoryMap: Record<string, string> = {
  "😊": "happy",
  "😍": "love",
  "😌": "happy",
  "🥰": "love",
  "😎": "happy",
  "😢": "sad",
  "😞": "sad",
  "😡": "angry",
  "😴": "neutral",
  "🤔": "neutral",
};

// Get English names for the mood categories
const moodNames: Record<string, string> = {
  "happy": "Happy",
  "sad": "Sad",
  "angry": "Angry",
  "love": "Love",
  "neutral": "Neutral",
};

// Analytics time range options
const timeRanges = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7days");
  
  // Fetch all journal entries
  const { data: journalEntries, isLoading, error } = useQuery<JournalEntry[]>({
    queryKey: ['/api/journal'],
    staleTime: 1 * 60 * 1000, // 1 minute
  });
  
  // Filter entries based on selected time range
  const filteredEntries = getFilteredEntries(journalEntries || [], timeRange);
  
  // Calculate mood distribution data
  const moodDistribution = calculateMoodDistribution(filteredEntries);
  
  // Calculate mood trends over time
  const moodTrends = calculateMoodTrends(filteredEntries);
  
  // Calculate journaling streaks
  const [currentStreak, longestStreak] = calculateStreaks(journalEntries || []);
  
  // Calculate word count statistics
  const wordCountStats = calculateWordCountStats(filteredEntries);
  
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      
      <header className="py-6 container">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <BarChart2 className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Mood Analytics</h1>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground">
          Insights and trends from your mood journal entries
        </p>
      </header>
      
      <main className="flex-1 container pb-8">
        <div className="flex justify-between items-center mb-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <BarChart2 className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="distribution" className="flex items-center gap-1">
                  <PieChartIcon className="h-4 w-4" />
                  <span>Distribution</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trends</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Calendar</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center">
                <span className="mr-2 text-sm text-muted-foreground">Time Range:</span>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                    <CardDescription>Journaling progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {isLoading ? "..." : filteredEntries.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total: {journalEntries?.length || 0} entries
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                    <CardDescription>Consecutive days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{currentStreak}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Longest: {longestStreak} days
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Words</CardTitle>
                    <CardDescription>Words per entry</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{wordCountStats.average}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max: {wordCountStats.max} words
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Primary Mood</CardTitle>
                    <CardDescription>Most frequent</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <p className="text-3xl font-bold mr-2">
                        {moodDistribution.length > 0 ? 
                          moodNames[moodDistribution[0].name] : "N/A"}
                      </p>
                      {moodDistribution.length > 0 && (
                        <span className="text-2xl">
                          {getEmojiForMood(moodDistribution[0].name)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {moodDistribution.length > 0 ? 
                        `${Math.round(moodDistribution[0].value / filteredEntries.length * 100)}% of entries` : 
                        "No entries yet"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Mood Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of your moods over {getTimeRangeLabel(timeRange)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {moodDistribution.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={moodDistribution}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({name, percent}) => `${moodNames[name as keyof typeof moodNames]} ${(percent * 100).toFixed(0)}%`}
                            >
                              {moodDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={chartColors[entry.name as keyof typeof chartColors]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value} entries`, "Count"]}
                              labelFormatter={(name) => moodNames[name as keyof typeof moodNames] || name}
                            />
                            <Legend 
                              formatter={(value) => moodNames[value as keyof typeof moodNames] || value} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">No data available for the selected time range</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Mood Trends</CardTitle>
                    <CardDescription>
                      How your mood has changed over {getTimeRangeLabel(timeRange)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {moodTrends.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={moodTrends}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="dateFormatted" />
                            <YAxis />
                            <Tooltip 
                              content={<CustomTooltip />}
                            />
                            <Legend formatter={(value) => moodNames[value as keyof typeof moodNames] || value} />
                            <Line
                              type="monotone"
                              dataKey="happy"
                              stroke={chartColors.happy}
                              activeDot={{ r: 8 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="sad" 
                              stroke={chartColors.sad} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="neutral" 
                              stroke={chartColors.neutral} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="angry" 
                              stroke={chartColors.angry} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="love" 
                              stroke={chartColors.love} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">No data available for the selected time range</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Entries</CardTitle>
                  <CardDescription>
                    Your latest mood journal entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredEntries.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {filteredEntries.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="flex items-start p-4 border rounded-lg">
                          <div className="text-4xl mr-4">{entry.mood}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-medium">
                                {format(new Date(entry.date), "MMM d, yyyy")}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {entry.content.split(" ").length} words
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {entry.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-muted-foreground">No entries available for the selected time range</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          
            {/* Distribution Tab */}
            <TabsContent value="distribution" className="space-y-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Mood Distribution</CardTitle>
                  <CardDescription>
                    Detailed breakdown of your moods over {getTimeRangeLabel(timeRange)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {moodDistribution.length > 0 ? (
                    <div className="h-[400px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                              <Pie
                                data={moodDistribution}
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({name, percent}) => `${moodNames[name as keyof typeof moodNames]} ${(percent * 100).toFixed(0)}%`}
                              >
                                {moodDistribution.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={chartColors[entry.name as keyof typeof chartColors]} 
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value} entries`, "Count"]}
                                labelFormatter={(name) => moodNames[name as keyof typeof moodNames] || name}
                              />
                              <Legend formatter={(value) => moodNames[value as keyof typeof moodNames] || value} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-4">Distribution Details</h3>
                          <div className="space-y-4">
                            {moodDistribution.map((item) => (
                              <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div 
                                    className="w-4 h-4 rounded-full mr-2" 
                                    style={{ backgroundColor: chartColors[item.name as keyof typeof chartColors] }}
                                  />
                                  <span className="capitalize">{moodNames[item.name as keyof typeof moodNames]}</span>
                                  <span className="ml-2">{getEmojiForMood(item.name)}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium">{item.value}</span>
                                  <span className="text-muted-foreground text-sm ml-2">
                                    ({Math.round(item.value / filteredEntries.length * 100)}%)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-4" />
                          <div className="pt-4">
                            <p className="text-sm text-muted-foreground">
                              Based on {filteredEntries.length} entries over {getTimeRangeLabel(timeRange)}.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center">
                      <p className="text-muted-foreground">No data available for the selected time range</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Mood by Emoji</CardTitle>
                  <CardDescription>
                    Breakdown of the specific emoji selections you've used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredEntries.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {calculateEmojiUsage(filteredEntries).map((item) => (
                        <div 
                          key={item.emoji} 
                          className="flex flex-col items-center justify-center p-4 border rounded-lg"
                        >
                          <span className="text-4xl mb-2">{item.emoji}</span>
                          <span className="font-medium">{item.count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round(item.count / filteredEntries.length * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-muted-foreground">No data available for the selected time range</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          
            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Mood Trends Over Time</CardTitle>
                  <CardDescription>
                    How your moods have changed over {getTimeRangeLabel(timeRange)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {moodTrends.length > 0 ? (
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={moodTrends}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="dateFormatted" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend formatter={(value) => moodNames[value as keyof typeof moodNames] || value} />
                          <Line
                            type="monotone"
                            dataKey="happy"
                            stroke={chartColors.happy}
                            activeDot={{ r: 8 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sad" 
                            stroke={chartColors.sad} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="neutral" 
                            stroke={chartColors.neutral} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="angry" 
                            stroke={chartColors.angry} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="love" 
                            stroke={chartColors.love} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center">
                      <p className="text-muted-foreground">No data available for the selected time range</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Word Count Analysis</CardTitle>
                  <CardDescription>
                    Length of your journal entries over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredEntries.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={calculateWordCountTrend(filteredEntries)}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} words`, "Word Count"]} />
                          <Bar dataKey="words" fill="#4A8EC9" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="flex justify-between text-sm text-muted-foreground mt-4">
                        <div>Average: {wordCountStats.average} words</div>
                        <div>Max: {wordCountStats.max} words</div>
                        <div>Min: {wordCountStats.min} words</div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">No data available for the selected time range</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          
            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Mood Calendar</CardTitle>
                  <CardDescription>
                    Calendar view of your daily moods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Calendar view would show a monthly calendar with colored indicators for each day's mood.
                    <br />
                    (This is a placeholder for the calendar visualization)
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Journaling Streaks</CardTitle>
                  <CardDescription>
                    Your consistency in keeping a mood journal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Current Streak</h3>
                      <p className="text-5xl font-bold mb-2">{currentStreak}</p>
                      <p className="text-sm text-muted-foreground">consecutive days</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Longest Streak</h3>
                      <p className="text-5xl font-bold mb-2">{longestStreak}</p>
                      <p className="text-sm text-muted-foreground">consecutive days</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Entry Dates</h3>
                    <div className="flex flex-wrap gap-2">
                      {(journalEntries || []).slice(0, 20).map(entry => (
                        <div 
                          key={entry.id} 
                          className="px-3 py-1 bg-primary/10 rounded-full text-xs flex items-center gap-2"
                        >
                          <span>{format(new Date(entry.date), "MMM d, yyyy")}</span>
                          <span>{entry.mood}</span>
                        </div>
                      ))}
                      {(journalEntries || []).length > 20 && (
                        <div className="px-3 py-1 bg-muted rounded-full text-xs">
                          +{(journalEntries || []).length - 20} more
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// Helper component for custom tooltip
// Define type for the tooltip props
interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: any;
}

function CustomTooltip({ payload, active }: TooltipProps) {
  if (!active || !payload) return null;
  
  return (
    <div className="custom-tooltip bg-white p-3 border rounded-md shadow-md">
      <div className="text-sm font-medium mb-2">
        {payload[0]?.payload.dateFormatted}
      </div>
      <div className="space-y-1">
        {payload
          .filter((p) => p.value > 0)
          .sort((a, b) => b.value - a.value)
          .map((p) => (
            <div key={p.dataKey} className="flex items-center justify-between gap-2">
              <div className="flex items-center">
                <div
                  className="h-3 w-3 rounded-full mr-1"
                  style={{ backgroundColor: p.stroke }}
                />
                <span className="capitalize">{moodNames[p.dataKey as keyof typeof moodNames] || p.dataKey}</span>
              </div>
              <span className="font-medium">{p.value}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

// Helper function to filter entries based on time range
function getFilteredEntries(entries: JournalEntry[], timeRange: string): JournalEntry[] {
  const now = new Date();
  let cutoffDate: Date;
  
  switch (timeRange) {
    case "7days":
      cutoffDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "30days":
      cutoffDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case "90days":
      cutoffDate = new Date(now.setDate(now.getDate() - 90));
      break;
    default: // "all"
      return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  return entries
    .filter(entry => new Date(entry.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Helper function to get time range label
function getTimeRangeLabel(timeRange: string): string {
  switch (timeRange) {
    case "7days":
      return "the last 7 days";
    case "30days":
      return "the last 30 days";
    case "90days":
      return "the last 90 days";
    default: // "all"
      return "all time";
  }
}

// Helper function to calculate mood distribution
function calculateMoodDistribution(entries: JournalEntry[]) {
  const distribution: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    love: 0,
    neutral: 0,
  };
  
  entries.forEach(entry => {
    const category = moodCategoryMap[entry.mood] || "neutral";
    distribution[category]++;
  });
  
  return Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);
}

// Helper function to calculate emoji usage
function calculateEmojiUsage(entries: JournalEntry[]) {
  const usage: Record<string, number> = {};
  
  entries.forEach(entry => {
    if (!usage[entry.mood]) {
      usage[entry.mood] = 0;
    }
    usage[entry.mood]++;
  });
  
  return Object.entries(usage)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count);
}

// Helper function to calculate mood trends over time
function calculateMoodTrends(entries: JournalEntry[]) {
  if (entries.length === 0) return [];
  
  // Group entries by date
  const entriesByDate: Record<string, JournalEntry[]> = {};
  entries.forEach(entry => {
    const dateStr = format(new Date(entry.date), "yyyy-MM-dd");
    if (!entriesByDate[dateStr]) {
      entriesByDate[dateStr] = [];
    }
    entriesByDate[dateStr].push(entry);
  });
  
  // Calculate mood distribution for each date
  return Object.entries(entriesByDate).map(([dateStr, dayEntries]) => {
    const result: any = {
      date: dateStr,
      dateFormatted: format(new Date(dateStr), "MMM d, yyyy"),
      happy: 0,
      sad: 0,
      angry: 0,
      love: 0,
      neutral: 0,
    };
    
    dayEntries.forEach(entry => {
      const category = moodCategoryMap[entry.mood] || "neutral";
      result[category]++;
    });
    
    return result;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Helper function to calculate word count trend
function calculateWordCountTrend(entries: JournalEntry[]) {
  return entries.map(entry => ({
    date: format(new Date(entry.date), "MMM d"),
    words: entry.content.split(/\s+/).filter(Boolean).length,
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10).reverse();
}

// Helper function to calculate streaks
function calculateStreaks(entries: JournalEntry[]): [number, number] {
  if (entries.length === 0) return [0, 0];
  
  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Check if most recent entry is from today
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const mostRecentEntry = new Date(sortedEntries[0].date);
  const mostRecentDay = new Date(
    mostRecentEntry.getFullYear(),
    mostRecentEntry.getMonth(),
    mostRecentEntry.getDate()
  );
  
  // Calculate current streak
  let currentStreak = 0;
  if (mostRecentDay.getTime() >= today.getTime() || 
      mostRecentDay.getTime() === today.getTime() - 86400000) {
    // If most recent entry is from today or yesterday, streak is still active
    currentStreak = 1;
    let prevDate = mostRecentDay;
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const entryDay = new Date(
        entryDate.getFullYear(),
        entryDate.getMonth(),
        entryDate.getDate()
      );
      
      // Check if this entry is from the previous day
      const expectedPrevDay = new Date(prevDate.getTime() - 86400000);
      if (entryDay.getTime() === expectedPrevDay.getTime()) {
        currentStreak++;
        prevDate = entryDay;
      } else {
        break;
      }
    }
  }
  
  // Calculate longest streak
  let longestStreak = currentStreak;
  const dateSet = new Set(entries.map(entry => 
    format(new Date(entry.date), "yyyy-MM-dd")
  ));
  
  const dates = Array.from(dateSet).map(dateStr => new Date(dateStr))
    .sort((a, b) => a.getTime() - b.getTime());
  
  let currentRun = 1;
  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currDate = dates[i];
    
    const dayDiff = Math.round((currDate.getTime() - prevDate.getTime()) / 86400000);
    
    if (dayDiff === 1) {
      // Consecutive day
      currentRun++;
      longestStreak = Math.max(longestStreak, currentRun);
    } else {
      // Break in streak
      currentRun = 1;
    }
  }
  
  return [currentStreak, longestStreak];
}

// Helper function to calculate word count statistics
function calculateWordCountStats(entries: JournalEntry[]) {
  if (entries.length === 0) {
    return { average: 0, max: 0, min: 0 };
  }
  
  const wordCounts = entries.map(entry => 
    entry.content.split(/\s+/).filter(Boolean).length
  );
  
  const total = wordCounts.reduce((sum, count) => sum + count, 0);
  const max = Math.max(...wordCounts);
  const min = Math.min(...wordCounts);
  const average = Math.round(total / entries.length);
  
  return { average, max, min };
}

// Helper function to get emoji for mood category
function getEmojiForMood(category: string): string {
  switch (category) {
    case "happy":
      return "😊";
    case "sad":
      return "😢";
    case "angry":
      return "😡";
    case "love":
      return "😍";
    case "neutral":
      return "😌";
    default:
      return "";
  }
}