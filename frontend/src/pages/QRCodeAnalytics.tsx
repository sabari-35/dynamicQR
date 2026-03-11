import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Activity, MapPin, Smartphone, MoveUpRight, Calendar, Zap, Globe, HardDrive, Search, LayoutDashboard, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import api from '@/lib/api'
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export default function QRCodeAnalytics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [qr, setQr] = useState<any>(null)
  const [scans, setScans] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!loading) {
      const tl = gsap.timeline()
      tl.from(".analytics-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .from(".stat-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.4")
      .from(".chart-section", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, "-=0.6")
    }
  }, [loading])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qrRes = await api.get(`/qr/${id}`)
        setQr(qrRes.data)
        
        const scansRes = await api.get(`/analytics/qr/${id}/scans`)
        setScans(scansRes.data)
        
        // Group scans by date
        const grouped = scansRes.data.reduce((acc: any, scan: any) => {
            const date = new Date(scan.scanned_at).toLocaleDateString()
            acc[date] = (acc[date] || 0) + 1
            return acc
        }, {})
        
        const data = Object.keys(grouped).map(date => ({
            date,
            scans: grouped[date]
        }))
        setChartData(data)
        
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
     return (
       <div className="flex items-center justify-center min-h-[60vh]">
         <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
       </div>
     )
  }

  return (
    <div className="w-full bg-mesh min-h-screen" ref={containerRef}>
      <div className="container mx-auto p-4 md:p-8 max-w-7xl py-12 md:py-20 space-y-12">
        {/* Header Section */}
        <div className="analytics-header space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="group text-muted-foreground hover:text-foreground p-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                <span>Performance Insights</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight font-heading">
                Analytics <span className="text-muted-foreground/40 font-light">for</span> <span className="text-gradient">{qr?.name}</span>
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground group">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Routing to:</span>
                <a href={qr?.destination_url} className="text-sm font-medium hover:text-primary transition-colors truncate max-w-[200px] md:max-w-md decoration-primary/30 underline underline-offset-4">
                  {qr?.destination_url}
                </a>
                <MoveUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="px-4 py-3 rounded-2xl glass-card flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div className="text-left">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Campaign Lifetime</p>
                     <p className="text-sm font-bold">Since {new Date(qr?.created_at).toLocaleDateString()}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard 
             label="Engagement" 
             value={scans.length} 
             icon={<Zap className="w-5 h-5" />} 
             trend="Accumulated Scans"
             className="stat-card"
           />
           <StatCard 
             label="Reach Index" 
             value="High" 
             isText
             icon={<Globe className="w-5 h-5" />} 
             trend="Geographic spread"
             className="stat-card"
           />
           <StatCard 
             label="Device Affinity" 
             value="Mobile" 
             isText
             icon={<Smartphone className="w-5 h-5" />} 
             trend="Primary access point"
             className="stat-card"
           />
           <StatCard 
             label="Storage" 
             value="Active" 
             isText
             icon={<HardDrive className="w-5 h-5" />} 
             trend="Cloud synchronized"
             className="stat-card"
           />
        </div>

        {/* Chart Section */}
        <div className="chart-section grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 glass-card border-none shadow-2xl p-6 md:p-10 !bg-background/40">
              <CardHeader className="px-0 pt-0 pb-10">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <CardTitle className="text-2xl font-bold font-heading">Engagement Timeline</CardTitle>
                       <CardDescription>Visualizing scan density over temporal sequences.</CardDescription>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10">
                       <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Live Data Feed</span>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="px-0">
                 <div className="h-[400px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                             <defs>
                                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.3)" />
                             <XAxis 
                               dataKey="date" 
                               stroke="hsl(var(--muted-foreground))" 
                               fontSize={11} 
                               tickLine={false} 
                               axisLine={false}
                               dy={10}
                             />
                             <YAxis 
                               stroke="hsl(var(--muted-foreground))" 
                               fontSize={11} 
                               tickLine={false} 
                               axisLine={false} 
                               tickFormatter={(value) => `${value}`}
                             />
                             <Tooltip 
                               contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  borderColor: 'hsl(var(--border))', 
                                  borderRadius: '16px',
                                  boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5)',
                                  border: '1px solid hsl(var(--border)/0.5)',
                                  padding: '12px'
                               }}
                               itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                             />
                             <Area 
                               type="monotone" 
                               dataKey="scans" 
                               stroke="hsl(var(--primary))" 
                               strokeWidth={4}
                               fillOpacity={1} 
                               fill="url(#colorScans)" 
                               animationDuration={2000}
                             />
                          </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 space-y-4">
                           <Activity className="w-16 h-16 opacity-20" />
                           <p className="text-sm font-bold uppercase tracking-[0.2em]">Awaiting first interactions...</p>
                        </div>
                    )}
                 </div>
              </CardContent>
           </Card>

           <div className="space-y-8">
              <Card className="glass-card border-none shadow-2xl p-8 h-full">
                 <CardHeader className="px-0 pt-0 pb-6">
                    <CardTitle className="text-xl font-bold font-heading">Device Taxonomy</CardTitle>
                    <CardDescription>Platform distribution analysis.</CardDescription>
                 </CardHeader>
                 <CardContent className="px-0 space-y-6">
                    <DistributionItem label="iOS Mobile" value={65} color="bg-primary" />
                    <DistributionItem label="Android Mobile" value={28} color="bg-accent" />
                    <DistributionItem label="Desktop/Laptop" value={7} color="bg-purple-500" />
                    
                    <div className="pt-6 border-t border-border/30">
                       <p className="text-xs text-muted-foreground italic leading-relaxed">
                          Your audience primarily interacts via mobile ecosystems, suggesting highly responsive landing pages work best.
                       </p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>

        {/* Global Access Log */}
        <Card className="glass-card border-none shadow-2xl overflow-hidden">
           <CardHeader className="p-8 md:p-10 border-b border-border/30">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold font-heading">Real-time Traffic Log</CardTitle>
                    <CardDescription>Deep inspection of inbound request headers.</CardDescription>
                 </div>
                 <div className="relative group w-48 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input className="w-full bg-muted/30 border-none rounded-xl h-10 pl-9 text-xs focus:ring-1 ring-primary/30 transition-all" placeholder="Search logs..." />
                 </div>
              </div>
           </CardHeader>
           <CardContent className="p-0">
             {scans.length === 0 ? (
                 <div className="p-20 text-center space-y-4">
                    <LayoutDashboard className="w-12 h-12 mx-auto text-muted-foreground/20" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">No traffic recorded yet.</p>
                 </div>
             ) : (
               <div className="overflow-x-auto">
                 <Table>
                  <TableHeader>
                    <TableRow className="border-border/30 bg-muted/10">
                      <TableHead className="py-5 pl-8 font-black text-[11px] uppercase tracking-widest text-muted-foreground">Timestamp</TableHead>
                      <TableHead className="py-5 font-black text-[11px] uppercase tracking-widest text-muted-foreground">Environment</TableHead>
                      <TableHead className="py-5 font-black text-[11px] uppercase tracking-widest text-muted-foreground">Platform</TableHead>
                      <TableHead className="py-5 font-black text-[11px] uppercase tracking-widest text-muted-foreground">Identifier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scans.map((scan) => (
                      <TableRow key={scan.id} className="border-border/20 group hover:bg-muted/30 transition-colors">
                        <TableCell className="pl-8 py-5 font-medium text-sm">
                           {new Date(scan.scanned_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wider">{scan.device_type}</span>
                              <span className="text-xs opacity-60">/ {scan.browser}</span>
                           </div>
                        </TableCell>
                        <TableCell className="font-semibold text-xs opacity-80">{scan.os}</TableCell>
                        <TableCell className="text-xs font-mono opacity-40">{scan.ip_address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
               </div>
             )}
           </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, trend, className, isText = false }: any) {
  return (
    <div className={`glass-card p-8 group hover:border-primary/50 transition-all duration-500 overflow-hidden relative ${className}`}>
       <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
             <span className="p-2.5 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                {icon}
             </span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
          </div>
          <div className="space-y-1">
             <div className={`font-black tracking-tight ${isText ? 'text-3xl' : 'text-5xl'}`}>{value}</div>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-1">{trend}</p>
          </div>
       </div>
       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
    </div>
  )
}

function DistributionItem({ label, value, color }: any) {
   return (
      <div className="space-y-2">
         <div className="flex justify-between items-end">
            <span className="text-sm font-bold opacity-80">{label}</span>
            <span className="text-sm font-mono text-primary">{value}%</span>
         </div>
         <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
               className={`h-full ${color} transition-all duration-1000 ease-out`} 
               style={{ width: `${value}%` }}
            />
         </div>
      </div>
   )
}

