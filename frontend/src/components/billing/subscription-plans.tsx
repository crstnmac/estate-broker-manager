import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {Button} from '../ui/button'
import {Check} from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for individual agents',
    features: [
      '10 Active Listings',
      '2 Team Members',
      'Basic Analytics',
      'Email Support',
    ],
  },
  {
    name: 'Professional',
    price: 49,
    description: 'Best for small teams',
    features: [
      '50 Active Listings',
      '10 Team Members',
      'Advanced Analytics',
      'Priority Support',
      'Custom Reports',
    ],
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large brokerages',
    features: [
      'Unlimited Listings',
      'Unlimited Team Members',
      'Custom Analytics',
      '24/7 Support',
      'API Access',
      'White Label Options',
    ],
  },
]

export function SubscriptionPlans() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className="relative">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">${plan.price}/mo</div>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">Select Plan</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
