import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Link2, LayoutTemplate, Settings2, Loader2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'

export default function CreateQR() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    destination_url: '',
    campaign_id: '',
  })

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
    <div className="container mx-auto p-6 max-w-5xl py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Form Area */}
        <div className="flex-1 space-y-6">
           <div>
             <h1 className="text-3xl font-bold tracking-tight mb-2">Create Dynamic QR</h1>
             <p className="text-muted-foreground">Configure your destination logic and customize tracking parameters.</p>
           </div>
           
           <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
              <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow"><Link2 className="w-4 h-4 mr-2"/> Destination</TabsTrigger>
              <TabsTrigger value="design" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow"><LayoutTemplate className="w-4 h-4 mr-2"/> Design</TabsTrigger>
              <TabsTrigger value="advanced" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow"><Settings2 className="w-4 h-4 mr-2"/> Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>QR Content</CardTitle>
                  <CardDescription>Enter the primary destination for your dynamic QR code.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign / QR Name <span className="text-destructive">*</span></Label>
                    <Input 
                        id="name" 
                        name="name"
                        placeholder="e.g. Summer Sale 2026 Flyer" 
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination_url">Destination URL <span className="text-destructive">*</span></Label>
                    <Input 
                        id="destination_url" 
                        name="destination_url"
                        placeholder="https://example.com/summer-sale" 
                        type="url"
                        value={formData.destination_url}
                        onChange={handleChange}
                        className="bg-transparent"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="design">
               <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Design Customization</CardTitle>
                  <CardDescription>Select colors and logo for your QR code.</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground italic text-sm py-8 text-center">Design customizer coming soon. The default premium pattern will be applied.</p>
                </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="advanced">
               <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure expiration, passwords, and link tracking.</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground italic text-sm py-8 text-center">Advanced conditions (Expiration logic, password protection) are unconfigured for this draft.</p>
                </CardContent>
               </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-8 border-t pt-6">
             <Button variant="outline" className="mr-4" onClick={() => navigate('/dashboard')}>Cancel</Button>
             <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-accent hover:bg-accent/90"
             >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate QR Code
             </Button>
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="w-full md:w-[320px] lg:w-[400px]">
           <div className="glass rounded-3xl p-6 sticky top-24 flex flex-col items-center justify-center text-center space-y-6">
              <h3 className="font-semibold text-lg">Live Preview</h3>
              <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden relative">
                 {formData.destination_url ? (
                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                        <QRCodeSVG 
                           value={formData.destination_url}
                           size={160}
                           level="H"
                           includeMargin={true}
                        />
                    </div>
                 ) : (
                    <p className="text-xs text-muted-foreground p-8">Enter a URL to preview your QR code.</p>
                 )}
              </div>
              <p className="text-sm text-muted-foreground">This is a dynamic preview. Your code will update automatically as you change settings.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
