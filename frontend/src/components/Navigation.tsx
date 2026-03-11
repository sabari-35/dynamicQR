import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Scan, LayoutDashboard, PlusCircle, LogOut, Menu, X, Rocket, CreditCard, Sparkles } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { AuthModal } from "@/components/AuthModal"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export default function Navigation() {
  const [session, setSession] = useState<any>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    })
  }, { scope: navRef })

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
    setIsMobileMenuOpen(false)
  }

  const NavItems = () => (
    <>
      <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
        <Button variant="ghost" className={cn("w-full justify-start sm:w-auto", location.pathname === "/pricing" && "bg-accent/10 text-accent")}>
          <CreditCard className="w-4 h-4 mr-2" />
          Pricing
        </Button>
      </Link>
      {session && (
        <>
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className={cn("w-full justify-start sm:w-auto", location.pathname === "/dashboard" && "bg-accent/10 text-accent")}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link to="/create" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full justify-start sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground group">
              <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              Create QR
            </Button>
          </Link>
        </>
      )}
    </>
  )

  return (
    <nav ref={navRef} className="w-full border-b backdrop-blur-xl bg-background/60 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Scan className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight font-heading">
            QR<span className="text-primary italic">Dyn</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <NavItems />
          
          {session ? (
            <div className="flex items-center pl-4 border-l ml-4 h-8 border-border/50 gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-2xl ring-offset-background hover:ring-2 hover:ring-primary/20 transition-all p-0">
                    <div className="relative">
                      <img 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${session.user.email}`} 
                        alt="Avatar" 
                        className="w-9 h-9 rounded-2xl border-2 border-background shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card p-2 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">{session.user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground flex items-center">
                        <Sparkles className="w-3 h-3 mr-1 text-accent" />
                        Free Plan
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3 ml-4">
              <Button variant="ghost" className="font-medium" onClick={() => setIsAuthOpen(true)}>
                Sign In
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-2xl shadow-xl shadow-primary/20" onClick={() => setIsAuthOpen(true)}>
                Get Started
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          {!session && (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground size-10 p-0 rounded-2xl shadow-lg" onClick={() => setIsAuthOpen(true)}>
              <Rocket className="w-5 h-5" />
            </Button>
          )}
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl border border-border/50 bg-background/50">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[350px] p-6 glass border-l-0">
              <SheetHeader className="text-left mb-8">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary text-primary-foreground p-1.5 rounded-xl">
                    <Scan className="w-5 h-5" />
                  </div>
                  <SheetTitle className="font-bold text-2xl tracking-tight">
                    QR<span className="text-primary italic">Dyn</span>
                  </SheetTitle>
                </div>
              </SheetHeader>
              
              <div className="flex flex-col space-y-4">
                <NavItems />
                
                {session && (
                  <>
                    <div className="h-px bg-border/50 my-4" />
                    <div className="flex items-center space-x-3 p-2 bg-muted/30 rounded-2xl border border-border/50">
                      <img 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${session.user.email}`} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-2xl border bg-background"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{session.user.email}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Sparkles className="w-3 h-3 mr-1 text-accent" />
                          Free Plan
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <AuthModal isOpen={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </nav>
  )
}
