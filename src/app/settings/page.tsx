"use client";

import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AppSettings {
  username: string;
  preferredAIModel: string;
  enableNotifications: boolean;
}

const defaultSettings: AppSettings = {
  username: 'User',
  preferredAIModel: 'gemini-pro', // Updated default
  enableNotifications: true,
};

// export const metadata = { // Cannot set metadata directly in client component
//   title: 'Settings - PromptNin',
//   description: 'Customize your PromptNin experience. Settings are saved locally.',
// };

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('promptnin-settings', defaultSettings); // Updated key
  const { toast } = useToast();

  // Local form state to avoid updating localStorage on every keystroke
  const [localUsername, setLocalUsername] = useState(settings.username);
  const [localPreferredAIModel, setLocalPreferredAIModel] = useState(settings.preferredAIModel);
  const [localEnableNotifications, setLocalEnableNotifications] = useState(settings.enableNotifications);

  // Sync local state if localStorage changes (e.g., from another tab, though unlikely for this app)
  useEffect(() => {
    setLocalUsername(settings.username);
    setLocalPreferredAIModel(settings.preferredAIModel);
    setLocalEnableNotifications(settings.enableNotifications);
  }, [settings]);

  useEffect(() => {
    // Update document title for client components if needed
    document.title = 'Settings - PromptNin';
  }, []);


  const handleSaveSettings = () => {
    setSettings({
      username: localUsername,
      preferredAIModel: localPreferredAIModel,
      enableNotifications: localEnableNotifications,
    });
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated.',
      duration: 3000,
    });
  };
  
  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setLocalUsername(defaultSettings.username);
    setLocalPreferredAIModel(defaultSettings.preferredAIModel);
    setLocalEnableNotifications(defaultSettings.enableNotifications);
    toast({
      title: 'Settings Reset',
      description: 'Preferences have been reset to default values.',
      variant: 'default',
      duration: 3000,
    });
  };


  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Configuration Settings</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Customize your PromptNin experience. Settings are saved locally in your browser.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
          <CardDescription>Manage your personal settings for the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={localUsername} 
              onChange={(e) => setLocalUsername(e.target.value)} 
              placeholder="Enter your username" 
            />
            <p className="text-xs text-muted-foreground">This name might be used for personalized experiences in the future.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="preferredAIModel">Preferred AI Model</Label>
            <Input 
              id="preferredAIModel" 
              value={localPreferredAIModel} 
              onChange={(e) => setLocalPreferredAIModel(e.target.value)} 
              placeholder="e.g., gemini-pro, gpt-4" 
            />
            <p className="text-xs text-muted-foreground">Specify your preferred AI model (for reference, not yet functional for generation).</p>
          </div>
          
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="enableNotifications" className="text-base">Enable Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive in-app notifications for actions like copying prompts.
              </p>
            </div>
            <Switch
              id="enableNotifications"
              checked={localEnableNotifications}
              onCheckedChange={setLocalEnableNotifications}
              aria-label="Toggle notifications"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleSaveSettings} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
             <Button onClick={handleResetSettings} variant="outline" className="w-full sm:w-auto">
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
