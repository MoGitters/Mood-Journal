import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, isToday, isPast, isFuture, parseISO, addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { ArrowLeft, Plus, Calendar, Check, Clock, X, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Reminder, ReminderPriority, reminderPriorities } from "@shared/schema";

// Form schema for reminders
const reminderFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  note: z.string().min(1, "Note is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  priority: z.enum(["low", "medium", "high"] as const).default("medium"),
  completed: z.boolean().default(false),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

export default function Reminders() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "today" | "upcoming">("all");

  // Get all reminders
  const { data: reminders = [], isLoading, refetch } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
  });

  // Filter reminders based on view mode
  const filteredReminders = reminders.filter(reminder => {
    const dueDate = parseISO(reminder.dueDate);
    
    if (viewMode === "today") {
      return isToday(dueDate);
    } else if (viewMode === "upcoming") {
      return isFuture(dueDate) && !isToday(dueDate);
    }
    
    return true; // "all" view
  });

  // Form for creating/editing reminders
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      title: "",
      note: "",
      dueDate: new Date(),
      priority: "medium",
      completed: false,
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setEditingReminder(null);
      form.reset({
        title: "",
        note: "",
        dueDate: new Date(),
        priority: "medium",
        completed: false,
      });
    }
  }, [isDialogOpen, form]);

  // Set form values when editing a reminder
  useEffect(() => {
    if (editingReminder) {
      form.reset({
        title: editingReminder.title,
        note: editingReminder.note,
        dueDate: new Date(editingReminder.dueDate),
        priority: editingReminder.priority as ReminderPriority,
        completed: editingReminder.completed,
      });
      setIsDialogOpen(true);
    }
  }, [editingReminder, form]);

  // Create reminder mutation
  const createMutation = useMutation({
    mutationFn: async (values: ReminderFormValues) => {
      return apiRequest("POST", "/api/reminders", values);
    },
    onSuccess: () => {
      toast({
        title: "Reminder created!",
        description: "Your reminder has been created successfully.",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create reminder",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update reminder mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; values: ReminderFormValues }) => {
      return apiRequest("PUT", `/api/reminders/${data.id}`, data.values);
    },
    onSuccess: () => {
      toast({
        title: "Reminder updated!",
        description: "Your reminder has been updated successfully.",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update reminder",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Toggle completion status mutation
  const toggleMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/reminders/${id}/toggle`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update status",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete reminder mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/reminders/${id}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Reminder deleted",
        description: "Your reminder has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete reminder",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Form submission handler
  const onSubmit = (values: ReminderFormValues) => {
    if (editingReminder) {
      updateMutation.mutate({ id: editingReminder.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get due date styling
  const getDueDateStyle = (dueDate: string) => {
    const date = parseISO(dueDate);
    
    if (isPast(date) && !isToday(date)) {
      return "text-red-600";
    } else if (isToday(date)) {
      return "text-orange-600 font-medium";
    }
    
    return "text-gray-600";
  };

  return (
    <div className="relative container mx-auto px-4 py-6 flex flex-col min-h-screen">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 p-2 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition"
            >
              <ArrowLeft className="h-5 w-5 text-pastel-purple" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">Notes & Reminders</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            size="sm"
            className="bg-white bg-opacity-80 text-pastel-purple hover:bg-white"
            onClick={() => setViewMode("all")}
          >
            All
          </Button>
          <Button
            variant={viewMode === "today" ? "default" : "outline"}
            size="sm"
            className="bg-white bg-opacity-80 text-pastel-purple hover:bg-white"
            onClick={() => setViewMode("today")}
          >
            Today
          </Button>
          <Button
            variant={viewMode === "upcoming" ? "default" : "outline"}
            size="sm"
            className="bg-white bg-opacity-80 text-pastel-purple hover:bg-white"
            onClick={() => setViewMode("upcoming")}
          >
            Upcoming
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="journal-bg rounded-3xl shadow-lg p-6 max-w-3xl mx-auto">
          {/* Add New Reminder Button */}
          <div className="mb-6 flex justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="px-6 py-2 bg-pastel-purple text-white rounded-full shadow-md hover:shadow-lg transition font-medium flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Reminder</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingReminder ? "Edit Reminder" : "Create New Reminder"}</DialogTitle>
                  <DialogDescription>
                    {editingReminder 
                      ? "Update your reminder details below." 
                      : "Add a new reminder to help you keep track of your tasks."}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Reminder title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add details about this reminder..." 
                              className="resize-none h-20"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a priority level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">
                        {editingReminder ? "Update Reminder" : "Create Reminder"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Reminders List */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="shadow-sm opacity-70 animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredReminders.length > 0 ? (
              // Reminders list
              filteredReminders.map((reminder) => (
                <Card 
                  key={reminder.id} 
                  className={cn(
                    "shadow-sm border-l-4 reminder-card",
                    reminder.completed ? "reminder-completed" : "",
                    isPast(parseISO(reminder.dueDate)) && !isToday(parseISO(reminder.dueDate)) && !reminder.completed ? "reminder-overdue" : "",
                    isToday(parseISO(reminder.dueDate)) && !reminder.completed ? "reminder-today" : "",
                    isFuture(parseISO(reminder.dueDate)) && !isToday(parseISO(reminder.dueDate)) && !reminder.completed ? "reminder-upcoming" : "",
                    !reminder.completed && "border-l-pastel-purple"
                  )}
                >
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "rounded-full border p-1 h-6 w-6",
                          reminder.completed
                            ? "bg-pastel-purple text-white border-pastel-purple"
                            : "border-gray-300"
                        )}
                        onClick={() => toggleMutation.mutate(reminder.id)}
                      >
                        {reminder.completed && <Check className="h-3 w-3" />}
                      </Button>
                      <div className="flex-1">
                        <CardTitle className={cn(
                          "text-lg font-medium reminder-title"
                        )}>
                          {reminder.title}
                        </CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getPriorityBadge(reminder.priority)} variant="outline">
                            {reminder.priority}
                          </Badge>
                          <div className={cn("text-sm flex items-center gap-1", getDueDateStyle(reminder.dueDate))}>
                            <Clock className="h-3.5 w-3.5" />
                            {format(new Date(reminder.dueDate), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-pastel-purple"
                        onClick={() => setEditingReminder(reminder)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => deleteMutation.mutate(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={cn(
                      "text-gray-600 whitespace-pre-wrap",
                      reminder.completed && "text-gray-400"
                    )}>
                      {reminder.note}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Empty state
              <div className="text-center py-10">
                <h3 className="text-xl font-medium mb-2">No reminders found</h3>
                {viewMode === "all" ? (
                  <p className="text-gray-500 mb-4">Create your first reminder to get started!</p>
                ) : (
                  <p className="text-gray-500 mb-4">
                    No {viewMode === "today" ? "reminders for today" : "upcoming reminders"}.
                  </p>
                )}
                <Button
                  className="bg-pastel-purple text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Add New Reminder
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}