import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  Palette, 
  ShieldCheck, 
  Zap, 
  ArrowLeft 
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { TypeSelector } from '@/components/TypeSelector'
import { AdvancedStyling } from '@/components/AdvancedStyling'
import { FileUpload } from '@/components/FileUpload'

export default function CreateQR() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Type Select, 2: Content & Design
  const [selectedType, setSelectedType] = useState('website')
  
  const formRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    destination_url: '',
    campaign_id: '',
  })
  
  const [designSettings, setDesignSettings] = useState({
    dotsOptions: { type: 'rounded', color: '#000000' },
    cornersSquareOptions: { type: 'extra-rounded', color: '#000000' },
    cornersDotOptions: { type: 'dot', color: '#000000' },
    backgroundOptions: { color: '#ffffff' }
  })

  useGSAP(() => {
    gsap.from(".create-animate", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    })
  }, [step])

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
      const payload: any = { 
        ...formData, 
        qr_type: selectedType,
        qr_design_settings: designSettings 
      }
      if (!payload.campaign_id) delete payload.campaign_id
      
      await api.post('/qr/', payload)
      toast.success('Dynamic QR Code created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error('Failed to create QR code')
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="w-full bg-mesh min-h-screen py-12 md:py-20">
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
          <div className="space-y-12">
            <div className="create-animate space-y-4 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 1 of 2</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight font-heading leading-tight">Create your <span className="text-gradient">Premium</span> QR</h1>
              <p className="text-muted-foreground text-xl">Select the type of dynamic code you want to generate. You can change the destination anytime.</p>
            </div>
            
            <div className="create-animate">
              <TypeSelector selectedType={selectedType} onSelect={(type) => {
                setSelectedType(type)
                setStep(2)
              }} />
            </div>

            <div className="create-animate pt-12 flex justify-center">
               <div className="glass-card px-8 py-4 rounded-2xl flex items-center gap-6 border-none shadow-xl">
                  <div className="flex -space-x-3">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center">
                           <Zap className="w-4 h-4 text-primary" />
                        </div>
                     ))}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Join 2,000+ creators generating ultra-fast dynamic codes.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-mesh min-h-screen py-12 md:py-20" ref={formRef}>
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="flex-1 space-y-10">
            <div className="create-animate space-y-4">
              <Button 
                variant="ghost" 
                onClick={() => setStep(1)}
                className="group text-muted-foreground hover:text-foreground p-0 hover:bg-transparent -ml-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Select different type
              </Button>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading">Configure & <span className="text-gradient">Style</span></h2>
                <p className="text-muted-foreground text-lg">Define the destination and apply high-end visual patterns to your {selectedType} QR.</p>
              </div>
            </div>
            
            <Tabs defaultValue="content" className="w-full create-animate">
              <TabsList className="grid w-full grid-cols-2 mb-10 h-14 glass-card p-1.5 rounded-2xl">
                <TabsTrigger value="content" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                   Destination
                </TabsTrigger>
                <TabsTrigger value="design" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Palette className="w-4 h-4 mr-2"/> Advanced Styling
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="focus:outline-none">
                <Card className="glass-card border-none shadow-2xl p-6 md:p-10">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl font-bold font-heading uppercase tracking-widest text-primary/80">Redirection Logic</CardTitle>
                    <CardDescription className="text-lg">Where should this dynamic shortcut lead your audience?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 px-0 pt-8 border-t border-border/30">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Internal Name *</Label>
                      <Input 
                          id="name" 
                          name="name"
                          placeholder="Summer Sale Campaign 2026" 
                          value={formData.name}
                          onChange={handleChange}
                          className="h-14 bg-background/40 border-border/30 rounded-2xl px-6 text-lg font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="destination_url" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {['pdf', 'video', 'images', 'mp3'].includes(selectedType) ? 'Upload Media File *' : 'Target URL *'}
                      </Label>
                      {['pdf', 'video', 'images', 'mp3'].includes(selectedType) ? (
                         <FileUpload 
                            onUploadComplete={(url) => setFormData(prev => ({ ...prev, destination_url: url }))}
                            accept={selectedType === 'pdf' ? '.pdf' : selectedType === 'video' ? 'video/*' : selectedType === 'images' ? 'image/*' : selectedType === 'mp3' ? 'audio/mpeg' : '*/*'}
                            label={`Upload ${selectedType.toUpperCase()}`}
                         />
                      ) : (
                         <Input 
                             id="destination_url" 
                             name="destination_url"
                             placeholder="https://your-brand.com/landing" 
                             type="url"
                             value={formData.destination_url}
                             onChange={handleChange}
                             className="h-14 bg-background/40 border-border/30 rounded-2xl px-6 text-lg font-medium"
                         />
                      )}
                      <div className="flex items-center gap-2 px-2 text-xs text-green-500 font-bold">
                         <ShieldCheck className="w-3.5 h-3.5" />
                         SSL Verified Premium Redirection
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="design" className="focus:outline-none">
                 <AdvancedStyling 
                    data={formData.destination_url || "https://premium.qr"} 
                    settings={designSettings}
                    onSettingsChange={setDesignSettings}
                 />
              </TabsContent>
            </Tabs>

            <div className="create-animate flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30">
               <button onClick={() => navigate('/dashboard')} className="text-muted-foreground font-black uppercase tracking-widest text-xs hover:text-foreground transition-all">
                  Discard Draft
               </button>
               <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="w-full sm:w-auto h-16 px-12 text-xl bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 font-bold"
               >
                  {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Deploy Ultra-Fast QR"}
                  <ArrowRight className="ml-3 w-5 h-5" />
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
