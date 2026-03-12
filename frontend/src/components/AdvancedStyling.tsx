import React, { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import type { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Palette, Square, Circle, Upload } from 'lucide-react'

interface AdvancedStylingProps {
  data: string
  settings: any
  onSettingsChange: (settings: any) => void
}

export function AdvancedStyling({ data, settings, onSettingsChange }: AdvancedStylingProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [qrCode] = useState<any>(new QRCodeStyling({
    width: 300,
    height: 300,
    type: 'svg',
    data: data,
    dotsOptions: {
      color: "#000000",
      type: "rounded"
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10
    }
  }))

  useEffect(() => {
    if (qrRef.current) {
        qrCode.append(qrRef.current)
    }
  }, [qrRef])

  useEffect(() => {
    qrCode.update({
      data: data,
      ...settings
    })
  }, [data, settings])

  const updateSettings = (newSettings: any) => {
    onSettingsChange({ ...settings, ...newSettings })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
            updateSettings({ image: event.target?.result as string })
        }
        reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Tabs defaultValue="dots" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 glass-card p-1 rounded-xl mb-6">
                <TabsTrigger value="dots" className="rounded-lg"><Circle className="w-4 h-4 mr-2"/> Dots</TabsTrigger>
                <TabsTrigger value="corners" className="rounded-lg"><Square className="w-4 h-4 mr-2"/> Corners</TabsTrigger>
                <TabsTrigger value="colors" className="rounded-lg"><Palette className="w-4 h-4 mr-2"/> Colors</TabsTrigger>
                <TabsTrigger value="logo" className="rounded-lg"><Upload className="w-4 h-4 mr-2"/> Logo</TabsTrigger>
            </TabsList>

            <TabsContent value="dots" className="space-y-4 pt-4">
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dot Style</Label>
                    <Select value={settings.dotsOptions?.type || 'rounded'} onValueChange={(v) => updateSettings({ dotsOptions: { ...settings.dotsOptions, type: v as DotType } })}>
                        <SelectTrigger className="glass-card h-12 rounded-xl">
                            <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent className="glass shadow-2xl rounded-xl">
                            <SelectItem value="rounded">Rounded</SelectItem>
                            <SelectItem value="dots">Dots</SelectItem>
                            <SelectItem value="classy">Classy</SelectItem>
                            <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </TabsContent>

            <TabsContent value="corners" className="space-y-4 pt-4">
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Corner Square Style</Label>
                    <Select value={settings.cornersSquareOptions?.type || 'extra-rounded'} onValueChange={(v) => updateSettings({ cornersSquareOptions: { ...settings.cornersSquareOptions, type: v as CornerSquareType } })}>
                        <SelectTrigger className="glass-card h-12 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass shadow-2xl rounded-xl">
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="dot">Dot</SelectItem>
                            <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Corner Dot Style</Label>
                    <Select value={settings.cornersDotOptions?.type || 'dot'} onValueChange={(v) => updateSettings({ cornersDotOptions: { ...settings.cornersDotOptions, type: v as CornerDotType } })}>
                        <SelectTrigger className="glass-card h-12 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass shadow-2xl rounded-xl">
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="dot">Dot</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">QR Color</Label>
                        <div className="flex gap-3">
                            <Input 
                                type="color" 
                                value={settings.dotsOptions?.color || "#000000"} 
                                onChange={(e) => updateSettings({ dotsOptions: { ...settings.dotsOptions, color: e.target.value } })}
                                className="w-12 h-12 p-1 rounded-xl bg-transparent border-none cursor-pointer"
                            />
                            <Input 
                                type="text" 
                                value={settings.dotsOptions?.color || "#000000"} 
                                onChange={(e) => updateSettings({ dotsOptions: { ...settings.dotsOptions, color: e.target.value } })}
                                className="h-12 glass-card rounded-xl font-mono"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Background</Label>
                        <div className="flex gap-3">
                            <Input 
                                type="color" 
                                value={settings.backgroundOptions?.color || "#ffffff"} 
                                onChange={(e) => updateSettings({ backgroundOptions: { ...settings.backgroundOptions, color: e.target.value } })}
                                className="w-12 h-12 p-1 rounded-xl bg-transparent border-none cursor-pointer"
                            />
                            <Input 
                                type="text" 
                                value={settings.backgroundOptions?.color || "#ffffff"} 
                                onChange={(e) => updateSettings({ backgroundOptions: { ...settings.backgroundOptions, color: e.target.value } })}
                                className="h-12 glass-card rounded-xl font-mono"
                            />
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="logo" className="space-y-4 pt-4">
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brand Logo</Label>
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            className="w-full h-12 rounded-xl border-dashed border-2 hover:border-primary/50 transition-all bg-primary/5"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload PNG/SVG
                        </Button>
                        <input 
                            id="logo-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        <Card className="p-6 rounded-[2.5rem] glass-card border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <div ref={qrRef} className="relative z-10 bg-white p-4 rounded-3xl" />
        </Card>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">Styling Preview Engine</p>
      </div>
    </div>
  )
}
