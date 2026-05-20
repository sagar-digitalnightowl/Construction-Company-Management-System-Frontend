// src/components/project/OverviewTab/CommentsCard.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/helpers';

export function CommentsCard({ comments = [], onAddComment }) {
    const [newComment, setNewComment] = useState('');
    const [adding, setAdding] = useState(false);

    const handleAdd = async () => {
        if (!newComment.trim()) return;
        setAdding(true);
        await onAddComment(newComment);
        setNewComment('');
        setAdding(false);
    };

    return (
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Comments</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2"><Input placeholder="Write a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} /><Button size="lg" onClick={handleAdd} disabled={adding}>Post</Button></div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {comments.length > 0 ? comments.map((c, i) => (
                        <div key={i} className="border rounded-md p-3 space-y-1">
                            <div className="flex justify-between items-center"><p className="text-sm font-medium">{c.userId?.name || 'Unknown'}</p><span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span></div>
                            <p className="text-sm text-muted-foreground">{c.text}</p>
                        </div>
                    )) : <p className="text-sm text-muted-foreground text-center py-6">No comments yet</p>}
                </div>
            </CardContent>
        </Card>
    );
}