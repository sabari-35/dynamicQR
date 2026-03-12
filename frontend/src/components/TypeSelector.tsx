import { 
  Globe, 
  UserPlus, 
  FileText, 
  Share2, 
  Instagram, 
  Image as ImageIcon, 
  AppWindow, 
  Briefcase, 
  Video, 
  Calendar, 
  Barcode, 
  Facebook, 
  Music, 
  Ticket, 
  MessageSquare, 
  Star 
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const QR_TYPES = [
  { id: 'website', name: 'Website', icon: <Globe />, description: 'Link to any URL' },
  { id: 'vcard', name: 'vCard Plus', icon: <UserPlus />, description: 'Share contact details' },
  { id: 'pdf', name: 'PDF', icon: <FileText />, description: 'Link to a PDF document' },
  { id: 'social', name: 'Social Media', icon: <Share2 />, description: 'Link to social profiles' },
  { id: 'instagram', name: 'Instagram', icon: <Instagram />, description: 'Link to IG profile' },
  { id: 'images', name: 'Images', icon: <ImageIcon />, description: 'Show a series of photos' },
  { id: 'app', name: 'App', icon: <AppWindow />, description: 'Link to App Stores' },
  { id: 'business', name: 'Business Page', icon: <Briefcase />, description: 'Provide company info' },
  { id: 'video', name: 'Video', icon: <Video />, description: 'Share one or more videos' },
  { id: 'event', name: 'Event', icon: <Calendar />, description: 'Promote your event' },
  { id: 'barcode', name: '2D Barcode', icon: <Barcode />, description: 'GS1 standards support' },
  { id: 'facebook', name: 'Facebook', icon: <Facebook />, description: 'Link to FB page' },
  { id: 'mp3', name: 'MP3', icon: <Music />, description: 'Play an audio file' },
  { id: 'coupons', name: 'Coupons', icon: <Ticket />, description: 'Share discounts' },
  { id: 'feedback', name: 'Feedback', icon: <MessageSquare />, description: 'Collect ratings' },
  { id: 'rating', name: 'Rating', icon: <Star />, description: 'Ask for reviews' },
]

interface TypeSelectorProps {
  selectedType: string
  onSelect: (type: string) => void
}

export function TypeSelector({ selectedType, onSelect }: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {QR_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={cn(
            "p-6 rounded-3xl border-2 text-left transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]",
            selectedType === type.id
              ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20"
              : "bg-background/40 border-border/30 hover:border-primary/50"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
            selectedType === type.id ? "bg-white/20" : "bg-primary/5 text-primary group-hover:bg-primary/10"
          )}>
            {type.icon}
          </div>
          <h3 className="font-bold text-lg mb-1">{type.name}</h3>
          <p className={cn(
            "text-xs leading-relaxed",
            selectedType === type.id ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {type.description}
          </p>
        </button>
      ))}
    </div>
  )
}
