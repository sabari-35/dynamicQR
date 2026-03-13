import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  MoreHorizontal, 
  Plus, 
  BarChart3, 
  Pencil, 
  Zap, 
  Activity, 
  Layers,
  Search,
  LayoutDashboard,
  Pause,
  Play,
  Trash2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  History
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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
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
  const [activeFilter, setActiveFilter] = useState('all') // all, active, paused
  
  const containerRef = useRef<HTMLDivElement>(null)

  const formatRelativeTime = (date: string | Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  useGSAP(() => {
    // Initial Layout Animation - Runs once
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.4 }})
    
    tl.from(".header-section > *", {
      y: 20,
      opacity: 0,
      stagger: 0.05,
    })
    .from(".stat-card", {
      y: 20,
      opacity: 0,
      stagger: 0.05,
    }, "-=0.2")
    .from(".filter-section", {
      y: 10,
      opacity: 0,
      duration: 0.4,
    }, "-=0.1")
  }, { scope: containerRef })

  useGSAP(() => {
    // QR List Animation - Runs when qrs or filter changes
    if (!loading) {
      gsap.from(".qr-card", {
        y: 20,
        opacity: 0,
        stagger: 0.03,
        duration: 0.3,
        ease: "power2.out",
        clearProps: "all"
      })
    }
  }, { scope: containerRef, dependencies: [loading, activeFilter, filteredQrs.length] })

  useEffect(() => {
    fetchData()
  }, [])

  const filteredQrs = qrs.filter(qr => {
    const name = qr.name || ''
    const dest = qr.destination_url || ''
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                         dest.toLowerCase().includes(search.toLowerCase())
    
    const qrStatus = (qr.status || 'active').toLowerCase()
    const matchesFilter = activeFilter === 'all' || qrStatus === activeFilter.toLowerCase()
    
    return matchesSearch && matchesFilter
  })

  const fetchData = async () => {
    try {
      const [statsRes, qrsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/qr/')
      ])
      setStats(statsRes.data)
      setQrs(qrsRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (qr: any) => {
    try {
      const newStatus = qr.status === 'active' ? 'paused' : 'active'
      await api.put(`/qr/${qr.id}`, { status: newStatus })
      setQrs(qrs.map(item => item.id === qr.id ? { ...item, status: newStatus } : item))
      toast.success(`QR Code ${newStatus === 'active' ? 'resumed' : 'paused'} successfully`)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return
    try {
      await api.delete(`/qr/${id}`)
      setQrs(qrs.filter(item => item.id !== id))
      toast.success('QR Code deleted')
    } catch (error) {
      toast.error('Failed to delete')
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
        downloadLink.href = pngFile;
        downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full bg-mesh min-h-screen pb-20" ref={containerRef}>
      <div className="container mx-auto p-4 md:p-8 space-y-12 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 header-section">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
               <Zap className="w-3.5 h-3.5" />
               Enterprise Dashboard
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-heading italic">MANAGE</h1>
            <p className="text-muted-foreground text-xl max-w-xl">Supercharge your dynamic redirects with advanced management controls.</p>
          </div>
          <Link to="/create">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-20 px-10 rounded-[2rem] shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-xl font-bold">
              <Plus className="w-6 h-6 mr-3" />
              CREATE QR
            </Button>
          </Link>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Reach" value={stats.total_scans} icon={<Activity />} trend="Scans globally" className="stat-card" />
          <StatCard label="Active Nodes" value={stats.total_qrs} icon={<Zap />} trend="Live connections" className="stat-card" />
          <StatCard label="Campaigns" value={stats.active_campaigns} icon={<Layers />} trend="Strategic folders" className="stat-card" />
        </div>

        {/* Management Controls */}
        <div className="space-y-8 filter-section">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="glass-card flex p-1.5 rounded-2xl">
                   {['all', 'active', 'paused'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={cn(
                          "px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                          activeFilter === f ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {f}
                      </button>
                   ))}
                </div>
             </div>
             <div className="flex items-center gap-4 flex-1 lg:max-w-md">
                <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                   <Input 
                      placeholder="Search your ecosystem..." 
                      className="pl-12 h-14 glass-card border-none bg-background/40 rounded-2xl text-lg font-medium"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                   />
                </div>
                <Button variant="outline" size="icon" className="h-14 w-14 glass-card border-none rounded-2xl">
                   <Filter className="w-5 h-5" />
                </Button>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredQrs.length === 0 ? (
                <div className="glass-card py-32 text-center rounded-[3rem]">
                  <LayoutDashboard className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">No Assets Detected</h3>
                  <p className="text-muted-foreground text-lg mb-8">Deploy your first dynamic shortcut to begin tracking.</p>
                  <Link to="/create">
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-bold">START GENERATING</Button>
                  </Link>
                </div>
            ) : (
              filteredQrs.map((qr) => (
                <div key={qr.id} className="qr-card group glass-card p-6 md:p-8 rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                       <Zap className="w-32 h-32 -mr-10 -mt-10 text-primary" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
                       {/* QR Preview Section */}
                       <div className="flex-shrink-0 flex items-center gap-6">
                           <div className="w-28 h-28 bg-white p-2 rounded-3xl shadow-2xl transition-transform group-hover:scale-110">
                              <QRCodeSVG size={96} value={`${SHORT_LINK_DOMAIN}/${qr.short_id}`} />
                           </div>
                           <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                 <Badge variant={qr.status === 'active' ? 'default' : 'secondary'} className="rounded-lg h-7 px-3 uppercase text-[10px] font-black tracking-widest">
                                    {qr.status || 'active'}
                                 </Badge>
                                 <span className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {new Date(qr.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                 </span>
                              </div>
                              <h3 className="text-2xl font-black tracking-tight">{qr.name}</h3>
                              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                 <ExternalLink className="w-4 h-4" />
                                 <span className="max-w-[200px] truncate">{qr.destination_url}</span>
                              </div>
                           </div>
                       </div>

                       {/* Stats Section */}
                       <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 py-6 lg:py-0 border-y lg:border-y-0 lg:border-x border-border/20 px-0 lg:px-10">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Scans</p>
                              <p className="text-3xl font-black italic">{qr.scan_count || 0}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Short Link</p>
                              <p className="text-lg font-bold font-mono text-accent">/r/{qr.short_id}</p>
                           </div>
                           <div className="hidden md:block space-y-1 text-right lg:text-left">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Scanned</p>
                              <p className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 lg:justify-start justify-end">
                                 <History className="w-3.5 h-3.5" />
                                 {qr.last_scanned ? formatRelativeTime(qr.last_scanned) : 'Never scanned'}
                              </p>
                           </div>
                       </div>

                       {/* Actions Section */}
                       <div className="flex-shrink-0 flex items-center gap-3">
                           <Button 
                              variant="outline" 
                              onClick={() => handleToggleStatus(qr)}
                              className="h-14 w-14 rounded-2xl border-none glass-card hover:bg-primary/10 hover:text-primary transition-all"
                           >
                              {qr.status === 'paused' ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                           </Button>
                           <Button 
                              variant="outline"
                              onClick={() => handleDownload(qr.short_id, qr.name)}
                              className="h-14 px-6 rounded-2xl border-none glass-card hover:bg-primary/10 hover:text-primary transition-all font-bold gap-2"
                           >
                              DOWNLOAD
                           </Button>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-none glass-card">
                                    <MoreHorizontal className="w-5 h-5" />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="glass-card w-56 p-2 mt-4 rounded-2xl border-none shadow-2xl">
                                 <DropdownMenuItem asChild>
                                    <Link to={`/edit/${qr.id}`} className="p-3 rounded-xl font-bold flex items-center gap-3 cursor-pointer">
                                       <Pencil className="w-4 h-4" /> Edit Content
                                    </Link>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem asChild>
                                    <Link to={`/analytics/${qr.id}`} className="p-3 rounded-xl font-bold flex items-center gap-3 cursor-pointer">
                                       <BarChart3 className="w-4 h-4" /> Insights
                                    </Link>
                                 </DropdownMenuItem>
                                 <DropdownMenuSeparator className="bg-border/20" />
                                 <DropdownMenuItem onClick={() => handleDelete(qr.id)} className="p-3 rounded-xl font-bold flex items-center gap-3 cursor-pointer text-destructive focus:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" /> Delete Asset
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                           <div className="hidden">
                               <QRCodeSVG 
                                   id={`qr-${qr.short_id}`}
                                   value={`${SHORT_LINK_DOMAIN}/${qr.short_id}`} 
                                   size={1024} 
                                   level="H" 
                               />
                           </div>
                       </div>
                    </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, trend, className }: { label: string, value: number, icon: React.ReactNode, trend: string, className?: string }) {
  return (
    <div className={cn("glass-card p-8 rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative", className)}>
       <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-6">
             <div className="flex items-center gap-3 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                <span className="p-2.5 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                   {icon}
                </span>
                {label}
             </div>
             <div className="space-y-1">
                <div className="text-6xl font-black italic tracking-tighter group-hover:text-primary transition-colors">{value.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground font-bold flex items-center gap-1.5 uppercase tracking-widest">
                   {trend}
                   <ChevronRight className="w-3 h-3 text-primary" />
                </div>
             </div>
          </div>
       </div>
       <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
    </div>
  )
}

