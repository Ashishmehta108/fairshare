import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { FileText, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { billsAPI } from '../lib/api';
import axios from 'axios';

export default function Dashboard() {
    const { currentUser } = useAuth();

    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const [billsRes, friendsRes] = await Promise.all([
                billsAPI.getBills(),
                axios.get('/api/users/me/friends'),
            ]);

            const totalOwed = billsRes.data.reduce((sum, bill) => {
                const friendShare = bill.friends.find(f => f.friendId === currentUser.id);
                return friendShare?.status === 'pending' ? sum + friendShare.amount : sum;
            }, 0);

            const totalOwing = billsRes.data
                .filter(bill => bill.userId === currentUser.id)
                .reduce((sum, bill) => {
                    const pendingFriends = bill.friends.filter(f => f.status === 'pending');
                    return sum + pendingFriends.reduce((s, f) => s + f.amount, 0);
                }, 0);

            return {
                totalBills: billsRes.data.length,
                totalFriends: friendsRes.data.length,
                totalOwed,
                totalOwing,
                recentBills: [...billsRes.data]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5),
            };
        },
    });

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-[150px] mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.totalBills}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Friends</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.totalFriends}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">You Owe</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {formatCurrency(dashboardData.totalOwing)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">You're Owed</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {formatCurrency(dashboardData.totalOwed)}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
