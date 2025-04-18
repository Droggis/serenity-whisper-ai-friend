import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { WellnessTracker } from "@/components/wellness/WellnessTracker";
import { AuthForms } from "@/components/auth/AuthForms";
import { useAuth } from "@/contexts/AuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GamesInterface } from "@/components/games/GamesInterface";
import { DiaryEntry } from "@/components/diary/DiaryEntry";
import { HealthTips } from "@/components/wellness/HealthTips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Activity, Gamepad2, Book, Heart } from "lucide-react";

const AuthenticatedContent = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-5xl font-bold mb-4 gradient-text">
          Serenity+
        </h1>
        <p className="text-xl text-serenity-text/70 max-w-2xl mx-auto">
          Your compassionate AI companion for holistic mental wellness and personal growth
        </p>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto bg-white/30 backdrop-blur-sm rounded-full border border-white/20 shadow-soft">
          {[
            { value: "chat", icon: MessageSquare, label: "Chat" },
            { value: "wellness", icon: Activity, label: "Wellness" },
            { value: "games", icon: Gamepad2, label: "Games" },
            { value: "diary", icon: Book, label: "Journal" },
            { value: "tips", icon: Heart, label: "Health Tips" }
          ].map(({ value, icon: Icon, label }) => (
            <TabsTrigger 
              key={value} 
              value={value} 
              className="flex items-center gap-2 hover-lift data-[state=active]:bg-serenity-primary/10 rounded-full"
            >
              <Icon className="h-4 w-4 text-serenity-primary" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {[
          { value: "chat", component: <ChatInterface /> },
          { value: "wellness", component: <WellnessTracker /> },
          { value: "games", component: <GamesInterface /> },
          { value: "diary", component: <DiaryEntry /> },
          { value: "tips", component: <HealthTips /> }
        ].map(({ value, component }) => (
          <TabsContent 
            key={value} 
            value={value} 
            className="mt-6 glass-card p-6 animate-fade-in-up"
          >
            {component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const UnauthenticatedContent = () => {
  return (
    <div className="container mx-auto px-4 py-6 min-h-screen flex items-center">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div className="space-y-6 animate-fade-in-up">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Welcome to Serenity+
          </h1>
          <div className="space-y-4 text-lg text-serenity-text/80">
            {[
              "Personalized AI mental wellness companion",
              "Track your mood and wellness metrics",
              "Engage in therapeutic games and activities",
              "Daily journal and reflection space",
              "Expert health and wellness tips"
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 hover-lift bg-white/50 p-3 rounded-xl"
              >
                <span className="bg-serenity-primary text-white p-1 rounded-full">✓</span>
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-8 shadow-elegant animate-fade-in-up">
          <AuthForms />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-serenity-background">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-serenity-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Serenity+...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-serenity-background">
      <Header />
      <main>
        {user ? <AuthenticatedContent /> : <UnauthenticatedContent />}
      </main>
    </div>
  );
};

const IndexWithAuth = () => (
  <AuthProvider>
    <Index />
  </AuthProvider>
);

export default IndexWithAuth;
