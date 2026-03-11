import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AuthModal } from "@/components/AuthModal"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <div className="w-full flex-col min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background/90 to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-4xl text-center space-y-6">
        <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 leading-tight"
        >
          Dynamic QR Codes for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Modern SaaS Platforms</span>
        </motion.h1>
        
        <motion.p 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="text-xl md:text-2xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto"
        >
          Create, manage, and track powerful dynamic QR codes. Change the destination link anytime after printing, gather unparalleled analytics, and customize your designs.
        </motion.p>
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.4 }}
           className="flex items-center justify-center space-x-6"
        >
           <Button 
             size="lg" 
             onClick={() => setIsAuthOpen(true)}
             className="h-14 px-8 text-lg bg-accent text-white hover:bg-accent/90 shadow-[0_0_30px_-5px_var(--accent)] hover:shadow-[0_0_40px_-5px_var(--accent)] transition-all"
           >
             Start Generating Free
           </Button>
           <Link to="/pricing">
             <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2">
               View Pricing
             </Button>
           </Link>
        </motion.div>
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 blur-[120px] rounded-full point-events-none -z-10" />
      
      <AuthModal isOpen={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
  )
}
