import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Link2, LayoutTemplate, Settings2, Loader2, Sparkles, ArrowRight, Smartphone, Layout, Palette, ShieldCheck, Zap } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export default function CreateQR() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    destination_url: '',
    campaign_id: '',
  })

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(".form-header", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .from(".tabs-nav", {
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .from(previewRef.current, {
      x: 50,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    }, "-=0.6")
  }, { scope: formRef })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.destination_url) {
      toast.error('Please fill in all required fields.')
      return
    }

    try {
      setLoading(true)
      const payload: any = { ...formData }
      if (!payload.campaign_id) {
          delete payload.campaign_id
      }
      
      await api.post('/qr/', payload)
      toast.success('Dynamic QR Code created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error(error)
      const detail = error.response?.data?.detail
      if (typeof detail === 'string') {
          toast.error(detail)
      } else if (Array.isArray(detail)) {
          toast.error(`Validation Error: ${detail[0]?.msg}`)
      } else {
          toast.error('Failed to create QR code')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-mesh min-h-screen" ref={formRef}>
      <div className="container mx-auto p-4 md:p-8 max-w-7xl py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Main Form Area */}
          <div className="flex-1 space-y-10">
            <div className="form-header space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Campaign</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight font-heading">Design your <span className="text-gradient">Dynamic</span> Shortcut</h1>
              <p className="text-muted-foreground text-lg max-w-2xl">Configure your destination logic and customize tracking parameters for your next campaign.</p>
            </div>
            
            <Tabs defaultValue="content" className="w-full tabs-nav">
              <TabsList className="grid w-full grid-cols-3 mb-10 h-14 glass-card p-1.5 rounded-2xl">
                <TabsTrigger value="content" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
                  <Link2 className="w-4 h-4 mr-2"/> Destination
                </TabsTrigger>
                <TabsTrigger value="design" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
                  <Palette className="w-4 h-4 mr-2"/> Design
                </TabsTrigger>
                <TabsTrigger value="advanced" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
                  <ShieldCheck className="w-4 h-4 mr-2"/> Rules
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="focus:outline-none">
                <Card className="glass-card border-none shadow-2xl p-4 md:p-6">
                  <CardHeader className="px-1 md:px-0">
                    <CardTitle className="text-2xl font-bold font-heading">Asset Content</CardTitle>
                    <CardDescription className="text-md">Enter the primary destination for your dynamic QR code.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 px-1 md:px-0 pt-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Asset Identity <span className="text-primary">*</span></Label>
                      <Input 
                          id="name" 
                          name="name"
                          placeholder="e.g. Summer Sale 2026 Flyer" 
                          value={formData.name}
                          onChange={handleChange}
                          className="h-14 bg-background/40 border-border/30 rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="destination_url" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Redirect Destination <span className="text-primary">*</span></Label>
                      <Input 
                          id="destination_url" 
                          name="destination_url"
                          placeholder="https://example.com/summer-sale" 
                          type="url"
                          value={formData.destination_url}
                          onChange={handleChange}
                          className="h-14 bg-background/40 border-border/30 rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="design" className="focus:outline-none">
                 <Card className="glass-card border-none shadow-2xl p-10 text-center">
                    <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                       <Palette className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading mb-3">Custom Theming</h3>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">Upload logos, define custom colors, and select eye patterns to match your brand identity.</p>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-muted text-sm font-semibold">
                       <LayoutTemplate className="w-4 h-4" />
                       <span>Coming in v2.1</span>
                    </div>
                 </Card>
              </TabsContent>

              <TabsContent value="advanced" className="focus:outline-none">
                 <Card className="glass-card border-none shadow-2xl p-10 text-center">
                    <div className="w-20 h-20 bg-accent/5 rounded-3xl flex items-center justify-center text-accent mx-auto mb-6">
                       <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading mb-3">Conditional Logic</h3>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">Configure expiration dates, password protection, and geographic redirection rules.</p>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-muted text-sm font-semibold">
                       <Settings2 className="w-4 h-4" />
                       <span>Pro Plan Required</span>
                    </div>
                 </Card>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30">
               <button onClick={() => navigate('/dashboard')} className="text-muted-foreground font-bold hover:text-foreground transition-colors px-4 py-3">
                  Dismiss Draft
               </button>
               <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="w-full sm:w-auto h-16 px-10 text-xl bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
               >
                  {loading ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      Deploy QR Campaign
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </>
                  )}
               </Button>
            </div>
          </div>

          {/* Live Preview Pane */}
          <div className="w-full lg:w-[450px]" ref={previewRef}>
             <div className="glass-card rounded-[2.5rem] p-10 lg:sticky lg:top-32 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-purple-500 opacity-50" />
                
                <h3 className="font-black text-2xl font-heading tracking-tight flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-primary" />
                   Real-time Preview
                </h3>
                
                <div className="relative group perspective-1000">
                  <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:rotate-x-12 group-hover:rotate-y-12 shadow-primary/20 border-8 border-background/5">
                     {formData.destination_url ? (
                        <QRCodeSVG 
                           value={formData.destination_url}
                           size={220}
                           level="H"
                           className="relative z-10 p-2"
                        />
                     ) : (
                        <div className="p-12 space-y-4 opacity-30 flex flex-col items-center">
                           <Layout className="w-16 h-16" />
                           <p className="text-sm font-bold uppercase tracking-widest text-center">Waiting for destination...</p>
                        </div>
                     )}
                  </div>
                  <div className="absolute -inset-4 bg-primary/5 blur-3xl -z-10 rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    This preview shows the standard premium design. Your dynamic shortcut will be active instantly upon deployment.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-2">
                     <div className="flex flex-col items-center gap-1">
                        <span className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                           <ShieldCheck className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Safe</span>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                           <Zap className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Fast</span>
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
