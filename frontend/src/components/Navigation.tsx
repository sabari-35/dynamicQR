import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Scan, LayoutDashboard, PlusCircle, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthModal } from "@/components/AuthModal"

export default function Navigation() {
  const [session, setSession] = useState<any>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="w-full border-b backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Scan className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">QR<span className="text-accent">Dyn</span></span>
        </Link>

        {session ? (
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="hidden sm:flex items-center space-x-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link to="/create">
              <Button className="hidden sm:flex items-center space-x-2 bg-accent hover:bg-accent/90">
                <PlusCircle className="w-4 h-4" />
                <span>Create QR</span>
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="rounded-full">
                    <img 
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${session.user.email}`} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full border"
                    />
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setIsAuthOpen(true)}>Sign In</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setIsAuthOpen(true)}>Get Started</Button>
            <AuthModal isOpen={isAuthOpen} onOpenChange={setIsAuthOpen} />
          </div>
        )}
      </div>
    </nav>
  )
}
