import { useState, useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Mail, Lock, LogIn, UserPlus } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AuthModal({ isOpen, onOpenChange, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (isOpen) {
      gsap.from(".auth-content", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1
      })
    }
  }, { scope: modalRef, dependencies: [isOpen, isSignUp] })

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }
    })

    return () => subscription.unsubscribe()
  }, [onOpenChange, onSuccess])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage("Check your email for the confirmation link!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
           provider: 'google',
        })
        if (error) throw error
    } catch (err: any) {
        setError(err.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent ref={modalRef} className="sm:max-w-[420px] p-0 overflow-hidden border-none glass-card shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-accent to-purple-500" />
        
        <div className="p-8 md:p-10 space-y-8">
          <DialogHeader className="space-y-4">
            <div className="auth-content mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
               <Sparkles className="w-6 h-6" />
            </div>
            <DialogTitle className="auth-content text-center font-black text-3xl tracking-tight font-heading">
               {isSignUp ? "Create Account" : "Welcome Back"}
            </DialogTitle>
            <p className="auth-content text-center text-muted-foreground text-sm font-medium">
               {isSignUp ? "Start generating dynamic shortcuts today." : "Sign in to manage your premium shortcuts."}
            </p>
          </DialogHeader>

          <div className="space-y-6">
              <form onSubmit={handleAuth} className="space-y-5">
                 {error && <div className="auth-content p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-bold uppercase tracking-widest text-center animate-shake">{error}</div>}
                 {message && <div className="auth-content p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-xs font-bold uppercase tracking-widest text-center">{message}</div>}
                 
                 <div className="auth-content space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</Label>
                    <div className="relative">
                       <Input 
                         id="email" 
                         type="email" 
                         placeholder="name@company.com" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         required 
                         className="h-12 bg-background/50 border-border/40 rounded-xl pl-11 focus:ring-2 focus:ring-primary/20 transition-all"
                       />
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    </div>
                 </div>
                 <div className="auth-content space-y-2">
                    <Label htmlFor="password" dir="ltr" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Secure Password</Label>
                    <div className="relative">
                       <Input 
                         id="password" 
                         type="password" 
                         placeholder="••••••••" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         required 
                         className="h-12 bg-background/50 border-border/40 rounded-xl pl-11 focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                       />
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    </div>
                 </div>
                 
                 <Button type="submit" className="auth-content w-full h-12 bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl shadow-lg shadow-primary/20 font-bold" disabled={loading}>
                   {loading ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                   ) : (
                     <span className="flex items-center gap-2">
                       {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                       {isSignUp ? "Generate Account" : "Access Console"}
                     </span>
                   )}
                 </Button>
                 
                 <div className="relative my-8">
                   <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t border-border/50" />
                   </div>
                   <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                     <span className="bg-background px-4 text-muted-foreground/60">Secure Access</span>
                   </div>
                 </div>

                 <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-border/50 hover:bg-muted font-bold transition-all" onClick={handleGoogleAuth}>
                   <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                   </svg>
                   Identity via Google
                 </Button>
                 
                 <p className="text-center text-sm font-medium text-muted-foreground pt-2">
                   {isSignUp ? "Already a member?" : "New to the engine?"}{" "}
                   <button 
                     type="button" 
                     onClick={() => setIsSignUp(!isSignUp)} 
                     className="text-primary hover:underline font-bold"
                   >
                     {isSignUp ? "Sign In" : "Create Account"}
                   </button>
                 </p>
              </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

