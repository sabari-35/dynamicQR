import { useEffect, useState, useRef } from 'react'
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
import { 
  MoreHorizontal, 
  Plus, 
  BarChart3, 
  Pencil, 
  Download, 
  Zap, 
  Activity, 
  Layers,
  ArrowUpRight,
  Search,
  Settings2,
  LayoutDashboard
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const SHORT_LINK_DOMAIN = import.meta.env.VITE_SHORT_LINK_DOMAIN || 'http://localhost:8000/api/r'

export default function Dashboard() {
  const [stats, setStats] = useState({ total_qrs: 0, total_scans: 0, active_campaigns: 0 })
  const [qrs, setQrs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!loading) {
      const tl = gsap.timeline()
      tl.from(".stat-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      })
      .from(".table-section", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, "-=0.4")
    }
  }, [loading])

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

  const filteredQrs = qrs.filter(qr => 
    qr.name.toLowerCase().includes(search.toLowerCase()) || 
    qr.destination_url.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full bg-mesh min-h-screen" ref={containerRef}>
      <div className="container mx-auto p-4 md:p-8 space-y-12 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight font-heading">Dashboard</h1>
            <p className="text-muted-foreground text-lg">Manage your dynamic ecosystem at a glance.</p>
          </div>
          <Link to="/create">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Plus className="w-5 h-5 mr-2" />
              Create New QR
            </Button>
          </Link>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label="Total Scans" 
            value={stats.total_scans} 
            icon={<Activity className="w-6 h-6" />}
            trend="+12% from last week"
            className="stat-card"
          />
          <StatCard 
            label="Active QR Codes" 
            value={stats.total_qrs} 
            icon={<Zap className="w-6 h-6" />}
            trend="Live and active"
            className="stat-card"
          />
          <StatCard 
            label="Managed Campaigns" 
            value={stats.active_campaigns} 
            icon={<Layers className="w-6 h-6" />}
            trend="Across all folders"
            className="stat-card"
          />
        </div>

        {/* Assets Section */}
        <div className="table-section space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <h2 className="text-2xl font-bold flex items-center gap-2 font-heading">
               Your QR Assets 
               <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{qrs.length} items</span>
             </h2>
             <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                      placeholder="Search QR codes..." 
                      className="pl-10 h-11 glass-card border-none bg-background/40"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                   />
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11 glass-card">
                   <Settings2 className="w-4 h-4" />
                </Button>
             </div>
          </div>

          <div className="glass-card overflow-hidden">
            {filteredQrs.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                     <LayoutDashboard className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No QR codes found</h3>
                  <p className="text-muted-foreground mb-8">Ready to create your first dynamic shortcut?</p>
                  <Link to="/create">
                    <Button variant="outline">Create Now</Button>
                  </Link>
                </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="py-5 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">Asset Name</TableHead>
                      <TableHead className="py-5 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">Destination</TableHead>
                      <TableHead className="py-5 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">Short Link</TableHead>
                      <TableHead className="py-5 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">Age</TableHead>
                      <TableHead className="py-5 font-bold uppercase tracking-wider text-[11px] text-muted-foreground text-right">Settings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQrs.map((qr) => (
                      <TableRow key={qr.id} className="border-border/20 group hover:bg-muted/30 transition-colors">
                        <TableCell>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white p-1 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                 <QRCodeSVG size={32} value={`${SHORT_LINK_DOMAIN}/${qr.short_id}`} />
                              </div>
                              <span className="font-semibold text-base">{qr.name}</span>
                           </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate py-6">
                           <span className="text-muted-foreground group-hover:text-foreground transition-colors">{qr.destination_url}</span>
                        </TableCell>
                        <TableCell>
                            <a 
                              href={`${SHORT_LINK_DOMAIN}/${qr.short_id}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm hover:bg-accent/20 transition-all border border-accent/20"
                            >
                                /r/{qr.short_id} <ArrowUpRight className="w-3.5 h-3.5" />
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
                        <TableCell className="text-muted-foreground font-medium">
                           {new Date(qr.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-muted/80 rounded-xl">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-card w-56 p-2 mt-2">
                              <DropdownMenuItem onClick={() => handleDownload(qr.short_id, qr.name)} className="cursor-pointer font-medium p-3 rounded-xl flex items-center transition-all bg-primary/5 hover:bg-primary/20 text-primary mb-1">
                                  <Download className="w-4 h-4 mr-2" /> Download High-Res
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border/20" />
                              <DropdownMenuItem asChild>
                                 <Link to={`/edit/${qr.id}`} className="cursor-pointer font-medium p-3 rounded-xl flex items-center hover:bg-muted transition-all">
                                    <Pencil className="w-4 h-4 mr-2" /> Edit Destination
                                 </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                 <Link to={`/analytics/${qr.id}`} className="cursor-pointer font-medium p-3 rounded-xl flex items-center hover:bg-muted transition-all">
                                    <BarChart3 className="w-4 h-4 mr-2" /> View Insights
                                 </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, trend, className }: { label: string, value: number, icon: React.ReactNode, trend: string, className?: string }) {
  return (
    <div className={cn("glass-card p-8 group hover:border-primary/50 transition-all duration-500 overflow-hidden relative", className)}>
       <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <span className="p-2 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                   {icon}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
             </div>
             <div className="space-y-1">
                <div className="text-5xl font-black tracking-tight">{value}</div>
                <div className="text-sm text-green-500 font-medium flex items-center gap-1">
                   <ArrowUpRight className="w-3 h-3" />
                   {trend}
                </div>
             </div>
          </div>
       </div>
       
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
    </div>
  )
}

