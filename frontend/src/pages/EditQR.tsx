import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import api from '@/lib/api'

const SHORT_LINK_DOMAIN = import.meta.env.VITE_SHORT_LINK_DOMAIN || 'http://localhost:8000/api/r'

export default function EditQR() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [qr, setQr] = useState<any>(null)
  const [destinationUrl, setDestinationUrl] = useState('')
  const [name, setName] = useState('')

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
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  const shortLink = qr ? `${SHORT_LINK_DOMAIN}/${qr.short_id}` : ''

  return (
    <div className="container mx-auto p-6 max-w-4xl py-12">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit QR Code</h1>
          <p className="text-muted-foreground">Update the destination URL. Your QR code image stays the same.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Edit Form */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="glass border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Link Settings</CardTitle>
                <CardDescription>Change where this QR code redirects to.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">QR Code Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Summer Sale Campaign"
                    className="bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination_url">Destination URL <span className="text-destructive">*</span></Label>
                  <Input
                    id="destination_url"
                    type="url"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    placeholder="https://new-destination.com/page"
                    className="bg-transparent"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This changes where the QR code redirects to — without changing the QR image itself.
                  </p>
                </div>

                {qr && (
                  <div className="mt-4 p-4 bg-muted/40 rounded-xl border border-border space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Short Link (permanent)</p>
                    <a
                      href={shortLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent text-sm font-mono hover:underline"
                    >
                      {shortLink}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-accent hover:bg-accent/90">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* QR Preview */}
        <div className="w-full md:w-64 shrink-0">
          <div className="glass rounded-3xl p-6 flex flex-col items-center text-center space-y-4 sticky top-24">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">QR Preview</h3>
            {shortLink ? (
              <div className="bg-white rounded-2xl p-3 shadow-inner">
                <QRCodeSVG value={shortLink} size={160} level="H" includeMargin />
              </div>
            ) : (
              <div className="w-[160px] h-[160px] bg-muted rounded-2xl flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              This QR image stays the same. Only the destination URL changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
