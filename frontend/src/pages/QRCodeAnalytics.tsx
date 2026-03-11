import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Activity, MapPin, Smartphone, MoveUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import api from '@/lib/api'

export default function QRCodeAnalytics() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [qr, setQr] = useState<any>(null)
  const [scans, setScans] = useState<any[]>([])
  
  // Aggregate data for chart (mocking aggregation logic on client for simplicity)
  const [chartData, setChartData] = useState<any[]>([])

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
     return <div className="p-12 text-center text-muted-foreground">Loading analytics...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
       <div className="flex items-center space-x-4 mb-8">
          <Link to="/dashboard">
             <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5"/>
             </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics: {qr?.name}</h1>
            <p className="text-muted-foreground flex items-center mt-1">
                 Destination: <a href={qr?.destination_url} className="text-accent underline ml-1 mx-2">{qr?.destination_url}</a> <MoveUpRight className="w-3 h-3" />
            </p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass border-0 shadow-lg">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center"><Activity className="w-4 h-4 mr-2"/> Total Scans</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-4xl font-bold">{scans.length}</div>
             </CardContent>
          </Card>
          <Card className="glass border-0 shadow-lg">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center"><MapPin className="w-4 h-4 mr-2"/> Top Location</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-4xl font-bold">Unknown</div>
             </CardContent>
          </Card>
          <Card className="glass border-0 shadow-lg">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center"><Smartphone className="w-4 h-4 mr-2"/> Top Device</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-4xl font-bold">Mobile</div>
             </CardContent>
          </Card>
       </div>

       <Card className="glass border-0 shadow-lg">
           <CardHeader>
               <CardTitle>Scan Timeline</CardTitle>
               <CardDescription>Number of scans over the last period.</CardDescription>
           </CardHeader>
           <CardContent>
               <div className="h-[300px] w-full">
                  {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                          <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}/>
                          <Bar dataKey="scans" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No scan data available yet.</div>
                  )}
               </div>
           </CardContent>
       </Card>

       <Card className="glass border-0 shadow-lg mt-8">
          <CardHeader>
              <CardTitle>Recent Scans (Raw Log)</CardTitle>
          </CardHeader>
          <CardContent>
             {scans.length === 0 ? (
                 <p className="text-muted-foreground py-4">No scans recorded.</p>
             ) : (
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>IP / Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell>{new Date(scan.scanned_at).toLocaleString()}</TableCell>
                      <TableCell className="capitalize">{scan.device_type}</TableCell>
                      <TableCell>{scan.os}</TableCell>
                      <TableCell>{scan.browser}</TableCell>
                      <TableCell>{scan.ip_address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
             )}
          </CardContent>
       </Card>
    </div>
  )
}
