import { useState, useEffect } from "react"
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
import { Loader2 } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ isOpen, onOpenChange }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        onOpenChange(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [onOpenChange])

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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-2xl mb-4">
             Welcome to QR<span className="text-accent">Dyn</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
            <form onSubmit={handleAuth} className="space-y-4">
               {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm text-center">{error}</div>}
               {message && <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-md text-sm text-center">{message}</div>}
               
               <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
               </div>
               
               <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={loading}>
                 {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                 {isSignUp ? "Sign Up" : "Sign In"}
               </Button>
               
               <div className="relative my-6">
                 <div className="absolute inset-0 flex items-center">
                   <span className="w-full border-t border-border" />
                 </div>
                 <div className="relative flex justify-center text-xs uppercase">
                   <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                 </div>
               </div>

               <Button type="button" variant="outline" className="w-full" onClick={handleGoogleAuth}>
                 <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                 Google
               </Button>
               
               <p className="text-center text-sm text-muted-foreground mt-4">
                 {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                 <button 
                   type="button" 
                   onClick={() => setIsSignUp(!isSignUp)} 
                   className="text-accent hover:underline font-medium"
                 >
                   {isSignUp ? "Sign In" : "Sign Up"}
                 </button>
               </p>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
