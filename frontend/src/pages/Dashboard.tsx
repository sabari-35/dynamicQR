import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Plus, AreaChart, Pencil, ExternalLink, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from '@/lib/api'

const SHORT_LINK_DOMAIN = import.meta.env.VITE_SHORT_LINK_DOMAIN || 'http://localhost:8000/api/r'

export default function Dashboard() {
  const [stats, setStats] = useState({ total_qrs: 0, total_scans: 0, active_campaigns: 0 })
  const [qrs, setQrs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const statsRes = await api.get('/analytics/dashboard')
      setStats(statsRes.data)

      const qrsRes = await api.get('/qr/')
      setQrs(qrsRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (shortId: string, name: string) => {
    const svg = document.getElementById(`qr-${shortId}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        
        const downloadLink = document.createElement("a");
        downloadLink.download = `${name}-dynamic-qr.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
         <Link to="/create">
            <Button className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Create QR
            </Button>
         </Link>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-2xl flex flex-col space-y-2">
             <span className="text-muted-foreground text-sm font-medium">Total Scans</span>
             <span className="text-4xl font-bold">{stats.total_scans}</span>
          </div>
          <div className="glass p-6 rounded-2xl flex flex-col space-y-2">
             <span className="text-muted-foreground text-sm font-medium">Active QR Codes</span>
             <span className="text-4xl font-bold">{stats.total_qrs}</span>
          </div>
          <div className="glass p-6 rounded-2xl flex flex-col space-y-2">
             <span className="text-muted-foreground text-sm font-medium">Active Campaigns</span>
             <span className="text-4xl font-bold">{stats.active_campaigns}</span>
          </div>
       </div>

       <div className="glass rounded-2xl p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Your QR Codes</h2>
          {qrs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                  You haven't created any QR codes yet.
              </div>
          ) : (
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Short Link</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qrs.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell className="font-medium">{qr.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{qr.destination_url}</TableCell>
                    <TableCell>
                        <a href={`${SHORT_LINK_DOMAIN}/${qr.short_id}`} target="_blank" rel="noreferrer" className="text-accent flex items-center gap-1 hover:underline">
                            /r/{qr.short_id} <ExternalLink className="w-3 h-3" />
                        </a>
                        <div className="hidden">
                           <QRCodeSVG 
                               id={`qr-${qr.short_id}`}
                               value={`${SHORT_LINK_DOMAIN}/${qr.short_id}`} 
                               size={1024} 
                               level="H" 
                               includeMargin={true} 
                           />
                        </div>
                    </TableCell>
                    <TableCell>{new Date(qr.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownload(qr.short_id, qr.name)} className="cursor-pointer font-medium flex items-center">
                              <Download className="w-4 h-4 mr-2" /> Download QR
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                             <Link to={`/edit/${qr.id}`} className="cursor-pointer font-medium flex items-center">
                                <Pencil className="w-4 h-4 mr-2" /> Edit Link
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                             <Link to={`/analytics/${qr.id}`} className="cursor-pointer font-medium flex items-center">
                                <AreaChart className="w-4 h-4 mr-2" /> Analytics
                             </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
       </div>
    </div>
  )
}
