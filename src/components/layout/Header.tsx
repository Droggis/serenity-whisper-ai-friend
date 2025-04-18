
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const Header = () => {
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
            <nav className="flex flex-col space-y-4">
              <a href="/" className="text-sm font-medium">Home</a>
              <a href="/chat" className="text-sm font-medium">Chat</a>
              <a href="/wellness" className="text-sm font-medium">Wellness</a>
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
          </nav>
        </div>
      </div>
    </header>
  );
};
