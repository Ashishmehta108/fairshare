import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Search, UserPlus, Trash2 } from 'lucide-react';
import { usersAPI } from '../lib/api';

export default function Friends() {
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  // Fetch friends
  const { data: friends = [], isLoading } = useQuery(['friends'], usersAPI.getFriends);

  // Add friend mutation
  const addFriend = useMutation(
    (email) => usersAPI.addFriend(email),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['friends']);
        setEmail('');
      },
    }
  );

  // Remove friend mutation
  const removeFriend = useMutation(
    (friendId) => usersAPI.removeFriend(friendId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['friends']);
      },
    }
  );

  const filteredFriends = friends.filter(friend => 
    friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (email) {
      addFriend.mutate(email);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Friends</h2>
          <p className="text-muted-foreground">
            Manage your friends and split expenses
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search friends..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <form onSubmit={handleAddFriend} className="flex space-x-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Email address"
                className="flex-1 min-w-[200px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={addFriend.isLoading}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFriends.map((friend) => (
                <TableRow key={friend._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold mr-3">
                        {friend.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      {friend.name || 'Unknown User'}
                    </div>
                  </TableCell>
                  <TableCell>{friend.email}</TableCell>
                  <TableCell>
                    {new Date(friend.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFriend.mutate(friend._id)}
                      disabled={removeFriend.isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFriends.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {friends.length === 0 ? (
                      <div className="flex flex-col items-center justify-center space-y-2 py-8">
                        <UserPlus className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No friends yet. Add some friends to get started!</p>
                      </div>
                    ) : (
                      'No friends match your search.'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      {...props}
    />
  );
}
