import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Search } from 'lucide-react';

export const Route = createFileRoute('/_layout/clients')({
  component: Clients,
})

function Clients() {
  const clients = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '(123) 456-7890', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '(234) 567-8901', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '(345) 678-9012', status: 'Active' },
  ];

  return (
    <div className="p-8 min-h-screen rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <Button><Plus className="mr-2 h-4 w-4" /> Add New Client</Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input type="text" placeholder="Search clients..." className="w-64" />
          <Button size="icon"><Search className="h-4 w-4" /></Button>
        </div>
        <div className="space-x-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.status}</TableCell>
              <TableCell>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

