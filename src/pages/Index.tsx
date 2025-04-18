
import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { WellnessTracker } from "@/components/wellness/WellnessTracker";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
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
      </main>
    </div>
  );
};

export default Index;
