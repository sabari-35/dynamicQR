import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Save, Sparkles, Globe, Link2, Zap, ShieldCheck, Smartphone, Pencil } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import api from '@/lib/api'
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const SHORT_LINK_DOMAIN = import.meta.env.VITE_SHORT_LINK_DOMAIN || 'http://localhost:8000/api/r'

export default function EditQR() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [qr, setQr] = useState<any>(null)
  const [destinationUrl, setDestinationUrl] = useState('')
  const [name, setName] = useState('')
  
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!loading && qr) {
      const tl = gsap.timeline()
      tl.from(".edit-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .from(".edit-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")
      .from(previewRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, "-=0.6")
    }
  }, [loading, qr])

  useEffect(() => {
    if (id) fetchQR()
  }, [id])

  const fetchQR = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/qr/${id}`)
      setQr(res.data)
      setDestinationUrl(res.data.destination_url)
      setName(res.data.name)
    } catch (error: any) {
      toast.error('Failed to load QR code')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destinationUrl.trim()) {
      toast.error('Destination URL is required')
      return
    }
    try {
      setSaving(true)
      await api.put(`/qr/${id}`, { name, destination_url: destinationUrl })
      toast.success('QR Code updated! All scans will now redirect to the new URL.')
      navigate('/dashboard')
    } catch (error: any) {
      const detail = error.response?.data?.detail
      if (typeof detail === 'string') toast.error(detail)
      else if (Array.isArray(detail)) toast.error(`Validation Error: ${detail[0]?.msg}`)
      else toast.error('Failed to update QR code')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const shortLink = qr ? `${SHORT_LINK_DOMAIN}/${qr.short_id}` : ''

  return (
    <div className="w-full bg-mesh min-h-screen" ref={containerRef}>
      <div className="container mx-auto p-4 md:p-8 max-w-7xl py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Main Edit Area */}
          <div className="flex-1 space-y-10">
            <div className="edit-header space-y-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="group text-muted-foreground hover:text-foreground p-0 hover:bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Button>
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Update Campaign</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight font-heading">Refine your <span className="text-gradient">Destination</span></h1>
                <p className="text-muted-foreground text-lg max-w-2xl">Modify the logic behind your dynamic shortcut. Your physical QR image remains unchanged.</p>
              </div>
            </div>
            
            <Card className="edit-card glass-card border-none shadow-2xl p-4 md:p-8">
              <CardHeader className="px-1 md:px-0">
                <CardTitle className="text-2xl font-bold font-heading">Asset Configuration</CardTitle>
                <CardDescription className="text-md">Maintain campaign relevance by updating its redirection parameters.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSave} className="space-y-8 px-1 md:px-0 pt-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Asset Identity</Label>
                    <div className="relative">
                       <Input
                         id="name"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         placeholder="e.g. Summer Sale Campaign"
                         className="h-14 bg-background/40 border-border/30 rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                       />
                       <Pencil className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="destination_url" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Destination <span className="text-primary">*</span></Label>
                    <div className="relative">
                       <Input
                         id="destination_url"
                         type="url"
                         value={destinationUrl}
                         onChange={(e) => setDestinationUrl(e.target.value)}
                         placeholder="https://new-destination.com/page"
                         className="h-14 bg-background/40 border-border/30 rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                         required
                       />
                       <Globe className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 px-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Instantly updates all physical prints of this QR code safely.
                    </p>
                  </div>

                  {qr && (
                    <div className="mt-6 p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                      <p className="text-xs text-primary font-bold uppercase tracking-widest">Permanent Short link</p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-mono truncate opacity-80">{shortLink}</span>
                        <a
                          href={shortLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <ArrowRight className="w-4 h-4 rotate-[-45deg]" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" size="lg" className="h-14 px-8 rounded-xl font-bold" onClick={() => navigate('/dashboard')}>
                    Discard Changes
                  </Button>
                  <Button type="submit" size="lg" disabled={saving} className="h-14 px-10 bg-primary text-primary-foreground rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 font-bold">
                    {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Synchronize Update
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* QR Preview Pane */}
          <div className="w-full lg:w-[450px]" ref={previewRef}>
             <div className="glass-card rounded-[2.5rem] p-10 lg:sticky lg:top-32 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-purple-500 opacity-50" />
                
                <h3 className="font-black text-2xl font-heading tracking-tight flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-primary" />
                   Physical Preview
                </h3>
                
                <div className="relative group perspective-1000">
                  <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:rotate-x-12 group-hover:rotate-y-12 shadow-primary/20 border-8 border-background/5">
                     {shortLink ? (
                        <QRCodeSVG 
                           value={shortLink} 
                           size={220} 
                           level="H" 
                           className="relative z-10 p-2"
                        />
                     ) : (
                        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground/30" />
                     )}
                  </div>
                  <div className="absolute -inset-4 bg-primary/5 blur-3xl -z-10 rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    This QR signature is locked and permanent. Changing the destination URL will not require re-printing your assets.
                  </p>
                  <div className="flex items-center justify-center gap-6 pt-2">
                     <div className="flex flex-col items-center gap-1">
                        <span className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                           <Link2 className="w-5 h-5" />
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Immutable</span>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <span className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                           <Zap className="w-5 h-5" />
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Instant</span>
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

