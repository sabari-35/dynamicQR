import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/AuthModal"
import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { QRCodeSVG } from "qrcode.react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { 
  BarChart3, 
  RefreshCcw, 
  Zap, 
  ShieldCheck, 
  Globe, 
  ArrowRight,
  Sparkles,
  Smartphone,
  Layout
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const navigate = useNavigate()
  const [session, setSession] = useState<any>(null)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const qrrRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  useGSAP(() => {
    // Hero Entrance
    const tl = gsap.timeline()
    tl.from(".hero-text", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power4.out"
    })
    .from(qrrRef.current, {
      scale: 0.5,
      opacity: 0,
      rotateX: -45,
      rotateY: 45,
      duration: 1.5,
      ease: "elastic.out(1, 0.7)"
    }, "-=1")
    .to(qrrRef.current, {
      y: 20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    // Scroll Animations
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    })
  }, { scope: heroRef })

  const handleStartFree = () => {
    if (session) navigate('/create')
    else setIsAuthOpen(true)
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-mesh" ref={heroRef}>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden px-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left space-y-8 max-w-3xl">
            <div className="hero-text inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Dynamic QR Engine</span>
            </div>
            
            <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
              Engage your <br />
              <span className="text-gradient">Audience</span> like <br />
              never before.
            </h1>
            
            <p className="hero-text text-xl md:text-2xl text-muted-foreground font-light max-w-2xl">
              Create dynamic QR codes that adapt in real-time. Update links instantly, track performance, and deliver premium experiences across any device.
            </p>
            
            <div className="hero-text flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={handleStartFree}
                className="h-16 px-10 text-xl bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-105"
              >
                Start Generating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="h-16 px-10 text-xl rounded-2xl border-2 hover:bg-muted/50 transition-all">
                  View Plans
                </Button>
              </Link>
            </div>

            <div className="hero-text flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all">
               <div className="flex items-center gap-2 font-bold"><Globe className="w-5 h-5" /> GLOBAL</div>
               <div className="flex items-center gap-2 font-bold"><Zap className="w-5 h-5" /> FAST</div>
               <div className="flex items-center gap-2 font-bold"><ShieldCheck className="w-5 h-5" /> SECURE</div>
            </div>
          </div>

          <div className="flex-1 relative perspective-1000">
             <div 
               ref={qrrRef}
               className="relative z-10 p-8 glass-card backdrop-blur-3xl border-white/20 shadow-[0_0_100px_-20px_rgba(139,92,246,0.3)] animate-float"
             >
                <div className="bg-white p-6 rounded-3xl shadow-inner relative overflow-hidden group">
                   <QRCodeSVG 
                     value="https://qrdyn.vercel.app" 
                     size={280} 
                     level="H" 
                     className="relative z-10 transition-transform duration-700 group-hover:scale-95"
                   />
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                </div>
                <div className="mt-6 text-center space-y-1">
                   <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Live Dynamic Sample</p>
                   <p className="text-xs text-muted-foreground">Scan me or update below</p>
                </div>
             </div>
             
             {/* Decorative Background Elements */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/20 blur-[120px] rounded-full pointer-events-none -z-10" />
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-muted/30" ref={featuresRef}>
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Enterprise Features <span className="text-primary italic">built-in</span></h2>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to manage your QR ecosystem at scale, with precision and speed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
               icon={<RefreshCcw />}
               title="Dynamic Redirection"
               description="Change the destination URL anytime, even after the QR code is printed. Never waste a brochure again."
            />
            <FeatureCard 
               icon={<BarChart3 />}
               title="Deep Analytics"
               description="Track scans by location, device type, OS, and time. Understand your audience with granular data."
            />
            <FeatureCard 
               icon={<Zap />}
               title="Lightning Fast"
               description="High-availability global edge redirects ensure your users never wait. Powered by a world-class infrastructure."
            />
            <FeatureCard 
               icon={<Smartphone />}
               title="Mobile Optimized"
               description="Scan experiences that look beautiful on every device. Responsive by default, premium by design."
            />
            <FeatureCard 
               icon={<ShieldCheck />}
               title="Secure & Private"
               description="GDPR compliant tracking, password protection options, and enterprise-grade security for your links."
            />
            <FeatureCard 
               icon={<Layout />}
               title="Smart Folders"
               description="Organize your QR codes into folders and campaigns. Perfect for managing multiple clients or products."
            />
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthOpen} onOpenChange={setIsAuthOpen} onSuccess={() => navigate('/create')} />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="feature-card glass-card p-8 group hover:border-primary/50 transition-all duration-300">
       <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
          {icon}
       </div>
       <h3 className="text-xl font-bold mb-3">{title}</h3>
       <p className="text-muted-foreground leading-relaxed">
          {description}
       </p>
    </div>
  )
}
