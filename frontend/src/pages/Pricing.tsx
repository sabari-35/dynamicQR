import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for testing and personal use.",
      features: ["5 Dynamic QR Codes", "Basic Analytics", "Standard Support"],
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Everything you need for a growing business.",
      features: ["Unlimited Dynamic QR Codes", "Advanced Analytics", "Custom Designs", "Priority Support"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large scale operations and agencies.",
      features: ["Unlimited Everything", "API Access", "Custom Domains", "24/7 Phone Support"],
    }
  ]

  return (
    <div className="container py-24 mx-auto md:px-6">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Simple, transparent pricing</h2>
        <p className="mt-4 text-xl text-muted-foreground">Choose the plan that's right for you</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-8 border rounded-2xl bg-card text-card-foreground shadow-sm flex flex-col ${plan.popular ? 'border-accent shadow-[0_0_30px_-15px_var(--accent)]' : ''}`}>
            {plan.popular && (
              <div className="absolute top-0 right-8 -translate-y-1/2">
                <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                {plan.price}
                {plan.period && <span className="ml-1 text-xl font-medium text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="mt-4 text-muted-foreground">{plan.description}</p>
            </div>
            <ul className="flex-1 space-y-4 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-accent shrink-0 mr-3" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className={`w-full ${plan.popular ? 'bg-accent hover:bg-accent/90 text-white' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
              Get Started
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
