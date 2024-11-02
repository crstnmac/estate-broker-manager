import { createFileRoute } from '@tanstack/react-router'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardContent} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Slider} from '@/components/ui/slider'
import {Label} from '@/components/ui/label'
import {Search, Home} from 'lucide-react'

export const Route = createFileRoute('/_layout/properties')({
  component: PropertiesIndex,
})

function PropertiesIndex() { 
  const properties = [
    { id: 1, address: '123 Main St', price: '$450,000', beds: 3, baths: 2, sqft: 1800, type: 'Single Family' },
    { id: 2, address: '456 Elm St', price: '$350,000', beds: 2, baths: 2, sqft: 1200, type: 'Condo' },
    { id: 3, address: '789 Oak Ave', price: '$550,000', beds: 4, baths: 3, sqft: 2200, type: 'Townhouse' },
  ];

  return (
    <div className="p-8 min-h-screen rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Property Search</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input type="text" placeholder="Enter location..." />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="singleFamily">Single Family</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Bathrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <Label>Price Range</Label>
        <Slider
          defaultValue={[0, 1000000]}
          min={0}
          max={1000000}
          step={10000}
        />
        <div className="flex justify-between mt-2">
          <span>$0</span>
          <span>$1,000,000+</span>
        </div>
      </div>

      <Button className="w-full mb-8">
        <Search className="mr-2 h-4 w-4" /> Search Properties
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardContent className="p-4">
              <div className="mb-4 h-40 bg-gray-200 flex items-center justify-center">
                <Home className="h-20 w-20 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">{property.address}</h3>
              <p className="text-lg font-bold mb-2">{property.price}</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{property.beds} beds</span>
                <span>{property.baths} baths</span>
                <span>{property.sqft} sqft</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {property.type}
              </p>
              <Button className="w-full mt-4">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
};