// src/components/billing/PaymentMethods.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {Button} from '../ui/button'
import {CreditCard, Plus} from 'lucide-react'

export function PaymentMethods() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your payment methods and billing preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <CreditCard className="h-6 w-6" />
            <div>
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/24</p>
            </div>
          </div>
          <Button variant="outline">Edit</Button>
        </div>

        <Button className="w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </CardContent>
    </Card>
  )
}
