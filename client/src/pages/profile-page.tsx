import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Header from '@/components/layout/header';
import BottomNav from '@/components/layout/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
// DatePicker n'est plus utilisé, nous utilisons un input date standard
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Save, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // We'll mock these values for now - in a real app, they would come from the API
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: '',
    occupation: '',
    notificationEnabled: true,
    sleepGoal: '8',
    stressLevel: 'medium',
    birthdate: null as Date | null,
    musicPreference: 'pop',
    activityPreference: 'outdoor',
    inspirationalQuotes: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, birthdate: date }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // In a real app, this would call an API to update user profile
    setTimeout(() => {
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées avec succès.',
      });
      setIsSaving(false);
    }, 1000);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (!user) {
    return <div>Chargement...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Profil Utilisateur</h1>
            <p className="text-gray-600">
              Complétez votre profil pour obtenir des recommandations plus personnalisées.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-primary text-white text-3xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-semibold text-center">{user.name}</CardTitle>
                <p className="text-sm text-center text-gray-500">{user.email}</p>
                <div className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {user.gender === 'female' ? 'Femme' : 'Homme'}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Complétude du profil</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Profile Form Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Settings className="mr-2 h-5 w-5" /> Paramètres du Profil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Âge</Label>
                      <Input 
                        id="age" 
                        name="age" 
                        type="number" 
                        placeholder="Votre âge" 
                        value={formData.age} 
                        onChange={handleChange} 
                        min="1" 
                        max="120" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Profession</Label>
                      <Input 
                        id="occupation" 
                        name="occupation" 
                        placeholder="Votre profession" 
                        value={formData.occupation} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Date de naissance</Label>
                      <div className="mt-1">
                        <input 
                          type="date" 
                          id="birthdate"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            handleDateChange(date);
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sleepGoal">Objectif de sommeil (heures)</Label>
                      <Select 
                        value={formData.sleepGoal} 
                        onValueChange={(value) => handleSelectChange('sleepGoal', value)}
                      >
                        <SelectTrigger id="sleepGoal">
                          <SelectValue placeholder="Choisir un objectif" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 heures</SelectItem>
                          <SelectItem value="7">7 heures</SelectItem>
                          <SelectItem value="8">8 heures</SelectItem>
                          <SelectItem value="9">9 heures</SelectItem>
                          <SelectItem value="10">10 heures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stressLevel">Niveau de stress habituel</Label>
                    <Select 
                      value={formData.stressLevel} 
                      onValueChange={(value) => handleSelectChange('stressLevel', value)}
                    >
                      <SelectTrigger id="stressLevel">
                        <SelectValue placeholder="Choisir un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyen</SelectItem>
                        <SelectItem value="high">Élevé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="notificationEnabled" 
                      checked={formData.notificationEnabled} 
                      onCheckedChange={(checked) => handleSwitchChange('notificationEnabled', checked)} 
                    />
                    <Label htmlFor="notificationEnabled">Activer les notifications quotidiennes</Label>
                  </div>
                  
                  <h3 className="text-lg font-medium my-4">Préférences de recommandations</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="musicPreference">Préférence musicale</Label>
                      <Select 
                        value={formData.musicPreference} 
                        onValueChange={(value) => handleSelectChange('musicPreference', value)}
                      >
                        <SelectTrigger id="musicPreference">
                          <SelectValue placeholder="Choisir un style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="classical">Classique</SelectItem>
                          <SelectItem value="electronic">Électronique</SelectItem>
                          <SelectItem value="ambient">Ambient / Relaxation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="activityPreference">Activités préférées</Label>
                      <Select 
                        value={formData.activityPreference}
                        onValueChange={(value) => handleSelectChange('activityPreference', value)}
                      >
                        <SelectTrigger id="activityPreference">
                          <SelectValue placeholder="Choisir un type d'activité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outdoor">Plein air</SelectItem>
                          <SelectItem value="creative">Créatives</SelectItem>
                          <SelectItem value="sport">Sportives</SelectItem>
                          <SelectItem value="relaxation">Relaxation</SelectItem>
                          <SelectItem value="social">Sociales</SelectItem>
                          <SelectItem value="intellectual">Intellectuelles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="inspirationalQuotes" 
                        checked={formData.inspirationalQuotes || false} 
                        onCheckedChange={(checked) => handleSwitchChange('inspirationalQuotes', checked)} 
                      />
                      <Label htmlFor="inspirationalQuotes">Recevoir des citations inspirantes</Label>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Enregistrer les modifications
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <BottomNav activeTab="settings" />
    </div>
  );
}