
import { useState } from "react";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { ApiKeySettings } from "@/components/settings/ApiKeySettings";

export const Header = () => {
  const { user, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="flex flex-col space-y-4 mt-8">
              <a href="/" className="text-sm font-medium">Home</a>
              <a href="/chat" className="text-sm font-medium">Chat</a>
              <a href="/wellness" className="text-sm font-medium">Wellness</a>
              <a href="/resources" className="text-sm font-medium">Resources</a>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">Serenity+</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium">Home</a>
            <a href="/chat" className="text-sm font-medium">Chat</a>
            <a href="/wellness" className="text-sm font-medium">Wellness</a>
            <a href="/resources" className="text-sm font-medium">Resources</a>
          </nav>
          <div className="flex items-center space-x-2">
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <ApiKeySettings />
                </div>
              </DialogContent>
            </Dialog>
            
            {user ? (
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
                <span className="text-sm hidden md:inline">
                  {user.name || user.email}
                </span>
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="default" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
