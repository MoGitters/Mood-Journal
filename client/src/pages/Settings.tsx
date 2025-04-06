import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { z } from "zod";
import { Settings as SettingsIcon, Download, Upload, Sun, Moon, Laptop } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient as defaultQueryClient } from "@/lib/queryClient";
import { 
  colorModes, 
  fontSizes, 
  themeColors, 
  backgroundGradients, 
  insertUserSettingsSchema,
  type UserSettings
} from "@shared/schema";

import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Extended schema with validation
const settingsFormSchema = insertUserSettingsSchema.extend({});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function Settings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("appearance");
  
  // Fetch current settings
  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Form setup
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings || {
      colorMode: "light",
      themeColor: "default",
      fontSize: "medium",
      zoomLevel: 100,
      backgroundGradient: "orange-blue",
    },
  });
  
  // Update form values when settings are fetched
  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);
  
  // Set up navigation
  const [, navigate] = useLocation();

  // Settings update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: SettingsFormValues) => {
      return apiRequest("PUT", "/api/settings", values);
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      
      // Redirect to the main journal page after a brief delay
      // to allow the toast to be visible
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your settings.",
        variant: "destructive",
      });
    },
  });
  
  // Export entries to PDF
  const exportMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("GET", "/api/export/journal");
    },
    onSuccess: (data) => {
      // In a real app, this would trigger a download
      // For demo purposes, we'll just show a toast
      toast({
        title: "Journal exported",
        description: "Your journal entries have been exported.",
      });
      console.log("Exported data:", data);
    },
    onError: (error) => {
      console.error("Error exporting journal:", error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting your journal.",
        variant: "destructive",
      });
    },
  });
  
  // Import entries (mock implementation)
  const handleImport = () => {
    // This would be a file upload in a real implementation
    toast({
      title: "Import feature",
      description: "This would open a file picker to import your data.",
    });
  };
  
  // Handle form submission
  const onSubmit = (values: SettingsFormValues) => {
    updateMutation.mutate(values);
  };
  
  // Apply zoom level to the document
  useEffect(() => {
    if (settings?.zoomLevel) {
      document.documentElement.style.fontSize = `${settings.zoomLevel}%`;
    }
    return () => {
      document.documentElement.style.fontSize = ''; // Reset on unmount
    };
  }, [settings?.zoomLevel]);
  
  // Apply color mode to the document
  useEffect(() => {
    if (settings?.colorMode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (settings?.colorMode === "light") {
      document.documentElement.classList.remove("dark");
    } else if (settings?.colorMode === "system") {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings?.colorMode]);
  
  // Apply font size to the document
  useEffect(() => {
    if (settings?.fontSize === "small") {
      document.documentElement.style.setProperty("--base-font-size", "14px");
    } else if (settings?.fontSize === "medium") {
      document.documentElement.style.setProperty("--base-font-size", "16px");
    } else if (settings?.fontSize === "large") {
      document.documentElement.style.setProperty("--base-font-size", "18px");
    }
  }, [settings?.fontSize]);
  
  // Apply background gradient to the document
  useEffect(() => {
    if (settings?.backgroundGradient) {
      document.documentElement.setAttribute("data-gradient", settings.backgroundGradient);
    }
  }, [settings?.backgroundGradient]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      
      <header className="py-6 container">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Customize your journal experience</p>
      </header>
      
      <main className="flex-1 container pb-8">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
            <CardDescription>
              Manage your preferences and account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="data">Import & Export</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <TabsContent value="appearance" className="space-y-6">
                    {/* Color Mode */}
                    <FormField
                      control={form.control}
                      name="colorMode"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-lg font-medium">Display Mode</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              value={field.value}
                              className="flex flex-col md:flex-row gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <Label htmlFor="light" className="flex items-center gap-2">
                                  <Sun className="h-4 w-4" />
                                  Light
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" />
                                <Label htmlFor="dark" className="flex items-center gap-2">
                                  <Moon className="h-4 w-4" />
                                  Dark
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="system" id="system" />
                                <Label htmlFor="system" className="flex items-center gap-2">
                                  <Laptop className="h-4 w-4" />
                                  System
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
                    {/* Background Gradient */}
                    <FormField
                      control={form.control}
                      name="backgroundGradient"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-lg font-medium">Background Gradient</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              value={field.value}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                              {backgroundGradients.map((gradient) => (
                                <div key={gradient} className="flex items-center space-x-2">
                                  <RadioGroupItem value={gradient} id={gradient} />
                                  <Label htmlFor={gradient} className="capitalize flex items-center gap-2">
                                    <div className={`h-4 w-4 rounded-full bg-gradient-${gradient}`} />
                                    {gradient.replace("-", " to ")}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
                    {/* Font Size */}
                    <FormField
                      control={form.control}
                      name="fontSize"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-lg font-medium">Font Size</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              value={field.value}
                              className="flex flex-col md:flex-row gap-4"
                            >
                              {fontSizes.map((size) => (
                                <div key={size} className="flex items-center space-x-2">
                                  <RadioGroupItem value={size} id={size} />
                                  <Label htmlFor={size} className="capitalize">{size}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
                    {/* Zoom Level */}
                    <FormField
                      control={form.control}
                      name="zoomLevel"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-lg font-medium">Zoom Level</FormLabel>
                            <span className="text-sm font-medium">{field.value ?? 100}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={75}
                              max={150}
                              step={5}
                              value={[field.value ?? 100]}
                              onValueChange={(values) => field.onChange(values[0])}
                              className="w-full"
                            />
                          </FormControl>
                          <FormDescription>
                            Adjust the zoom level of the application
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="data" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Export Your Data</h3>
                      <p className="text-muted-foreground">
                        Download all your journal entries as a PDF file that you can save or print.
                      </p>
                      <Button 
                        type="button" 
                        className="bg-[#4A8EC9] text-white"
                        onClick={() => exportMutation.mutate()}
                        disabled={exportMutation.isPending}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {exportMutation.isPending ? "Exporting..." : "Export Journal to PDF"}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Import Data</h3>
                      <p className="text-muted-foreground">
                        Import journal entries from a previously exported file.
                      </p>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleImport}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Import Data
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {activeTab === 'appearance' && (
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-[#4A8EC9] text-white"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? "Saving..." : "Save Settings"}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}