import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, Shield, Crown } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export default function Pricing() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(".pricing-header", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .from(".pricing-card", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power4.out"
    }, "-=0.4")
  }, { scope: containerRef })

  const plans = [
    {
      name: "Standard",
      price: "$0",
      description: "For individuals exploring the dynamic shortcut ecosystem.",
      features: ["5 Dynamic Shortcuts", "Standard Redirections", "Basic Visual Analytics", "Community Access"],
      icon: <Zap className="w-6 h-6" />,
      cta: "Initialize Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/mo",
      description: "Optimized for scaling businesses and high-traffic campaigns.",
      features: ["Unlimited Dynamic Shortcuts", "Ultra-Low Latency Ops", "Deep Intent Analytics", "Priority Console Access", "Custom Design Tokens"],
      icon: <Crown className="w-6 h-6" />,
      cta: "Access Pro Engine",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Mission-critical infrastructure for large scale operations.",
      features: ["Global Multi-Region Routing", "API & SDK Integration", "Custom Domain Mapping", "dedicated Architecture Support", "SLA Guarantees"],
      icon: <Shield className="w-6 h-6" />,
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <div className="w-full bg-mesh min-h-screen" ref={containerRef}>
      <div className="container py-24 md:py-32 mx-auto px-4 md:px-8 max-w-7xl space-y-20">
        <div className="pricing-header text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Value Propositions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight font-heading leading-tight">
            Predictable <span className="text-gradient">Pricing</span> <br/> for Limitless Scale
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Architect your shortcut strategy with precision engineering and transparent tiers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`pricing-card group relative p-10 glass-card border-none shadow-2xl flex flex-col transition-all duration-500 hover:translate-y-[-10px] ${plan.popular ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2">
                   <div className="bg-primary text-primary-foreground text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                      Top Choice
                   </div>
                </div>
              )}
              
              <div className="mb-8 space-y-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${plan.popular ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors'}`}>
                   {plan.icon}
                </div>
                <div>
                   <h3 className="text-2xl font-black tracking-tight font-heading">{plan.name}</h3>
                   <div className="mt-4 flex items-baseline gap-1">
                     <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                     {plan.period && <span className="text-xl font-bold text-muted-foreground">{plan.period}</span>}
                   </div>
                   <p className="mt-4 text-muted-foreground text-sm font-medium leading-relaxed">{plan.description}</p>
                </div>
              </div>

              <div className="h-px w-full bg-border/40 mb-8" />

              <ul className="flex-1 space-y-5 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm">
                    <Check className={`h-5 w-5 ${plan.popular ? 'text-primary' : 'text-primary/60'} shrink-0 mr-3 mt-0.5`} />
                    <span className="font-medium opacity-80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${plan.popular ? 'bg-primary text-primary-foreground hover:scale-[1.03] shadow-xl shadow-primary/20' : 'bg-muted/50 hover:bg-primary hover:text-white'}`} 
                variant={plan.popular ? 'default' : 'ghost'}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 md:p-12 rounded-3xl glass-card border-none bg-gradient-to-br from-background/40 to-muted/20 text-center space-y-6">
           <h3 className="text-2xl font-bold">Need something more tailored?</h3>
           <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
             Our solutions architects are available to design custom implementation strategies for complex enterprise requirements.
           </p>
           <Button variant="outline" className="h-12 px-10 rounded-xl font-bold border-border/50 hover:bg-muted">
              Consult an Architect
           </Button>
        </div>
      </div>
    </div>
  )
}

