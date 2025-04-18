
import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { WellnessTracker } from "@/components/wellness/WellnessTracker";
import { AuthForms } from "@/components/auth/AuthForms";
import { useAuth } from "@/contexts/AuthContext";
import { AuthProvider } from "@/contexts/AuthContext";

const AuthenticatedContent = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
          Welcome to Serenity+
        </h1>
        <p className="text-xl text-muted-foreground">
          Your AI companion for mental wellness and support
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Chat with Serenity</h2>
          <ChatInterface />
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Wellness Tracker</h2>
          <WellnessTracker />
        </section>
      </div>
    </div>
  );
};

const UnauthenticatedContent = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
          Welcome to Serenity+
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          Your AI companion for mental wellness and support. Sign in to track your wellness journey and get personalized support.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Join Serenity+</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mr-2">✓</span>
              <span>Chat with our AI wellness companion</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mr-2">✓</span>
              <span>Track your mood and wellness metrics</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mr-2">✓</span>
              <span>Get daily wellness tips and inspiration</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mr-2">✓</span>
              <span>Practice daily gratitude and reflection</span>
            </li>
          </ul>
        </div>
        
        <div>
          <AuthForms />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Serenity+...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {user ? <AuthenticatedContent /> : <UnauthenticatedContent />}
      </main>
    </div>
  );
};

// Wrap component with AuthProvider to ensure auth context is available
const IndexWithAuth = () => (
  <AuthProvider>
    <Index />
  </AuthProvider>
);

export default IndexWithAuth;
