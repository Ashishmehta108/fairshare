import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billsAPI } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Loader2 } from "lucide-react";

export default function Bills() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const {
        data: bills = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["bills"],
        queryFn: billsAPI.getBills,
    });

    const uploadImage = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "your_unsigned_preset");

        setUploading(true);
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/<your_cloud_name>/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );
        setUploading(false);
        const json = await res.json();
        return json.secure_url;
    };

    const createBill = useMutation({
        mutationFn: async ({ title, amount, file }) => {
            let imageUrl = null;
            if (file) {
                imageUrl = await uploadImage(file);
            }
            return billsAPI.createBill({ title, amount, imageUrl });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
            setTitle("");
            setAmount("");
            setFile(null);
        },
    });

    const deleteBill = useMutation({
        mutationFn: (id) => billsAPI.deleteBill(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });

    const updateBillStatus = useMutation({
        mutationFn: ({ billId, friendId, status }) =>
            billsAPI.updateBillStatus(billId, friendId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-500 mt-6">
                Failed to load bills: {error.message}
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <Card className="p-4 max-w-3xl container mx-auto space-y-4">
                <CardHeader>
                    <CardTitle>Create a New Bill</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!title || !amount) return;
                            createBill.mutate({ title, amount, file });
                        }}
                        className="flex flex-col gap-3"
                    >
                        <Input
                            placeholder="Bill Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Input
                            placeholder="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <Button
                            type="submit"
                            disabled={createBill.isPending || uploading}
                        >
                            {uploading
                                ? "Uploading..."
                                : createBill.isPending
                                    ? "Creating..."
                                    : "Add Bill"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {bills.data.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">No bills yet</p>
            ) : (
                bills.data.map((bill) => (
                    <Card key={bill._id} className="shadow-md">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>{bill.title}</CardTitle>
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={deleteBill.isPending}
                                onClick={() => deleteBill.mutate(bill._id)}
                            >
                                {deleteBill.isPending ? "Deleting..." : "Delete"}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p>Total Amount: ₹{bill.amount}</p>
                            {bill.imageUrl && (
                                <img
                                    src={bill.imageUrl}
                                    alt="Bill"
                                    className="mt-2 rounded-lg max-h-48 object-cover"
                                />
                            )}
                            <div className="mt-2">
                                <h4 className="font-semibold">Friends:</h4>
                                {bill.friends.map((friend) => (
                                    <div
                                        key={friend._id}
                                        className="flex justify-between items-center border-b py-2"
                                    >
                                        <span>{friend.name}</span>
                                        <span>{friend.status}</span>
                                        <Button
                                            size="sm"
                                            disabled={updateBillStatus.isPending}
                                            onClick={() =>
                                                updateBillStatus.mutate({
                                                    billId: bill._id,
                                                    friendId: friend._id,
                                                    status: "paid",
                                                })
                                            }
                                        >
                                            {updateBillStatus.isPending
                                                ? "Updating..."
                                                : "Mark Paid"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
